import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import SectionLabel from "../ui/SectionLabel";
import PremiumCTA from "../ui/PremiumCTA";

function usePerView() {
  const [perView, setPerView] = useState(1);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return perView;
}

export default function TestimonialCarousel({ data, ui = {}, cta }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const perView = usePerView();
  const total = data.items.length;
  const maxIndex = Math.max(0, total - perView);
  const [index, setIndex] = useState(0);

  // Clamp during render (perView can shrink on resize) — no effect needed.
  const safeIndex = Math.min(index, maxIndex);

  const go = (next) => setIndex(next < 0 ? maxIndex : next > maxIndex ? 0 : next);

  // Autoplay (paused on hover / reduced motion).
  const pausedRef = useRef(false);
  const touchStartXRef = useRef(null);
  const touchDeltaXRef = useRef(0);
  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 4500);
    return () => clearInterval(id);
  }, [maxIndex, reducedMotion]);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        "[data-testi-head] > *",
        { opacity: 0.01, y: 24, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 0.75,
          ease: "power4.out",
          immediateRender: false,
          clearProps: "opacity,transform,filter",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        },
      );

      // Cards punch in with a staggered rise + slight 3D tilt and scale.
      gsap.fromTo(
        "[data-testi-card]",
        { opacity: 0.01, y: 48, scale: 0.92, rotateX: 10, transformPerspective: 800 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "back.out(1.5)",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: "[data-testi-track]", start: "top 84%", once: true },
        },
      );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section id="testimonials" ref={ref} className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div data-testi-head className="max-w-3xl">
          <SectionLabel>{data.eyebrow || data.label}</SectionLabel>
          <h2 className="font-display text-3xl uppercase leading-[0.98] tracking-[0.01em] text-white md:text-5xl">
            {data.title}
          </h2>
          {data.subtitle ? (
            <p className="mt-4 max-w-2xl text-balance text-base leading-relaxed text-[var(--muted)] md:text-lg">
              {data.subtitle}
            </p>
          ) : null}
        </div>

        {/* Carousel — overflow-x:clip lets adjacent slides stay hidden while
            overflow-y:visible lets hovered cards lift without being cut */}
        <div
          className="testimonials-slider mt-10 cursor-grab overflow-x-clip overflow-y-visible pb-1 active:cursor-grabbing"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onTouchStart={(event) => {
            pausedRef.current = true;
            touchStartXRef.current = event.touches[0]?.clientX ?? null;
            touchDeltaXRef.current = 0;
          }}
          onTouchMove={(event) => {
            const startX = touchStartXRef.current;
            if (startX == null) return;
            const currentX = event.touches[0]?.clientX ?? startX;
            touchDeltaXRef.current = currentX - startX;
          }}
          onTouchEnd={() => {
            const delta = touchDeltaXRef.current;
            if (Math.abs(delta) > 42) {
              go(delta > 0 ? safeIndex - 1 : safeIndex + 1);
            }
            touchStartXRef.current = null;
            touchDeltaXRef.current = 0;
            pausedRef.current = false;
          }}
        >
          <div
            data-testi-track
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${(total / perView) * 100}%`,
              transform: `translateX(-${(100 / total) * safeIndex}%)`,
            }}
          >
            {data.items.map((item, i) => (
              <div
                key={item.name + i}
                className="px-2 md:px-2.5"
                style={{ width: `${100 / total}%` }}
              >
                {/* card-border-trace applies animated red border directly on the article */}
                <article data-testi-card className="card-border-trace group relative flex h-full min-h-[268px] flex-col rounded-2xl border border-[var(--line)] bg-[linear-gradient(150deg,rgba(255,255,255,0.04),rgba(10,10,10,0.93))] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,30,30,0.28)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.55),0_0_20px_rgba(255,30,30,0.10)] md:min-h-[284px] md:p-7">
                  <Quote
                    className="h-6 w-6 shrink-0 text-[var(--red)]"
                    aria-hidden="true"
                  />
                  <p className="mt-4 flex-grow text-[0.92rem] leading-[1.6] text-[var(--text)]">
                    {item.quote}
                  </p>
                  <div className="mt-6 border-t border-[var(--line)] pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-heading text-sm font-bold uppercase tracking-[0.1em] text-white">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-0.5" aria-label="Calificacion 5 de 5">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className="h-3.5 w-3.5 fill-[#f6c453] text-[#f6c453]"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-[0.64rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {item.role}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(safeIndex - 1)}
            aria-label={ui.previous || "Anterior"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text)] transition-all hover:border-[var(--red)] hover:text-[var(--red-bright)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Ir al testimonio ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === safeIndex ? "w-6 bg-[var(--red)]" : "w-1.5 bg-[var(--line)] hover:bg-[var(--muted)]"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(safeIndex + 1)}
            aria-label={ui.next || "Siguiente"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text)] transition-all hover:border-[var(--red)] hover:text-[var(--red-bright)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {cta ? (
          <div className="mt-12 px-5">
            <PremiumCTA href={cta.href} label={cta.primaryLabel} ariaLabel={cta.ariaLabel} size="lg" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
