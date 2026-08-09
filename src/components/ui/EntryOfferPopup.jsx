import { useCallback, useEffect, useRef, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const STORAGE_KEY = "arete_entry_popup_dismissed";
const OPEN_DELAY = 850;

export default function EntryOfferPopup({ data }) {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Auto-open shortly after load, unless dismissed this session.
  useEffect(() => {
    let dismissed;
    try {
      dismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed) return undefined;

    const id = window.setTimeout(() => setOpen(true), OPEN_DELAY);
    return () => window.clearTimeout(id);
  }, []);

  const close = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore storage errors */
    }

    const modal = modalRef.current;
    const overlay = overlayRef.current;

    if (reducedMotion || !modal || !overlay) {
      setOpen(false);
      return;
    }

    gsap.to(modal, {
      autoAlpha: 0,
      scale: 0.94,
      y: 10,
      duration: 0.28,
      ease: "power2.in",
    });
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.32,
      ease: "power2.in",
      onComplete: () => setOpen(false),
    });
  }, [reducedMotion]);

  // Entrance animation + scroll lock + focus + Escape handling.
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    closeBtnRef.current?.focus({ preventScroll: true });

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([overlayRef.current, modalRef.current], { autoAlpha: 1 });
        return;
      }
      gsap.set(overlayRef.current, { autoAlpha: 0 });
      gsap.set(modalRef.current, { autoAlpha: 0, scale: 0.9, y: 18 });

      const tl = gsap.timeline();
      tl.to(overlayRef.current, { autoAlpha: 1, duration: 0.35, ease: "power2.out" })
        .to(
          modalRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.62,
            ease: "back.out(1.5)",
          },
          "-=0.18",
        )
        .fromTo(
          "[data-popup-glow]",
          { opacity: 0.25 },
          { opacity: 1, duration: 0.8, ease: "power2.out" },
          "<",
        )
        .from(
          "[data-popup-reveal]",
          {
            opacity: 0,
            y: 16,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out",
            clearProps: "opacity,transform",
          },
          "-=0.3",
        );
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      ctx.revert();
    };
  }, [open, reducedMotion, close]);

  if (!open) return null;

  const onCtaClick = () => {
    close();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={data.headline}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {/* Dimmed, blurred backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        ref={modalRef}
        className="relative w-full max-w-[920px] overflow-hidden rounded-[1.6rem] border border-[var(--red)] bg-[#070303] shadow-[0_0_0_1px_rgba(255,30,30,0.35),0_30px_90px_rgba(0,0,0,0.7)]"
      >
        {/* Red glow aura */}
        <div
          data-popup-glow
          className="pointer-events-none absolute -inset-px rounded-[1.6rem]"
          style={{
            boxShadow:
              "inset 0 0 60px rgba(255,30,30,0.18), 0 0 70px rgba(255,30,30,0.4)",
          }}
        />
        <div className="bg-dots-red pointer-events-none absolute inset-0 opacity-40" />

        {/* Close button */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={close}
          aria-label={data.closeLabel}
          className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-black/50 text-[var(--text)] backdrop-blur-sm transition hover:border-[var(--red)] hover:text-[var(--red-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative grid md:grid-cols-2">
          {/* Left: copy + CTA */}
          <div className="flex flex-col justify-center gap-5 p-7 sm:p-9 md:p-10">
            <span
              data-popup-reveal
              className="inline-flex w-fit items-center rounded-full border border-[var(--red)] bg-[rgba(255,30,30,0.12)] px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--red-bright)]"
            >
              {data.badge}
            </span>

            <h2
              data-popup-reveal
              className="font-display text-4xl uppercase leading-[0.92] tracking-[0.01em] text-white text-glow-red sm:text-5xl"
            >
              {data.headline}
            </h2>

            <p
              data-popup-reveal
              className="text-[0.98rem] leading-relaxed text-[var(--muted)]"
            >
              {data.subheadline}
            </p>

            <a
              data-popup-reveal
              href={data.ctaHref}
              onClick={onCtaClick}
              aria-label={data.ctaAriaLabel}
              className="cta-shimmer animate-red-pulse group inline-flex items-center justify-center gap-3 rounded-full bg-[var(--red)] px-7 py-4 font-heading text-sm font-bold uppercase tracking-[0.14em] text-white shadow-glow transition duration-300 hover:bg-[var(--red-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>{data.ctaLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <div data-popup-reveal className="flex flex-col gap-1.5">
              <p className="text-[0.78rem] text-[var(--muted)]">{data.microcopy}</p>
              {data.note ? (
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {data.note}
                </p>
              ) : null}
            </div>
          </div>

          {/* Right: vertical visual */}
          <div className="relative hidden min-h-[420px] md:block">
            <img
              src={data.image}
              alt={data.imageAlt}
              className="absolute inset-0 h-full w-full object-cover object-top"
              width="1800"
              height="2000"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070303] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070303]/80 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
