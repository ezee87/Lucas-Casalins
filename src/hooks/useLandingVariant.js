const STORAGE_KEY = "arete_landing_variant";

function getInitialVariant() {
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("variant");

  if (forced === "A" || forced === "B") {
    localStorage.setItem(STORAGE_KEY, forced);
    return forced;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "A" || saved === "B") return saved;

  const assigned = Math.random() < 0.5 ? "A" : "B";
  localStorage.setItem(STORAGE_KEY, assigned);
  return assigned;
}

// Computed once per module load — no re-randomisation on re-renders, no flicker.
const landingVariant = getInitialVariant();

if (import.meta.env.DEV) {
  document.documentElement.setAttribute("data-variant", landingVariant);
}

export function useLandingVariant() {
  return landingVariant;
}
