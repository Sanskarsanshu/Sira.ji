import React from 'react';
import { useLenis } from './hooks/useLenis';
import { useScrollReveal } from './hooks/useScrollReveal';
import { AtelierProvider } from './context/AtelierContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TryTheLookSection } from './components/TryTheLookSection';
import { BentoSection } from './components/BentoSection';
import { ProductionSection } from './components/ProductionSection';
import { EditorialSection } from './components/EditorialSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';

// Interactive modals and drawers
import { BookingModal } from './components/BookingModal';
import { CapsuleModal } from './components/CapsuleModal';
import { ColorwayModal } from './components/ColorwayModal';
import { ProvenanceModal } from './components/ProvenanceModal';
import { CurationDrawer } from './components/CurationDrawer';
import { ToastContainer } from './components/ToastContainer';

import './scaled.css';

const AtelierLanding: React.FC = () => {
  // Initialize Lenis smooth scroll and parallax tracking
  useLenis();

  // Initialize IntersectionObserver word-split headings and count-up metrics
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        {/* SECTION 1: HERO & ATELIER CONCIERGE */}
        <Hero />

        {/* SECTION 1.5: TRY THE LOOK — RUNWAY */}
        <TryTheLookSection />

        {/* SECTION 2: BENTO CRAFTSMANSHIP & FIBER STANDARDS */}
        <BentoSection />

        {/* SECTION 3: ATELIER PRODUCTION & RUNWAY-GRADE WEAVING */}
        <ProductionSection />

        {/* SECTION 4: GLOBAL RUNWAY ACCLAIM & VERIFIED METRICS */}
        <EditorialSection />

        {/* SECTION 5: CRAFTSMANSHIP INQUIRIES & FAQ */}
        <FaqSection />

        {/* SECTION 6: PRIVATE ACCESS CTA & MAISON FOOTER */}
        <section className="s-foot" id="start">
          <div className="wrap">
            <CtaSection />
            <Footer />
          </div>
        </section>
      </main>

      {/* LUXURY INTERACTIVE PORTALS & DRAWERS */}
      <BookingModal />
      <CapsuleModal />
      <ColorwayModal />
      <ProvenanceModal />
      <CurationDrawer />
      <ToastContainer />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AtelierProvider>
      <AtelierLanding />
    </AtelierProvider>
  );
};

export default App;
