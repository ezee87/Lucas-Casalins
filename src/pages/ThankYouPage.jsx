import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, Check, X } from "lucide-react";
import { gsap, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { thankYouCopy } from "../data/ThankYouCopy";
import { testimonialCases } from "../data/TestimonialCases";
import { landingCopy } from "../content/LandingCopy";
import SmoothScrollProvider from "../components/layout/SmoothScrollProvider";
import PageShell from "../components/layout/PageShell";
import Footer from "../components/sections/Footer";
import SectionLabel from "../components/ui/SectionLabel";

function toYouTubeEmbed(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function StepTitle({ text }) {
  const [step, ...rest] = text.split(":");
  return (
    <h2 className="inline-flex flex-wrap items-center justify-center gap-2 text-center font-display text-[clamp(1.35rem,4.8vw,2.35rem)] uppercase leading-[0.96] tracking-[0.01em] text-white">
      <span>
        <span className="text-[var(--red)] text-glow-red">{step}:</span>{" "}
        {rest.join(":").trim()}
      </span>
      <ArrowDown className="h-4 w-4 shrink-0 text-[var(--red)] md:h-5 md:w-5" aria-hidden="true" />
    </h2>
  );
}

function HighlightMandatory({ text }) {
  const parts = text.split("OBLIGATORIO");
  if (parts.length === 1) return text;

  return (
    <>
      {parts[0]}
      <span className="font-bold text-[var(--red)] underline decoration-[var(--red)] decoration-2 underline-offset-[3px]">
        OBLIGATORIO
      </span>
      {parts.slice(1).join("OBLIGATORIO")}
    </>
  );
}

export default function ThankYouPage() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const [stepOneReady, setStepOneReady] = useState(false);

  const youtubeEmbed = useMemo(
    () => toYouTubeEmbed(thankYouCopy.stepTwo.videoUrl),
    [],
  );

  const successCases = useMemo(
    () => testimonialCases,
    [],
  );

  useEffect(() => {
    document.title = thankYouCopy.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", thankYouCopy.meta.description);
    }
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        "[data-ty-topline]",
        { opacity: 0.01, y: -24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "opacity,transform",
        },
      );

      gsap.fromTo(
        "[data-ty-hero] > *",
        { opacity: 0.01, y: 36, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 0.72,
          ease: "power4.out",
          immediateRender: false,
          clearProps: "opacity,transform,filter",
          scrollTrigger: { trigger: "[data-ty-hero]", start: "top 82%", once: true },
        },
      );

      gsap.fromTo(
        "[data-ty-step]",
        { opacity: 0.01, y: 44, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.14,
          duration: 0.78,
          ease: "back.out(1.35)",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: "[data-ty-steps-wrap]", start: "top 84%", once: true },
        },
      );

      gsap.fromTo(
        "[data-ty-check-item]",
        { opacity: 0.01, x: -32 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.06,
          duration: 0.58,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: "[data-ty-check]", start: "top 84%", once: true },
        },
      );

      gsap.fromTo(
        "[data-ty-case]",
        { opacity: 0.01, y: 40, scale: 0.95, rotateX: 8, transformPerspective: 800 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          stagger: 0.07,
          duration: 0.72,
          ease: "back.out(1.45)",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: "[data-ty-cases-grid]", start: "top 84%", once: true },
        },
      );

      gsap.fromTo(
        "[data-ty-footer]",
        { opacity: 0.01, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: "[data-ty-footer]", start: "top 95%", once: true },
        },
      );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <SmoothScrollProvider>
      <PageShell>
        <main ref={ref} className="relative overflow-hidden pb-12 pt-4 md:pb-16 md:pt-7">
          <header className="mx-auto w-full max-w-[1180px] px-4 sm:px-5 md:px-8">
            <img
              src={landingCopy.header.logo}
              alt={landingCopy.header.logoAlt}
              className="mx-auto h-10 w-auto object-contain md:h-12"
              width="500"
              height="500"
              decoding="async"
            />
          </header>

          <div data-ty-topline className="mx-auto mt-6 w-full max-w-[1180px] px-4 text-center sm:px-5 md:mt-7 md:px-8">
            <p className="inline-flex items-center justify-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/95 md:text-[0.74rem]">
              {thankYouCopy.labels.topStepsTitle}
            </p>
          </div>

          <section className="mx-auto mt-5 w-full max-w-[1180px] px-4 sm:px-5 md:mt-7 md:px-8">
            <div
              data-ty-hero
              className="card-border-trace relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[rgba(8,8,8,0.86)] px-5 py-6 text-center md:px-8 md:py-9"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(255,30,30,0.14),transparent_70%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.46))]" />

              <SectionLabel className="relative z-[1] mb-4 justify-center">{thankYouCopy.labels.confirmation}</SectionLabel>

              <h1 className="relative z-[1] flex items-center justify-center gap-2 text-center font-display text-[clamp(1.55rem,5.8vw,3rem)] uppercase leading-[0.92] tracking-[0.01em] text-white">
                {thankYouCopy.hero.alertTitle}
              </h1>

              <p className="relative z-[1] mx-auto mt-4 max-w-4xl text-[0.95rem] leading-[1.58] text-[rgba(255,244,234,0.9)] md:text-[1.02rem]">
                <HighlightMandatory text={thankYouCopy.hero.mainText} />
              </p>

              <p className="relative z-[1] mt-4 inline-flex rounded-lg border border-[rgba(255,30,30,0.28)] bg-[rgba(255,30,30,0.08)] px-4 py-2 text-[0.86rem] font-semibold uppercase tracking-[0.06em] text-[var(--red-bright)] md:text-[0.9rem]">
                {thankYouCopy.hero.important}
              </p>
            </div>
          </section>

          <div data-ty-steps-wrap className="mx-auto mt-7 w-full max-w-[1180px] px-4 sm:px-5 md:mt-9 md:px-8">
            <section data-ty-step className="thankyou-step-section text-center">
              <div className="thankyou-step-divider" aria-hidden="true" />
              <div className="flex justify-center">
                <StepTitle text={thankYouCopy.stepOne.title} />
              </div>
              <div className="thankyou-video-card card-border-trace mx-auto max-w-[920px] overflow-hidden rounded-3xl border border-[var(--line)] bg-[rgba(8,8,8,0.88)] p-2 md:p-3">
                {stepOneReady ? (
                  <video
                    controls
                    autoPlay
                    preload="metadata"
                    poster={thankYouCopy.stepOne.poster}
                    className="w-full rounded-[1.1rem] bg-black"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <source src={thankYouCopy.stepOne.videoUrl} type="video/mp4" />
                    {thankYouCopy.labels.fallbackVideoText}
                  </video>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStepOneReady(true)}
                    aria-label={thankYouCopy.stepOne.playLabel}
                    className="group relative block w-full overflow-hidden rounded-[1.1rem] bg-[#050202]"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <img
                      src={thankYouCopy.stepOne.poster}
                      alt={thankYouCopy.stepOne.posterAlt}
                      className="h-full w-full object-cover"
                      width="1672"
                      height="941"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.12)_44%,rgba(0,0,0,0.56)_100%)]" />
                    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_68%,rgba(255,30,30,0.12),transparent_56%)]" />
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.34),rgba(0,0,0,0.08)_32%,rgba(0,0,0,0.44)_100%)]" />
                    <span className="bg-noise pointer-events-none absolute inset-0 opacity-[0.17] mix-blend-soft-light" />
                    <span className="pointer-events-none absolute inset-[-16px] left-1/2 top-1/2 z-20 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 scale-95 rounded-full border border-[var(--accent)] opacity-30 transition-all duration-500 group-hover:scale-110 group-hover:opacity-55" />
                    <span className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--red-bright)] bg-transparent transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_0_34px_rgba(255,30,30,0.52)] md:h-[90px] md:w-[90px]">
                      <svg
                        width="22"
                        height="26"
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
                )}
              </div>
            </section>

            <section data-ty-step data-ty-check className="thankyou-step-section thankyou-checklist-section text-center">
              <h3 className="font-display text-[clamp(1.35rem,4.6vw,2rem)] uppercase leading-[0.96] tracking-[0.01em] text-white">
                {thankYouCopy.labels.checklistTitle}
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-3 md:mt-5 md:grid-cols-2 md:gap-4">
                <article className="thankyou-checklist-card card-border-trace overflow-hidden rounded-2xl border border-[var(--line)] bg-[rgba(12,12,12,0.9)] p-5 md:p-6">
                  <p className="font-heading text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[var(--red-bright)]">
                    {thankYouCopy.labels.positiveTitle}
                  </p>
                  <ul className="thankyou-checklist-list mt-4 space-y-3">
                    {thankYouCopy.callChecklist.positive.map((item) => (
                      <li key={item} data-ty-check-item className="thankyou-checklist-item flex items-center gap-2.5 text-[0.9rem] leading-[1.58] text-[rgba(255,244,234,0.86)]">
                        <Check className="h-4 w-4 shrink-0 text-[var(--red)]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="thankyou-checklist-card card-border-trace overflow-hidden rounded-2xl border border-[var(--line)] bg-[rgba(12,12,12,0.9)] p-5 md:p-6">
                  <p className="font-heading text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[var(--red-bright)]">
                    {thankYouCopy.labels.negativeTitle}
                  </p>
                  <ul className="thankyou-checklist-list mt-4 space-y-3">
                    {thankYouCopy.callChecklist.negative.map((item) => (
                      <li key={item} data-ty-check-item className="thankyou-checklist-item flex items-center gap-2.5 text-[0.9rem] leading-[1.58] text-[rgba(255,244,234,0.86)]">
                        <X className="h-4 w-4 shrink-0 text-[var(--red)]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </section>

            <section data-ty-step className="thankyou-step-section text-center">
              <div className="thankyou-step-divider" aria-hidden="true" />
              <div className="flex justify-center">
                <StepTitle text={thankYouCopy.stepTwo.title} />
              </div>
              <div className="thankyou-video-card card-border-trace mx-auto max-w-[920px] overflow-hidden rounded-3xl border border-[var(--line)] bg-[rgba(8,8,8,0.88)] p-2 md:p-3">
                <iframe
                  src={youtubeEmbed}
                  title={thankYouCopy.stepTwo.title}
                  className="w-full rounded-[1.1rem] border-0"
                  style={{ aspectRatio: "16 / 9" }}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>

            <section data-ty-step className="thankyou-step-section thankyou-cases-section text-center">
              <div className="thankyou-step-divider" aria-hidden="true" />
              <div className="flex justify-center">
                <StepTitle text={thankYouCopy.stepThree.title} />
              </div>
              <p className="thankyou-cases-copy mx-auto mt-4 text-[0.92rem] leading-[1.58] text-[rgba(255,244,234,0.84)] md:text-[0.96rem]">
                {thankYouCopy.stepThree.descriptionOne}
              </p>
              <p className="thankyou-cases-copy mx-auto mt-2.5 text-[0.92rem] leading-[1.58] text-[rgba(255,244,234,0.84)] md:text-[0.96rem]">
                {thankYouCopy.stepThree.descriptionTwo}
              </p>

              <div data-ty-cases-grid className="thankyou-cases-grid mx-auto mt-4 max-w-[1220px]">
                {successCases.map((item) => (
                  <article
                    key={`${item.name}-${item.image}`}
                    data-ty-case
                    className="thankyou-case-card card-border-trace group transition-all duration-300 hover:-translate-y-1 hover:border-[var(--line-warm)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.52),0_0_20px_rgba(255,30,30,0.1)]"
                  >
                    <div className="thankyou-case-media relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={`${item.name} - caso de exito`}
                        className="thankyou-case-image transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="thankyou-case-content thankyou-case-card-body border-t border-[var(--line)] text-center">
                      <p className="thankyou-case-name thankyou-case-card-name font-heading font-bold uppercase text-[var(--red-bright)]">
                        {item.name}
                      </p>
                      <p className="thankyou-case-description thankyou-case-card-description mt-1.5 text-[rgba(255,244,234,0.8)]">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div data-ty-footer className="mt-10 md:mt-14">
            <Footer data={landingCopy.footer} ui={landingCopy.ui} />
          </div>
        </main>
      </PageShell>
    </SmoothScrollProvider>
  );
}
