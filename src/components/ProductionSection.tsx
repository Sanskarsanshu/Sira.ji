import React from 'react';
import { IMAGES } from '../constants/assets';
import { useAtelier } from '../context/AtelierContext';

export const ProductionSection: React.FC = () => {
  const { openColorwayModal, selectedColorway, openCapsuleModal, activeSilhouette } = useAtelier();

  const handleExploreCapsule = (e: React.MouseEvent) => {
    e.preventDefault();
    openCapsuleModal({
      id: 'cap-lead',
      title: 'Sera.ji Lead Capsule Piece',
      subtitle: 'Sunlit Riviera Edit · 22 Momme Silk',
      image: IMAGES.product,
      status: 'ready',
      tag: 'Sunlit Riviera Edit',
      price: '€ 3,200',
      details: [
        'Organically milled Grade-6A Mulberry Silk',
        'Hand-rolled French seams with 18 stitches per inch',
        '38-point anatomical bespoke fit passed',
        'Botanical sunlit dye bath with Alpine mineral salt setting',
      ],
      fabricSpecs: {
        momme: 22,
        weave: 'Crepe de Chine Sateen',
        origin: 'Lake Como, Italy',
        composition: '100% Organic Mulberry Silk',
      },
    });
  };

  return (
    <section className="s-prod" id="pricing">
      <div className="wrap">
        <div className="prod-shell">
          <div className="sec-head">
            <span className="eyebrow rv">Sera.ji Handpicked Craftsmanship</span>
            <h2 className="h2 split" data-split>
              From Handpicked Blueprint to<br />
              <span className="lt">Runway-Grade Execution</span>
            </h2>
            <p className="lead rv" style={{ '--d': 3 } as React.CSSProperties}>
              Sera.ji transforms conceptual sketches into finished tailored garments, limited-edition runs, and
              heirloom-quality releases.
            </p>
          </div>

          <div className="stage" id="stage">
            {/* LEFT COLUMN */}
            <div className="col">
              {/* CURATE COLORWAYS - INTERACTIVE TRIGGER */}
              <div
                className="g-card rv interactive-gcard"
                style={{ '--d': 1, cursor: 'pointer' } as React.CSSProperties}
                onClick={openColorwayModal}
                title="Open 12 Mediterranean Dye Lots Palette"
              >
                <div className="lbl-row">
                  <div className="lbl">Curate Colorways</div>
                  {selectedColorway && (
                    <span className="active-swatch-chip" style={{ backgroundColor: selectedColorway.hex }}>
                      {selectedColorway.name}
                    </span>
                  )}
                </div>
                <div className="thumbs">
                  <img src={IMAGES.sunface} alt="Silk dye option 1" />
                  <img src={IMAGES.product} alt="Silk dye option 2" />
                  <img src={IMAGES.profile} alt="Silk dye option 3" />
                </div>
                <div className="g-foot">
                  <span>12 handpicked dye lots available ↗</span>
                  <div className="foot-btn">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="#3b2116"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M2 5h6M5 2l3 3-3 3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* NOW WEAVING */}
              <div className="g-card build rv" style={{ '--d': 2 } as React.CSSProperties}>
                <div className="lbl">Now Weaving</div>
                <h5 style={{ marginTop: '4px' }}>{activeSilhouette || 'Tailoring Your Silhouette'}</h5>
                <ul>
                  <li>
                    <span className="l">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                      Fabric
                    </span>
                    <span className="v">Handpicked Mulberry Silk 22mm</span>
                  </li>
                  <li>
                    <span className="l">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                      </svg>
                      Drape
                    </span>
                    <span className="v">Structured Riviera</span>
                  </li>
                  <li>
                    <span className="l">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      Finish
                    </span>
                    <span className="v">Hand-rolled French Seams</span>
                  </li>
                </ul>
                <div className="bar">
                  <div className="t">
                    <b />
                  </div>
                  <span>Sera.ji hand-finishing on Como loom…</span>
                </div>
              </div>
            </div>

            {/* CENTRE HAND PARALLAX */}
            <div className="hand rv" style={{ '--d': 2 } as React.CSSProperties}>
              <img
                id="hand-img"
                src={IMAGES.hand}
                alt="Artisan hand holding finished garment essence toward the Mediterranean sky"
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="col">
              {/* READY FOR DELIVERY WITH EXPLORE MODAL */}
              <div className="g-card rv" style={{ '--d': 3 } as React.CSSProperties}>
                <div className="lbl">Ready for Delivery</div>
                <div className="hero-vis" onClick={handleExploreCapsule} style={{ cursor: 'pointer' }}>
                  <img src={IMAGES.product} alt="Lead capsule tailored piece" />
                  <div className="hero-vis-meta">
                    <h5>Sera.ji Lead Capsule Piece</h5>
                    <em>Sunlit Riviera Edit · Handpicked</em>
                    <ul className="checks">
                      <li>
                        <span className="dot" />
                        Fabric milled
                      </li>
                      <li>
                        <span className="dot" />
                        Hand-rolled seams
                      </li>
                      <li>
                        <span className="dot" />
                        Bespoke fit passed
                      </li>
                    </ul>
                  </div>
                </div>
                <a className="view" href="#start" onClick={handleExploreCapsule}>
                  <span>Explore Handpicked Specifications</span>
                  <span className="arr">→</span>
                </a>
              </div>

              {/* FIT PRECISION INDEX */}
              <div className="g-card rv" style={{ '--d': 4 } as React.CSSProperties} id="match-card">
                <div className="lbl">Fit Precision Index</div>
                <h5 style={{ marginTop: '2px' }}>Sera.ji Riviera Edit</h5>
                <em style={{ display: 'block', marginTop: '8px' }}>Handpicked · Organic · Radiant</em>
                <div className="match-row">
                  <div className="ring">
                    <svg viewBox="0 0 62 62" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                      <circle cx="31" cy="31" r="26" fill="none" stroke="rgba(42,26,18,.08)" strokeWidth="6" />
                      <circle
                        id="ring-arc"
                        cx="31"
                        cy="31"
                        r="26"
                        fill="none"
                        stroke="#f2c94c"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="163.4"
                        strokeDashoffset="163.4"
                        style={{ transition: 'stroke-dashoffset 2s cubic-bezier(.22,1,.36,1) .3s' }}
                      />
                    </svg>
                    <span className="ring-lbl">
                      <b data-count="94" style={{ fontWeight: 400 }}>
                        0
                      </b>
                      %
                    </span>
                  </div>
                  <img className="match-img" src={IMAGES.sunface} alt="Finished garment patron portrait" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
