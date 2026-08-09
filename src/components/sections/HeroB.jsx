import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import PremiumCTA from "../ui/PremiumCTA";
import HeroInteractiveBackground from "./hero/HeroInteractiveBackground";

function formatMetric(value, n) {
  const rounded = Math.round(n);
  if (value === "+2.500") {
    return `+${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }
  if (value === "+15") return `+${rounded}`;
  if (value === "100%") return `${rounded}%`;
  return `${rounded}`;
}

// Splits at the word boundary nearest the midpoint — visually balanced lines.
function splitTitle(title) {
  const words = title.split(/\s+/);
  if (words.length < 2) return [title, ""];
  const total = title.length;
  let running = 0;
  let bestIdx = 1;
  let bestDiff = Infinity;
  for (let i = 0; i < words.length - 1; i++) {
    running += words[i].length + 1;
    const diff = Math.abs(running - total / 2);
    if (diff < bestDiff) { bestDiff = diff; bestIdx = i + 1; }
  }
  return [words.slice(0, bestIdx).join(" "), words.slice(bestIdx).join(" ")];
}

const HERO_SUBTITLE_HIGHLIGHT_A = "ayudó a más de 2.500 personas";
const HERO_SUBTITLE_HIGHLIGHT_B = "a verse mejor, sentirse más seguros y rendir con más energía";

function renderHighlightedSubtitle(text) {
  const [beforeFirst, restAfterFirst] = text.split(HERO_SUBTITLE_HIGHLIGHT_A);
  if (restAfterFirst === undefined) return text;

  const [betweenHighlights, afterSecond] = restAfterFirst.split(HERO_SUBTITLE_HIGHLIGHT_B);
  if (afterSecond === undefined) return text;

  return (
    <>
      {beforeFirst}
      <strong className="font-bold text-white">{HERO_SUBTITLE_HIGHLIGHT_A}</strong>
      {betweenHighlights}
      <strong className="font-bold text-white">{HERO_SUBTITLE_HIGHLIGHT_B}</strong>
      {afterSecond}
    </>
  );
}

export default function HeroB({ data, cta, header }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const disableHeroMotion = true;
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!videoReady) return;
    ScrollTrigger.refresh();
  }, [videoReady]);

  useGSAP(
    (context, contextSafe) => {
      const heroEl = ref.current;
      if (!heroEl) return;

      if (disableHeroMotion) return;

      const clampX = gsap.utils.clamp(8, 92);
      const clampY = gsap.utils.clamp(10, 86);

      if (!reducedMotion) {
        const xTo = gsap.quickTo(heroEl, "--mouse-x", {
          duration: 0.45,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(heroEl, "--mouse-y", {
          duration: 0.45,
          ease: "power3.out",
        });

        const onPointerMove = contextSafe((event) => {
          const bounds = heroEl.getBoundingClientRect();
          xTo(clampX(((event.clientX - bounds.left) / bounds.width) * 100));
          yTo(clampY(((event.clientY - bounds.top) / bounds.height) * 100));
        });

        const onPointerLeave = contextSafe(() => {
          xTo(50);
          yTo(24);
        });

        heroEl.addEventListener("pointermove", onPointerMove);
        heroEl.addEventListener("pointerleave", onPointerLeave);
        context.add(() => {
          heroEl.removeEventListener("pointermove", onPointerMove);
          heroEl.removeEventListener("pointerleave", onPointerLeave);
        });
      }

      if (reducedMotion) return;

      // Left column items slide in from left, video slides from right
      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.08,
      });

      introTl
        .from("[data-hb='bg']", { opacity: 0, duration: 0.8 })
        .from(
          "[data-hb='logo']",
          { opacity: 0, y: -18, duration: 0.58 },
          "-=0.56",
        )
        .from(
          "[data-hb='ey']",
          { opacity: 0, x: -28, duration: 0.46 },
          "<0.05",
        )
        .from(
          "[data-hb='line-1'] .line-inner",
          {
            yPercent: 105,
            rotationX: 7,
            transformPerspective: 640,
            transformOrigin: "50% 100%",
            duration: 0.86,
            ease: "power4.out",
          },
          "-=0.1",
        )
        .from(
          "[data-hb='line-2'] .line-inner",
          {
            yPercent: 105,
            rotationX: 7,
            transformPerspective: 640,
            transformOrigin: "50% 100%",
            duration: 0.86,
            ease: "power4.out",
          },
          "<0.14",
        )
        .from(
          "[data-hb='sub']",
          {
            opacity: 0,
            y: 18,
            filter: "blur(8px)",
            duration: 0.62,
            clearProps: "filter",
          },
          "-=0.4",
        )
        .from(
          "[data-hb='sup']",
          { opacity: 0, y: 12, duration: 0.44 },
          "<0.08",
        )
        .from(
          "[data-hb='cta']",
          {
            opacity: 0,
            y: 12,
            scale: 0.93,
            duration: 0.58,
            ease: "back.out(1.35)",
          },
          "-=0.18",
        )
        // video card enters from the right on desktop
        .from(
          "[data-hb='video-card']",
          {
            opacity: 0,
            x: 48,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.55",
        )
        .from(
          "[data-hb='metrics-wrap']",
          { opacity: 0, y: 16, duration: 0.58 },
          "-=0.44",
        )
        .from(
          "[data-metric-item-b]",
          { opacity: 0, y: 12, duration: 0.42, stagger: { each: 0.07 } },
          "<0.08",
        );

      gsap.to("[data-hb='video-card']", {
        yPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to("[data-bg-parallax]", {
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });

      data.proofStrip.forEach((metric, index) => {
        const el = heroEl.querySelector(`[data-metric-b-idx="${index}"]`);
        if (!el) return;

        if (!metric.countTo) {
          gsap.from(el, {
            opacity: 0,
            scale: 0.9,
            duration: 0.45,
            delay: index * 0.06,
            scrollTrigger: {
              trigger: "[data-hb='metrics-wrap']",
              start: "top 84%",
              once: true,
            },
          });
          return;
        }

        const counter = { n: 0 };
        gsap.to(counter, {
          n: metric.countTo,
          duration: 1.95,
          ease: "power2.out",
          delay: index * 0.07,
          onUpdate: () => {
            el.textContent = formatMetric(metric.value, counter.n);
          },
          onComplete: () => {
            gsap.fromTo(
              el,
              { scale: 1 },
              {
                scale: 1.055,
                duration: 0.16,
                repeat: 1,
                yoyo: true,
                ease: "power1.out",
                transformOrigin: "50% 50%",
              },
            );
          },
          scrollTrigger: {
            trigger: "[data-hb='metrics-wrap']",
            start: "top 84%",
            once: true,
          },
        });
      });
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  const [line1Raw, line2Raw] = splitTitle(data.title);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative overflow-hidden"
      style={{ "--mouse-x": 50, "--mouse-y": 24 }}
    >
      <HeroInteractiveBackground reducedMotion={reducedMotion} />

      {/* Logo only — no nav */}
      <header
        data-hb="logo"
        className="relative z-20 mx-auto flex w-full max-w-[1280px] items-center justify-center px-5 py-5 md:px-8"
      >
        <img
          src={header?.logo || data.logo}
          alt={header?.logoAlt || "ARETÉ"}
          className="h-10 w-auto object-contain md:h-12"
          width="500"
          height="500"
          decoding="async"
        />
      </header>

      {/* Two-column layout: text left / vertical video right */}
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-5 pb-6 pt-2 md:px-8 md:pb-8 md:pt-4 lg:flex-row lg:items-center lg:gap-14">

        {/* ── Left column: text content ── */}
        <div className="flex w-full flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          {/* Badge */}
          <div data-hb="ey">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--red)] bg-[rgba(255,30,30,0.08)] px-5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--red-bright)] md:text-[0.64rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--red)] shadow-[0_0_10px_rgba(255,30,30,0.9)]" />
              {data.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-5 w-full font-display uppercase leading-[0.9] tracking-[-0.005em] text-[clamp(2.2rem,3.6vw,3.8rem)]">
            <span
              data-hb="line-1"
              className="block overflow-hidden pb-[0.05em] transform-gpu will-change-transform"
            >
              <span className="line-inner block text-white">
                {line1Raw.toUpperCase()}
              </span>
            </span>
            <span
              data-hb="line-2"
              className="block overflow-hidden pb-[0.05em] transform-gpu will-change-transform"
            >
              <span className="line-inner block text-[var(--red)] text-glow-red">
                {line2Raw.toUpperCase()}
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            data-hb="sub"
            className="mt-6 max-w-[520px] text-balance text-[0.98rem] font-normal leading-[1.65] text-[rgba(255,244,234,0.82)] md:max-w-[760px] md:text-[1.06rem]"
          >
            {renderHighlightedSubtitle(data.subtitle)}
          </p>

          {/* Support text — narrower max-w prevents orphaned last word */}
          <p
            data-hb="sup"
            className="mt-4 max-w-[320px] text-balance text-[0.88rem] font-semibold leading-[1.5] text-[var(--red-bright)] md:max-w-[400px] md:text-[0.95rem]"
          >
            {data.supportText}
          </p>

          {/* CTA — in left column */}
          <div data-hb="cta" className="mt-8 hidden lg:block">
            <PremiumCTA
              href={cta.href}
              label={cta.primaryLabel}
              ariaLabel={cta.ariaLabel}
              size="lg"
              animateIn={false}
            />
          </div>
        </div>

        {/* ── Right column: vertical video card ── */}
        <div
          data-hb="video-card"
          className="w-full max-w-none flex-shrink-0 md:max-w-[440px] lg:w-[505px] lg:max-w-none xl:w-[570px]"
        >
          <div
            className="relative overflow-hidden rounded-[24px] bg-[#050202]"
            style={{
              aspectRatio: "16/9",
              border: "1px solid rgba(255,30,30,0.55)",
              boxShadow:
                "0 0 0 1px rgba(255,30,30,0.12), 0 0 40px rgba(255,30,30,0.28), 0 0 80px rgba(255,30,30,0.12), 0 24px 64px rgba(0,0,0,0.84)",
            }}
          >
            {videoReady ? (
              /* 16:9 iframe fills the 16:9 container exactly — no zoom, no crop */
              <iframe
                src={data.video.embedUrl}
                title={data.title}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  border: "none",
                }}
                loading="eager"
                allow="autoplay; fullscreen"
                allowFullScreen
                onLoad={() => ScrollTrigger.refresh()}
              />
            ) : (
              <>
                {/* Poster image — object-contain shows the full image without cropping */}
                <img
                  src={data.video.poster}
                  alt={data.video.posterAlt || data.title}
                  className="absolute inset-0 h-full w-full object-contain"
                  width="1672"
                  height="941"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onLoad={() => ScrollTrigger.refresh()}
                />

                {/* Red/black vignette with subtle grain */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.18)_50%,rgba(0,0,0,0.62)_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,30,30,0.18),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.04)_28%,rgba(0,0,0,0.52)_100%)]" />
                <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-soft-light" />

                {/* Play button — outlined red, no fill */}
                <button
                  type="button"
                  onClick={() => setVideoReady(true)}
                  aria-label="Reproducir video"
                  className="group absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                >
                  <span className="pointer-events-none absolute inset-[-18px] scale-95 rounded-full border border-[var(--accent)] opacity-28 transition-all duration-500 group-hover:scale-110 group-hover:opacity-50" />
                  <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-[var(--red-bright)] bg-transparent transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-[0_0_36px_rgba(255,30,30,0.56)] md:h-[80px] md:w-[80px]">
                    <svg
                      width="20"
                      height="24"
                      viewBox="0 0 18 22"
                      fill="none"
                      className="translate-x-[2px]"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 1L17 11L1 21V1Z"
                        stroke="var(--red)"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* Subtle corner glow accents */}
                <div
                  className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,30,30,0.35), transparent 70%)",
                    filter: "blur(16px)",
                  }}
                />
                <div
                  className="pointer-events-none absolute -left-4 -top-4 h-20 w-20 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,30,30,0.2), transparent 70%)",
                    filter: "blur(14px)",
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Mobile CTA below video to match variant A order */}
        <div data-hb="cta" className="mb-9 mt-6 flex justify-center lg:hidden">
          <PremiumCTA
            href={cta.href}
            label={cta.primaryLabel}
            ariaLabel={cta.ariaLabel}
            size="lg"
            animateIn={false}
          />
        </div>
      </div>

      {/* Top luminous frame line — full screen width */}
      <div data-hb="stat-line" className="stat-edge-line mt-14 md:mt-16" aria-hidden="true" />

      {/* Metrics strip — full width below both columns */}
      <div
        data-hb="metrics-wrap"
        className="relative mx-auto mt-7 w-full max-w-[1280px] px-5 md:mt-8 md:px-8"
      >
        <div className="card-border-trace grid grid-cols-2 overflow-hidden rounded-2xl border border-[var(--line)] bg-[rgba(255,30,30,0.03)] backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-6">
          {data.proofStrip.map((item, idx) => (
            <article
              key={item.label}
              data-metric-item-b="true"
              className="group flex min-h-[80px] flex-col items-center justify-center border-b border-r border-[var(--line)] px-3 py-[14px] text-center transition-colors duration-300 hover:bg-[rgba(255,30,30,0.08)] last:border-r-0 lg:min-h-[92px] lg:border-b-0"
            >
              <p
                data-metric-b-idx={idx}
                className="font-display text-[1.5rem] leading-none text-[var(--red)] transition duration-300 group-hover:brightness-125 md:text-[1.7rem]"
              >
                {item.value}
              </p>
              <p className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[rgba(232,224,213,0.74)] md:text-[0.6rem]">
                {item.label}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom luminous frame line — full screen width */}
      <div data-hb="stat-line" className="stat-edge-line mt-7 md:mt-8" aria-hidden="true" />

    </section>
  );
}
