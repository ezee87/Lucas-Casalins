import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import PremiumCTA from "../ui/PremiumCTA";
import SectionLabel from "../ui/SectionLabel";

/**
 * AboutLucasB — Variant B layout.
 * Text dominates the LEFT (wider column), image is on the RIGHT (smaller).
 * Compact & tight — no excess whitespace, CTA full-width below both columns.
 * Image is fixed (no parallax). Layout differs clearly from A.
 */
export default function AboutLucasB({ data, cta }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        "[data-b-img]",
        { opacity: 0.01, x: 28 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: ref.current, start: "top 76%", once: true },
        },
      );

      gsap.fromTo(
        "[data-b-block]",
        { opacity: 0.01, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.08,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        },
      );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section id="about" ref={ref} className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1140px] px-5 md:px-8">
        <SectionLabel>{data.eyebrow}</SectionLabel>
        <h2 className="mt-3 max-w-3xl font-display text-3xl uppercase leading-[0.96] tracking-[0.01em] text-white md:text-5xl">
          {data.title}
        </h2>

        {/* Two-column: text LEFT (wider), image RIGHT (more prominent) */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_440px] lg:items-start lg:gap-12">
          {/* ── Left: editorial text only (no finalStatement here) ── */}
          <div>
            <div className="space-y-0">
              {data.bullets.map((bullet, idx) => (
                <div key={idx} data-b-block="true">
                  {idx > 0 ? (
                    <div
                      aria-hidden="true"
                      className="my-5 h-px w-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255,30,30,0.35), transparent 70%)",
                      }}
                    />
                  ) : null}
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--red)] shadow-[0_0_8px_rgba(255,30,30,0.8)]"
                    />
                    <p className="text-[0.94rem] leading-[1.70] text-[var(--muted)] md:text-[1rem]">
                      {bullet}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: larger, more prominent image ── */}
          <div
            data-b-img="true"
            className="hidden md:block"
          >
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                border: "1.5px solid rgba(255,30,30,0.42)",
                boxShadow:
                  "0 0 48px rgba(255,30,30,0.20), 0 24px 64px rgba(0,0,0,0.65)",
              }}
            >
              <img
                src={data.image}
                alt="Lucas Casalins"
                className="h-full w-full object-cover object-top"
                width="1170"
                height="2532"
                style={{ aspectRatio: "3 / 4" }}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div
                aria-hidden="true"
                className="absolute bottom-0 inset-x-0 h-20"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(255,30,30,0.22), transparent)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Full-width closing: finalStatement + CTA ── */}
        <div className="mt-10">
          {/* Horizontal divider */}
          <div
            aria-hidden="true"
            className="mb-8 h-px w-full"
            style={{ background: "linear-gradient(90deg, rgba(255,30,30,0.32), transparent 60%)" }}
          />
          <div
            data-b-block="true"
            className="rounded-xl border-l-[3px] border-[var(--red)] bg-[rgba(255,30,30,0.06)] px-6 py-5 md:px-8 md:py-6"
          >
            <p className="max-w-4xl text-[0.98rem] font-semibold leading-relaxed text-[var(--red-bright)] md:text-[1.06rem]">
              {data.finalStatement}
            </p>
          </div>
          <div data-b-block="true" className="mt-7">
            <PremiumCTA
              href={cta.href}
              label={cta.primaryLabel}
              ariaLabel={cta.ariaLabel}
              size="lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
