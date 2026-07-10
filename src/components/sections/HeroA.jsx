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

// Splits title at the word boundary nearest the midpoint — visually balanced,
// no hardcoded breaks. Line 1 = white, line 2 = red.
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

export default function HeroA({ data, cta, header }) {
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
          const xPercent =
            ((event.clientX - bounds.left) / bounds.width) * 100;
          const yPercent =
            ((event.clientY - bounds.top) / bounds.height) * 100;
          xTo(clampX(xPercent));
          yTo(clampY(yPercent));
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

      // DOM order: badge → headline → sub → sup → video → cta → metrics → arrow
      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.08,
      });

      introTl
        .from("[data-h='bg']", { opacity: 0, duration: 0.8 })
        .from(
          "[data-h='logo']",
          { opacity: 0, y: -18, duration: 0.58 },
          "-=0.56",
        )
        .from(
          "[data-h='ey']",
          {
            opacity: 0,
            scaleX: 0.92,
            transformOrigin: "50% 50%",
            duration: 0.46,
          },
          "<0.05",
        )
        .from(
          "[data-h='line-1'] .line-inner",
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
          "[data-h='line-2'] .line-inner",
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
          "[data-h='sub']",
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
          "[data-h='sup']",
          { opacity: 0, y: 12, duration: 0.44 },
          "<0.08",
        )
        // video before CTA (CTA is below video in variant A)
        .from(
          "[data-h='video-shell']",
          {
            opacity: 0,
            y: 24,
            clipPath: "inset(8% 0% 0% 0% round 24px)",
            duration: 0.86,
          },
          "-=0.1",
        )
        .from(
          "[data-h='cta']",
          {
            opacity: 0,
            y: 12,
            scale: 0.93,
            duration: 0.58,
            ease: "back.out(1.35)",
          },
          "-=0.2",
        )
        .from(
          "[data-h='metrics-wrap']",
          { opacity: 0, y: 16, duration: 0.58 },
          "-=0.44",
        )
        .from(
          "[data-metric-item]",
          { opacity: 0, y: 12, duration: 0.42, stagger: { each: 0.07 } },
          "<0.08",
        )
;

      gsap.to("[data-h='video-shell']", {
        yPercent: -2.8,
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
        const el = heroEl.querySelector(`[data-metric-idx="${index}"]`);
        if (!el) return;

        if (!metric.countTo) {
          gsap.from(el, {
            opacity: 0,
            scale: 0.9,
            duration: 0.45,
            delay: index * 0.06,
            scrollTrigger: {
              trigger: "[data-h='metrics-wrap']",
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
            trigger: "[data-h='metrics-wrap']",
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

      {/* Logo only — no nav, no header CTA */}
      <header
        data-h="logo"
        className="relative z-20 mx-auto flex w-full max-w-[1280px] items-center justify-center px-5 py-5 md:px-8"
      >
        <img
          src={header?.logo || data.logo}
          alt={header?.logoAlt || "ARETÉ"}
          className="h-10 w-auto object-contain md:h-12"
          fetchPriority="high"
          decoding="async"
        />
      </header>

      {/* Hero content — centered single column */}
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 pb-6 pt-2 text-center md:px-8 md:pb-8 md:pt-4">
        {/* Badge */}
        <div data-h="ey" className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--red)] bg-[rgba(255,30,30,0.08)] px-5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--red-bright)] md:text-[0.64rem]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--red)] shadow-[0_0_10px_rgba(255,30,30,0.9)]" />
            {data.eyebrow}
          </span>
        </div>

        {/*
          Headline — 2 lines max on desktop.
          font-size capped at 3.8rem + condensed font ensures line-1 fits
          within the wide container without wrapping.
        */}
        <h1 className="mx-auto mt-5 w-full max-w-[1180px] font-display uppercase leading-[0.9] tracking-[-0.005em] text-[clamp(2.2rem,4.8vw,3.8rem)]">
          <span
            data-h="line-1"
            className="block overflow-hidden pb-[0.05em] transform-gpu will-change-transform"
          >
            <span className="line-inner block text-white">
              {line1Raw.toUpperCase()}
            </span>
          </span>
          <span
            data-h="line-2"
            className="block overflow-hidden pb-[0.05em] transform-gpu will-change-transform"
          >
            <span className="line-inner block text-[var(--red)] text-glow-red">
              {line2Raw.toUpperCase()}
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <p
          data-h="sub"
          className="mx-auto mt-6 max-w-[640px] text-balance text-[0.98rem] font-normal leading-[1.65] text-[rgba(255,244,234,0.82)] md:max-w-[960px] md:text-[1.06rem]"
        >
          {renderHighlightedSubtitle(data.subtitle)}
        </p>

        {/* Support text */}
        <p
          data-h="sup"
          className="mx-auto mt-4 max-w-[320px] text-balance text-[0.88rem] font-semibold leading-[1.5] text-[var(--red-bright)] md:max-w-[580px] md:text-[0.95rem]"
        >
          {data.supportText}
        </p>

        {/* Video — horizontal 16:9, centered, below support text */}
        <div
          data-h="video-shell"
          className="mx-auto mt-8 w-full lg:mt-10 lg:max-w-[820px] xl:max-w-[920px]"
        >
          <div
            className="relative overflow-hidden rounded-3xl bg-[#050202]"
            style={{
              border: "1px solid rgba(255,30,30,0.55)",
              boxShadow:
                "0 0 0 1px rgba(255,30,30,0.12), 0 0 40px rgba(255,30,30,0.28), 0 0 80px rgba(255,30,30,0.12), 0 24px 64px rgba(0,0,0,0.84)",
            }}
          >
            <div className="relative aspect-video">
              {videoReady ? (
                <iframe
                  src={data.video.embedUrl}
                  title={data.title}
                  className="absolute inset-0 h-full w-full"
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
                    className="h-full w-full object-contain"
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
        </div>

        {/* CTA — below video */}
        <div data-h="cta" className="mb-9 mt-6 flex justify-center md:mb-0 md:mt-8">
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
      <div data-h="stat-line" className="stat-edge-line mt-14 md:mt-16" aria-hidden="true" />

      {/* Metrics strip */}
      <div
        data-h="metrics-wrap"
        className="relative mx-auto mt-7 w-full max-w-[1280px] px-5 md:mt-8 md:px-8"
      >
        <div className="card-border-trace grid grid-cols-2 overflow-hidden rounded-2xl border border-[var(--line)] bg-[rgba(255,30,30,0.03)] backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-6">
          {data.proofStrip.map((item, idx) => (
            <article
              key={item.label}
              data-metric-item="true"
              className="group flex min-h-[80px] flex-col items-center justify-center border-b border-r border-[var(--line)] px-3 py-[14px] text-center transition-colors duration-300 hover:bg-[rgba(255,30,30,0.08)] last:border-r-0 lg:min-h-[92px] lg:border-b-0"
            >
              <p
                data-metric-idx={idx}
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
      <div data-h="stat-line" className="stat-edge-line mt-7 md:mt-8" aria-hidden="true" />

    </section>
  );
}
