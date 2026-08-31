import { useEffect, useMemo, useRef, useState } from "react";
import SectionLabel from "../ui/SectionLabel";
import { ScrollTrigger } from "../../lib/gsap";
import useGhlLeadCapture from "../../hooks/useGhlLeadCapture";

export default function BookingSection({ data, landingVariant }) {
  const calendarIframeRef = useRef(null);
  const [showCalendarFallback, setShowCalendarFallback] = useState(false);
  useGhlLeadCapture(calendarIframeRef);
  const calendarEmbedUrl = useMemo(() => {
    const url = new URL(data.calendarEmbedUrl);
    url.searchParams.set("landing_variant", landingVariant);
    return url.toString();
  }, [data.calendarEmbedUrl, landingVariant]);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      setShowCalendarFallback(true);
    }, 6000);

    return () => window.clearTimeout(fallbackTimer);
  }, [calendarEmbedUrl]);

  // Load the GoHighLevel embed script once
  useEffect(() => {
    if (document.querySelector(`script[src="${data.calendarEmbedScript}"]`)) return;
    const script = document.createElement("script");
    script.src = data.calendarEmbedScript;
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
  }, [data.calendarEmbedScript]);

  return (
    <section id="booking" className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1040px] px-5 md:px-8">
        <SectionLabel>{data.eyebrow}</SectionLabel>

        <h2 className="mt-3 font-display text-5xl uppercase leading-[0.9] tracking-[0.01em] text-white text-glow-red md:text-7xl">
          {data.title}
        </h2>

        {/* Duration pill */}
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--line-warm)] bg-[rgba(255,30,30,0.06)] px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-[var(--text)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--red)] shadow-[0_0_10px_rgba(255,30,30,0.8)]" />
          {data.duration} · {data.durationNote}
        </p>

        {/* Calendar embed inside a dark, red-glow block */}
        <div
          className="relative mt-10 overflow-hidden rounded-[1.6rem] border border-[var(--red)] bg-[#070303] p-2 md:p-3"
          style={{
            borderColor: "rgba(255,30,30,0.42)",
            boxShadow:
              "0 0 0 1px rgba(255,30,30,0.08), 0 0 34px rgba(255,30,30,0.15), 0 16px 52px rgba(0,0,0,0.68)",
          }}
        >
          <div className="bg-dots-red pointer-events-none absolute inset-0 opacity-30" />
          <div
            id="booking-embed"
            className="relative h-[78vh] min-h-[720px] overflow-y-auto rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface)] md:min-h-[780px]"
          >
            <iframe
              ref={calendarIframeRef}
              src={calendarEmbedUrl}
              id={data.calendarEmbedId}
              title={data.title}
              loading="eager"
              style={{ width: "100%", border: "none" }}
              scrolling="auto"
              className="min-h-[980px] w-full md:min-h-[1080px]"
              onLoad={() => {
                ScrollTrigger.refresh();
              }}
            />

          </div>

          {showCalendarFallback && (
            <div className="relative z-10 flex justify-center px-3 py-3">
              <a
                href={calendarEmbedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--line-warm)] bg-[#120909]/95 px-4 py-2 text-center text-xs font-semibold text-[var(--text)] shadow-lg transition-colors hover:border-[var(--red)] hover:text-white"
              >
                Abrir calendario en una nueva pestaña
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
