import { useEffect, useRef } from "react";

const GHL_ORIGIN = "https://links.iqautomated.io";
const MESSAGE_TYPE = "ghl-form-progress";
const DEBOUNCE_MS = 500;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(value) {
  if (typeof value !== "string" && typeof value !== "number") return "";
  return String(value).trim().replace(/(?!^\+)\D/g, "");
}

function hasValidPhone(value) {
  return value.replace(/\D/g, "").length >= 7;
}

function normalizePayload(message) {
  const source =
    message.payload && typeof message.payload === "object"
      ? message.payload
      : message.data && typeof message.data === "object"
        ? message.data
        : message;
  const email = typeof source.email === "string" ? source.email.trim().toLowerCase() : "";
  const phone = normalizePhone(source.phone);

  if (!EMAIL_PATTERN.test(email) && !hasValidPhone(phone)) return null;

  return {
    eventType: (source.eventType ?? message.eventType) === "update" ? "update" : "initial",
    fullName: typeof source.fullName === "string" ? source.fullName.trim() : "",
    email,
    phone,
    instagram: source.instagram ?? "",
    role: source.role ?? "",
    mainProblem: source.mainProblem ?? "",
    revenue: source.revenue ?? "",
    urgency: source.urgency ?? "",
    investment: source.investment ?? "",
    answers:
      source.answers && typeof source.answers === "object" && !Array.isArray(source.answers)
        ? source.answers
        : {},
    pageUrl: typeof source.pageUrl === "string" ? source.pageUrl : window.location.href,
    capturedAt: typeof source.capturedAt === "string" ? source.capturedAt : new Date().toISOString(),
  };
}

export default function useGhlLeadCapture(iframeRef) {
  const timerRef = useRef(null);
  const pendingRef = useRef(null);
  const lastSentSnapshotRef = useRef("");

  useEffect(() => {
    const sendPending = async () => {
      const pending = pendingRef.current;
      pendingRef.current = null;
      if (!pending || pending.snapshot === lastSentSnapshotRef.current) return;

      try {
        const response = await fetch("/api/partial-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pending.payload),
          keepalive: true,
        });

        if (!response.ok) throw new Error(`Partial lead endpoint returned ${response.status}`);
        lastSentSnapshotRef.current = pending.snapshot;
      } catch (error) {
        if (import.meta.env.DEV) console.warn("Partial lead capture failed", error);
      }
    };

    const handleMessage = (event) => {
      if (event.origin !== GHL_ORIGIN) return;

      const iframeWindow = iframeRef?.current?.contentWindow;
      if (iframeWindow && event.source && event.source !== iframeWindow) return;
      if (!event.data || typeof event.data !== "object" || event.data.type !== MESSAGE_TYPE) return;

      const payload = normalizePayload(event.data);
      if (!payload) return;

      const snapshotPayload = { ...payload };
      delete snapshotPayload.capturedAt;
      const snapshot = JSON.stringify(snapshotPayload);
      if (snapshot === lastSentSnapshotRef.current || snapshot === pendingRef.current?.snapshot) return;

      pendingRef.current = { payload, snapshot };
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(sendPending, DEBOUNCE_MS);
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timerRef.current);
      pendingRef.current = null;
    };
  }, [iframeRef]);
}
