import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const SIZES = {
  sm: "h-[44px] px-6 text-[0.7rem]",
  md: "h-[60px] min-w-[260px] px-9 text-[0.8rem]",
  lg: "h-[64px] min-w-[300px] px-10 text-[0.84rem] md:min-w-[320px] md:text-[1.3rem]",
};

// NOTE: border-radius is controlled via .premium-cta CSS (0.75rem / rounded-xl).
// We intentionally do NOT add rounded-full in JSX anymore.

/**
 * Single, reusable primary CTA for the whole landing.
 * Red/neon gradient, white text, fixed height, pill radius, glow, subtle
 * shimmer + constant pulse, GSAP entrance and an animated arrow on hover.
 */
export default function PremiumCTA({
  href = "#booking",
  label,
  ariaLabel,
  onClick,
  className = "",
  size = "md",
  animateIn = true,
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion || !animateIn) return;

      // Strong signature entrance: rockets in from the left, overshoots past
      // its resting spot, then snaps back with a pronounced bounce.
      gsap.fromTo(
        el,
        { opacity: 0.01, x: -140 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "back.out(2.4)",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        },
      );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={`premium-cta cta-shimmer group mx-auto flex w-full max-w-[300px] shrink-0 items-center justify-center gap-3 whitespace-nowrap font-heading font-bold uppercase tracking-[0.14em] text-white md:w-fit md:max-w-none ${SIZES[size] || SIZES.md} ${className}`}
    >
      {/* Smoke / energy inner glow — always rendered, CSS animates it */}
      <span className="cta-smoke" aria-hidden="true" />
      <span
        className="premium-cta-side premium-cta-side--ghost relative z-[2] inline-flex h-7 w-7 items-center justify-center rounded-full"
        aria-hidden="true"
      />
      <span className="premium-cta-label relative z-[2] text-center">{label}</span>
      <span className="premium-cta-side relative z-[2] inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white/25">
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
      </span>
    </a>
  );
}
