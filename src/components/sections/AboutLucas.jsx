import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useIsMobile } from "../../hooks/useIsMobile";
import PremiumCTA from "../ui/PremiumCTA";
import SectionLabel from "../ui/SectionLabel";

const mobileAboutBullets = [
  "Mi nombre es Lucas Casalins, soy Profesor de Educación Física, Licenciado en Alto Rendimiento Deportivo y atleta con más de 20 torneos regionales.",
  "Me formé con más de 65 certificaciones nacionales e internacionales en nutrición, entrenamiento y biomecánica, y soy parte de la cátedra de Biomecánica en la Facultad de Educación Física, lo que me permite unir la ciencia con la práctica real.",
  "Con mi método ayudé a más de 2.500 personas en 10 países a transformar su cuerpo, recuperar energía y volver a sentirse seguras consigo mismas.",
  "Sé lo que es mirarte al espejo y no gustarte, sentir que no tenés tiempo o frustrarte porque nada funciona. Lo viví en carne propia. Y por eso mi estilo es claro: no vendo humo, no prometo atajos ni resultados mágicos.",
];

/**
 * AboutLucas — UNIFIED layout for both variants A and B.
 * Image LEFT (fixed, no scroll parallax), editorial text RIGHT.
 * The closing statement spans the FULL width below the image/text grid
 * as a strong highlight + CTA.
 *
 * Copy is fully driven from LandingCopy.js (data.* + cta.*).
 */
export default function AboutLucas({ data, cta }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const aboutBullets = isMobile ? mobileAboutBullets : data.bullets;

  useGSAP(
    () => {
      if (reducedMotion) return;

      // Image: lands from the left with a touch of overshoot — but stays put on scroll.
      gsap.fromTo(
        "[data-about-img]",
        { opacity: 0.01, x: -64, scale: 0.96, filter: "blur(8px)" },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power4.out",
          immediateRender: false,
          clearProps: "opacity,transform,filter",
          scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
        },
      );

      // Heading: clip-reveal upward with a slight blur.
      gsap.fromTo(
        "[data-about-head]",
        { opacity: 0.01, yPercent: 60, filter: "blur(10px)" },
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power4.out",
          immediateRender: false,
          clearProps: "opacity,transform,filter",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        },
      );

      // Text blocks: staggered rise with subtle 3D tilt.
      gsap.fromTo(
        "[data-about-block]",
        { opacity: 0.01, y: 26, rotateX: 8, transformPerspective: 700 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: "[data-about-text]", start: "top 82%", once: true },
        },
      );

      // Full-width closing: scale-in punch.
      gsap.fromTo(
        "[data-about-closing]",
        { opacity: 0.01, y: 34, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.4)",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: "[data-about-closing]", start: "top 86%", once: true },
        },
      );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section id="about" ref={ref} className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1140px] px-5 md:px-8">
        <div data-about-head>
          <SectionLabel>{data.eyebrow}</SectionLabel>
          <h2 className="mt-3 max-w-3xl font-display text-3xl uppercase leading-[0.96] tracking-[0.01em] text-white md:text-5xl">
            {data.title}
          </h2>
        </div>

        {/* Two-column: image LEFT (compact card), editorial text RIGHT */}
        <div className="mt-8 grid gap-8 lg:mt-10 lg:gap-10 lg:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-[clamp(40px,5vw,72px)]">
          {/* ── Left: image (no scroll parallax) ── */}
          <div data-about-img="true" className="hidden md:block">
            <div
              className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl aspect-[4/3] max-h-[300px] min-h-0 md:aspect-[16/10] md:max-h-[240px] md:max-w-none lg:aspect-auto lg:h-[clamp(460px,46vw,620px)] lg:min-h-[440px] lg:max-h-[620px]"
              style={{
                border: "1.5px solid rgba(255,30,30,0.45)",
                boxShadow:
                  "0 0 0 1px rgba(255,30,30,0.08), 0 0 48px rgba(255,30,30,0.20), 0 24px 64px rgba(0,0,0,0.65)",
              }}
            >
              <img
                src={data.image}
                alt="Lucas Casalins"
                className="h-full w-full object-cover object-[center_20%] lg:object-top"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
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

          {/* ── Right: editorial text ── */}
          <div data-about-text className="flex flex-col justify-center gap-[clamp(18px,2vw,28px)]">
            <div className="space-y-0">
              {aboutBullets.map((bullet, idx) => (
                <div key={idx} data-about-block="true">
                  {idx > 0 ? (
                    <div
                      aria-hidden="true"
                      className="my-3 h-px w-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255,30,30,0.35), transparent 70%)",
                      }}
                    />
                  ) : null}
                  <div className="flex items-start gap-2.5 md:gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--red)] shadow-[0_0_8px_rgba(255,30,30,0.8)] md:mt-[9px]"
                    />
                    <p className="m-0 text-[0.93rem] leading-[1.56] text-[var(--muted)] md:text-[1.02rem] md:leading-[1.62]">
                      {bullet}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Full-width closing: finalStatement + CTA ── */}
        <div data-about-closing className="mt-[clamp(36px,5vw,64px)]">
          <div
            aria-hidden="true"
            className="mb-8 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,30,30,0.42), rgba(255,80,40,0.18) 45%, transparent 75%)",
            }}
          />
          <div
            className="rounded-2xl border-l-[3px] border-[var(--red)] bg-[rgba(255,30,30,0.06)] px-6 py-6 md:px-9 md:py-8"
            style={{
              boxShadow:
                "inset 0 0 40px rgba(255,30,30,0.06), 0 18px 48px rgba(0,0,0,0.45)",
            }}
          >
            <p className="w-full text-[1.02rem] font-semibold leading-relaxed text-[var(--red-bright)] md:text-[1.14rem]">
              {data.finalStatement}
            </p>
          </div>
          <div data-about-img="true" className="mt-8 block md:hidden">
            <div
              className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl aspect-[4/3] max-h-[300px] min-h-0"
              style={{
                border: "1.5px solid rgba(255,30,30,0.45)",
                boxShadow:
                  "0 0 0 1px rgba(255,30,30,0.08), 0 0 48px rgba(255,30,30,0.20), 0 24px 64px rgba(0,0,0,0.65)",
              }}
            >
              <img
                src={data.image}
                alt="Lucas Casalins"
                className="h-full w-full scale-[1.03] object-cover object-[center_26%]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
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
          <div className="mt-8">
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
