import { useEffect } from "react";
import { landingCopy } from "./content/LandingCopy";
import PageShell from "./components/layout/PageShell";
import SmoothScrollProvider from "./components/layout/SmoothScrollProvider";
import Hero from "./components/sections/Hero";
import SuccessCases from "./components/sections/SuccessCases";
import TestimonialCarousel from "./components/sections/TestimonialCarousel";
import AboutLucas from "./components/sections/AboutLucas";
import BookingSection from "./components/sections/BookingSection";
import FAQSection from "./components/sections/FAQSection";
import Footer from "./components/sections/Footer";

function App() {
  useEffect(() => {
    document.title = landingCopy.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", landingCopy.meta.description);
    }
  }, []);

  return (
    <SmoothScrollProvider>
      <PageShell>
        <main>
          <Hero data={landingCopy.hero} cta={landingCopy.cta} header={landingCopy.header} />
          <BookingSection data={landingCopy.booking} cta={landingCopy.cta} />
          <SuccessCases data={landingCopy.successCases} cta={landingCopy.cta} />
          <TestimonialCarousel data={landingCopy.testimonials} ui={landingCopy.ui} cta={landingCopy.cta} />
          <AboutLucas data={landingCopy.about} cta={landingCopy.cta} />
          <FAQSection data={landingCopy.faq} />
        </main>
        <Footer data={landingCopy.footer} ui={landingCopy.ui} />
      </PageShell>
    </SmoothScrollProvider>
  );
}

export default App;
