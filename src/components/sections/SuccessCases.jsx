import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import SectionLabel from "../ui/SectionLabel";
import PremiumCTA from "../ui/PremiumCTA";

/**
 * Unified visual testimonials: title + subtitle, a single auto-scrolling
 * carousel (pauses on hover, infinite loop) and a centered CTA below.
 * Name / role / duration live in a caption band BELOW each image so they
 * never cover the legend baked into the photos.
 */
export default function SuccessCases({ data, cta }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const reducedMotion = useReducedMotion();
  // Stable refs for pause/resume so card event handlers don't recreate on each render
  const pauseFnRef = useRef(null);
  const resumeFnRef = useRef(null);
  const loopTweenRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartProgressRef = useRef(0);

  // Duplicate the set for a seamless -50% loop (single set when motion is off).
  const loopItems = reducedMotion ? data.items : [...data.items, ...data.items];

  useGSAP(
    (ctx, contextSafe) => {
      const section = ref.current;
      if (!section) return;

      gsap.fromTo(
        "[data-cases-head] > *",
        { opacity: 0.01, y: 22 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        },
      );

      if (reducedMotion) return;

      const track = trackRef.current;
      if (!track) return;

      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 85,
        ease: "none",
        repeat: -1,
      });
      loopTweenRef.current = tween;

      // Only pause when hovering a specific card — NOT the whole section
      pauseFnRef.current = contextSafe(() => {
        gsap.to(tween, { timeScale: 0, duration: 0.5, overwrite: true });
      });
      resumeFnRef.current = contextSafe(() => {
        gsap.to(tween, { timeScale: 1, duration: 0.5, overwrite: true });
      });
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section id="cases" ref={ref} className="relative overflow-hidden py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div data-cases-head className="max-w-3xl">
          <SectionLabel>{data.eyebrow}</SectionLabel>
          <h2 className="font-display text-4xl uppercase leading-[0.95] tracking-[0.01em] text-white md:text-6xl">
            {data.title}
          </h2>
          {data.subtitle ? (
            <p className="mt-4 max-w-2xl text-balance text-base leading-relaxed text-[var(--muted)] md:text-lg lg:max-w-none lg:whitespace-nowrap">
              {data.subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {/* Auto carousel */}
      <div className="relative mt-10 md:mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[var(--bg)] to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[var(--bg)] to-transparent md:w-28" />

        <div
          className={reducedMotion ? "scrollbar-hide overflow-x-auto px-5" : "cursor-grab overflow-hidden py-3 active:cursor-grabbing"}
          onTouchStart={(event) => {
            const tween = loopTweenRef.current;
            if (!tween) return;
            pauseFnRef.current?.();
            touchStartXRef.current = event.touches[0]?.clientX ?? null;
            touchStartProgressRef.current = tween.progress();
          }}
          onTouchMove={(event) => {
            const tween = loopTweenRef.current;
            const startX = touchStartXRef.current;
            const track = trackRef.current;
            if (!tween || startX == null || !track) return;

            const currentX = event.touches[0]?.clientX ?? startX;
            const deltaX = currentX - startX;
            const halfLoopWidth = Math.max(track.scrollWidth / 2, 1);
            const deltaProgress = deltaX / halfLoopWidth;
            const wrapped = ((touchStartProgressRef.current - deltaProgress) % 1 + 1) % 1;
            tween.progress(wrapped);
          }}
          onTouchEnd={() => {
            touchStartXRef.current = null;
            resumeFnRef.current?.();
          }}
        >
          <div
            ref={trackRef}
            className="flex w-max gap-3 will-change-transform md:gap-4"
          >
            {loopItems.map((item, idx) => (
              <article
                key={idx}
                onMouseEnter={() => pauseFnRef.current?.()}
                onMouseLeave={() => resumeFnRef.current?.()}
                className="card-border-trace group w-[164px] flex-shrink-0 cursor-default overflow-hidden rounded-xl bg-[var(--bg-soft)] transition-transform duration-300 hover:scale-[1.035] sm:w-[194px]"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {/* Caption BELOW the image — name and role only, no duration */}
                <div className="border-t border-[var(--line)] px-3 py-3">
                  <p className="font-heading text-[0.82rem] font-bold uppercase tracking-[0.08em] text-white">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                    {item.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 px-5">
        <PremiumCTA href={cta.href} label={cta.primaryLabel} ariaLabel={cta.ariaLabel} size="lg" />
      </div>
    </section>
  );
}
