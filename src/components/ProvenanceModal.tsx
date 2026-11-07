import React from 'react';
import { useAtelier } from '../context/AtelierContext';

export const ProvenanceModal: React.FC = () => {
  const { isProvenanceOpen, closeProvenanceModal } = useAtelier();

  if (!isProvenanceOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeProvenanceModal}>
      <div className="modal-panel provenance-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Cryptographic Atelier Audit</span>
            <h3>Fiber Origin &amp; Circularity Protocol</h3>
          </div>
          <button className="modal-close" onClick={closeProvenanceModal} aria-label="Close provenance modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="modal-intro">
          Sera.ji guarantees radical provenance transparency. Each garment is mapped from organic mulberry grove soil
          composition to the final hand-stitching artisan atelier where every piece is handpicked.
        </p>

        <div className="provenance-grid">
          {/* Card 1: Silk Traceability */}
          <div className="prov-card">
            <div className="prov-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h5>Grade-6A Mulberry Silk</h5>
            <p>
              Cultivated in pesticide-free certified bio-reserves along Lake Como. Fed exclusively on organic white
              mulberry leaves with zero synthetic pesticides or growth accelerants.
            </p>
            <div className="prov-footer">
              <span>Standard: GOTS v7.0 &amp; OEKO-TEX 100</span>
              <strong className="badge-ok">Verified ✓</strong>
            </div>
          </div>

          {/* Card 2: Flemish Master Flax */}
          <div className="prov-card">
            <div className="prov-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h5>Masters of Linen Flax</h5>
            <p>
              Grown in Courtrai, Belgium under natural maritime rainfall. Dew-retted in historical riverbed traditions
              requiring zero artificial irrigation and zero chemical retting agents.
            </p>
            <div className="prov-footer">
              <span>Standard: European Flax® Certified</span>
              <strong className="badge-ok">Verified ✓</strong>
            </div>
          </div>

          {/* Card 3: Zero Synthetic Content */}
          <div className="prov-card">
            <div className="prov-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h5>0% Microplastics &amp; Synthetics</h5>
            <p>
              Every seam, lining, and internal pocketing is constructed from 100% natural biodegradable fibers.
              Thread, buttons (natural horn and corozo), and labels decompose harmlessly into the earth.
            </p>
            <div className="prov-footer">
              <span>Circularity Score: 100 / 100</span>
              <strong className="badge-ok">Zero Plastics ✓</strong>
            </div>
          </div>

          {/* Card 4: Fair Artisan Wages */}
          <div className="prov-card">
            <div className="prov-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h5>Artisan Heritage &amp; Fair Wage</h5>
            <p>
              All master drapers, weavers, and hand-embroiderers earn an average of 185% above the European Living Wage
              standard, preserving centuries of intergenerational craft traditions in northern Italy and France.
            </p>
            <div className="prov-footer">
              <span>Living Wage Compliance: 100%</span>
              <strong className="badge-ok">Ethical Standard ✓</strong>
            </div>
          </div>
        </div>

        <div className="nfc-certificate">
          <div className="nfc-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 10.5C4 6.91 6.91 4 10.5 4h3C17.09 4 20 6.91 20 10.5v3c0 3.59-2.91 6.5-6.5 6.5h-3C6.91 20 4 17.09 4 13.5v-3z" />
              <path d="M8.5 9.5a3.5 3.5 0 0 1 3.5-3.5h0a3.5 3.5 0 0 1 3.5 3.5v5a3.5 3.5 0 0 1-3.5 3.5h0a3.5 3.5 0 0 1-3.5-3.5v-5z" />
            </svg>
          </div>
          <div>
            <strong>Sera.ji Cryptographic Atelier NFC Passport</strong>
            <p>
              Every finished handpicked commission features an encrypted micro-tag woven into the interior silk tab,
              providing lifelong verification of ownership, fabric provenance, and complimentary atelier garment care.
            </p>
          </div>
        </div>

        <div className="modal-actions center">
          <button className="btn-dark" onClick={closeProvenanceModal}>
            Return to Craftsmanship
          </button>
        </div>
      </div>
    </div>
  );
};
