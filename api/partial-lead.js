const ALLOWED_ORIGINS = new Set([
  "https://lucascoacharete.com",
  "https://www.lucascoacharete.com",
]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_ANSWER_KEYS = 60;
const MAX_STRING_LENGTH = 2_000;
const UPSTREAM_TIMEOUT_MS = 8_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimits = new Map();

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
}

function isAllowedOrigin(origin) {
  if (ALLOWED_ORIGINS.has(origin)) return true;
  const isProduction = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (isProduction) return false;

  try {
    const url = new URL(origin);
    return (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      (url.protocol === "http:" || url.protocol === "https:");
  } catch {
    return false;
  }
}

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
}

function isRateLimited(req) {
  const now = Date.now();
  const ip = clientIp(req);
  const current = rateLimits.get(ip);
  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimits.set(ip, { count: 1, startedAt: now });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function cleanString(value, maxLength = MAX_STRING_LENGTH) {
  if (value === null || value === undefined) return "";
  return Array.from(String(value), (character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127 ? " " : character;
  }).join("").trim().slice(0, maxLength);
}

function sanitizeAnswerValue(value, depth = 0) {
  if (depth > 4) return null;
  if (value === null || typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") return cleanString(value);
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => sanitizeAnswerValue(item, depth + 1));
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, MAX_ANSWER_KEYS)
        .map(([key, item]) => [cleanString(key, 100), sanitizeAnswerValue(item, depth + 1)]),
    );
  }
  return "";
}

function parseBody(req) {
  if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString("utf8"));
  if (typeof req.body === "string") return JSON.parse(req.body);
  return req.body;
}

export default async function handler(req, res) {
  const requestId = req.headers["x-vercel-id"] || crypto.randomUUID();

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }
  if (!isAllowedOrigin(req.headers.origin)) return json(res, 403, { ok: false, error: "Origin not allowed" });
  if (isRateLimited(req)) return json(res, 429, { ok: false, error: "Too many requests" });

  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) return json(res, 413, { ok: false, error: "Payload too large" });

  let body;
  try {
    body = parseBody(req);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
    if (Buffer.byteLength(JSON.stringify(body), "utf8") > MAX_BODY_BYTES) {
      return json(res, 413, { ok: false, error: "Payload too large" });
    }
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON body" });
  }

  const email = cleanString(body.email, 320).toLowerCase();
  const phone = cleanString(body.phone, 40);
  const hasEmail = EMAIL_PATTERN.test(email);
  const hasPhone = phone.replace(/\D/g, "").length >= 7;
  if (!hasEmail && !hasPhone) {
    return json(res, 422, { ok: false, error: "A valid email or phone is required" });
  }

  const fullName = cleanString(body.fullName, 200) || phone || email;
  const answers = body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)
    ? sanitizeAnswerValue(body.answers)
    : {};
  const payload = {
    eventType: body.eventType === "update" ? "update" : "initial",
    variant: "A",
    fullName,
    email,
    phone,
    instagram: cleanString(body.instagram, 200),
    role: cleanString(body.role, 300),
    mainProblem: cleanString(body.mainProblem),
    revenue: cleanString(body.revenue, 300),
    urgency: cleanString(body.urgency, 300),
    investment: cleanString(body.investment, 300),
    answers,
    pageUrl: cleanString(body.pageUrl, 2_048),
    capturedAt: cleanString(body.capturedAt, 100) || new Date().toISOString(),
  };

  const webhookUrl = process.env.N8N_PARTIAL_LEAD_WEBHOOK_URL;
  const webhookSecret = process.env.PARTIAL_LEAD_WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret) {
    console.error("Partial lead configuration missing", { requestId });
    return json(res, 500, { ok: false, error: "Server configuration error" });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": webhookSecret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error("Partial lead upstream rejected request", { requestId, status: response.status });
      return json(res, 502, { ok: false, error: "Upstream service rejected the request" });
    }
    return json(res, 200, { ok: true, eventType: payload.eventType });
  } catch (error) {
    console.error("Partial lead upstream request failed", {
      requestId,
      error: error?.name === "TimeoutError" ? "timeout" : "network_error",
    });
    return json(res, 502, { ok: false, error: "Upstream service unavailable" });
  }
}
