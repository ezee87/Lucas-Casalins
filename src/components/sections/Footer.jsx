// Inline SVG icons — no dependency on removed lucide social icons
const SvgFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const SvgInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const SvgYoutube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="#030303" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);
const SvgLinkedin = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const ICONS = {
  Facebook: SvgFacebook,
  Instagram: SvgInstagram,
  YouTube: SvgYoutube,
  LinkedIn: SvgLinkedin,
};

export default function Footer({ data, ui = {} }) {
  return (
    <footer className="border-t border-[var(--line)] py-10">
      {/*
        3-column grid so the social icons are mathematically centered in the
        footer, independent of the logo/copyright widths.
        Mobile: stacks into a single centered column.
      */}
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-6 px-5 text-center md:grid-cols-3 md:px-8">
        {/* Left: logo */}
        <div className="flex justify-center md:justify-start">
          <img
            src={data.logo}
            alt={ui.logoAlt || "ARETÉ"}
            className="h-9 w-auto object-contain opacity-75"
            width="500"
            height="500"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Center: socials — perfectly centered in the middle column */}
        <nav
          className="mx-auto flex w-full items-center justify-center gap-[14px] md:w-auto md:gap-3"
          aria-label="Redes sociales"
        >
          {data.socials.map((social) => {
            const Icon = ICONS[social.label];
            return (
              <a
                key={social.label}
                href={social.href}
                aria-label={`${ui.social || "Red social"}: ${social.label}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition-all duration-300 hover:border-[var(--line-warm)] hover:text-[var(--orange-soft)]"
              >
                {Icon ? (
                  <span className="inline-flex items-center justify-center">
                    <Icon />
                  </span>
                ) : (
                  <span className="text-xs font-semibold">{social.label[0]}</span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: copyright */}
        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)] md:text-right">
          &copy; {new Date().getFullYear()} Programa ARETÉ
        </p>
      </div>
    </footer>
  );
}
