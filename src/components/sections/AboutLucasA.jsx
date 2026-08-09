import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import PremiumCTA from "../ui/PremiumCTA";
import SectionLabel from "../ui/SectionLabel";

/**
 * AboutLucasA — Variant A layout.
 * Two columns: image LEFT (fixed, no parallax), text + CTA RIGHT.
 * Tighter composition, red-bordered image, CTA anchored below the text column.
 */
export default function AboutLucasA({ data, cta }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        "[data-a-img]",
        { opacity: 0.01, x: -28 },
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
        "[data-a-block]",
        { opacity: 0.01, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: "[data-a-text]", start: "top 82%", once: true },
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

        {/* ── 2-column block: image LEFT + first two bullets RIGHT ── */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[400px_1fr] lg:items-start lg:gap-14">
          {/* ── Left: image ── */}
          <div className="hidden md:block">
            <div
              data-a-img="true"
              className="relative overflow-hidden rounded-2xl"
              style={{
                border: "1.5px solid rgba(255,30,30,0.45)",
                boxShadow:
                  "0 0 0 1px rgba(255,30,30,0.08), 0 0 40px rgba(255,30,30,0.18), 0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              <img
                src={data.image}
                alt="Lucas Casalins"
                className="h-full w-full object-cover object-top"
                width="1170"
                height="2532"
                style={{ aspectRatio: "4 / 5" }}
                loading="lazy"
                decoding="async"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {/* Red corner accent */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,30,30,0.85), rgba(255,80,0,0.4) 60%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* ── Right: first THREE bullets ── */}
          <div data-a-text>
            {data.bullets.slice(0, 3).map((bullet, idx) => (
              <div key={idx} data-a-block="true">
                {idx > 0 ? (
                  <span className="my-6 block h-px w-12 bg-[linear-gradient(90deg,var(--red),transparent)]" />
                ) : null}
                <p className="text-[0.97rem] leading-[1.76] text-[var(--muted)] md:text-[1.04rem]">
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Full-width: last two bullets + finalStatement + CTA ── */}
        <div className="mt-10">
          {/* Horizontal divider */}
          <div
            aria-hidden="true"
            className="mb-8 h-px w-full"
            style={{ background: "linear-gradient(90deg, rgba(255,30,30,0.35), transparent 65%)" }}
          />

          {data.bullets.slice(3).map((bullet, idx) => (
            <div key={idx} data-a-block="true">
              {idx > 0 ? (
                <span className="my-6 block h-px w-12 bg-[linear-gradient(90deg,var(--red),transparent)]" />
              ) : null}
              <p className="max-w-4xl text-[0.97rem] leading-[1.76] text-[var(--muted)] md:text-[1.04rem]">
                {bullet}
              </p>
            </div>
          ))}

          {/* Red quote block — more editorial, more air */}
          <div
            data-a-block="true"
            className="mt-10 rounded-xl border-l-[3px] border-[var(--red)] bg-[rgba(255,30,30,0.06)] px-6 py-5 md:px-8 md:py-6"
          >
            <p className="max-w-3xl text-[1rem] font-medium leading-relaxed text-[var(--red-bright)] md:text-[1.08rem]">
              {data.finalStatement}
            </p>
          </div>

          {/* CTA — left-aligned below the quote block */}
          <div data-a-block="true" className="mt-7">
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
