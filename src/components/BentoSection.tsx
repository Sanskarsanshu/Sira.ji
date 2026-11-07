import React, { useEffect, useRef, useState } from 'react';
import { IMAGES, VIDEOS } from '../constants/assets';
import { useAtelier } from '../context/AtelierContext';
import { api } from '../services/api';
import type { CapsulePiece } from '../types';

export const BentoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const { openBooking, openCapsuleModal, openProvenanceModal } = useAtelier();
  const [capsulePieces, setCapsulePieces] = useState<CapsulePiece[]>([]);

  useEffect(() => {
    const v = videoRef.current;
    const still = stillRef.current;
    if (!v) return;

    v.src = VIDEOS.bento;
    const handlePlaying = () => {
      if (still) {
        still.style.transition = 'opacity 1.2s';
        still.style.opacity = '0';
      }
    };

    v.addEventListener('playing', handlePlaying, { once: true });
    v.play().catch(() => {});

    return () => {
      v.removeEventListener('playing', handlePlaying);
    };
  }, []);

  useEffect(() => {
    api.getFeaturedCapsule().then((res) => {
      if (res.success && res.data) {
        setCapsulePieces(res.data);
      }
    });
  }, []);

  return (
    <section className="s-bento" id="features">
      <div className="wrap">
        <div className="bento-shell">
          <video
            ref={videoRef}
            className="media"
            id="v-bento"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={IMAGES.bentoBg}
          />
          <img
            ref={stillRef}
            className="media kb"
            data-fallback="v-bento"
            src={IMAGES.bentoBg}
            alt="Sera.ji craftsmanship backdrop"
          />

          <div className="sec-head">
            <span className="eyebrow rv">Handpicked Fibers, Pure Sera.ji</span>
            <h2 className="h2 split" data-split>
              Silhouettes Get Sharper When<br />
              <span className="lt">Every Piece Is Handpicked</span>
            </h2>
            <p className="lead rv" style={{ '--d': 3 } as React.CSSProperties}>
              Beyond transient fast-fashion cycles. Sera.ji unites certified organic fibers, bespoke digital draping,
              and centuries of tailoring craft to create timeless garments.
            </p>
          </div>

          <div className="bento">
            {/* Card 1: Main Feature Card */}
            <div className="card c-big rv" style={{ '--d': 1 } as React.CSSProperties}>
              <img className="media" src={IMAGES.sunface} alt="Sera.ji seasonal silhouette model" />
              <div>
                <h3>
                  Learn just what<br />
                  <span>makes Sera.ji handpicked.</span>
                </h3>
                <p className="desc">
                  Sera.ji analyzes your proportions, palette, and lifestyle to tailor wardrobe staples that fit with
                  bespoke millimeter perfection.
                </p>
              </div>
              <div>
                <div className="avatars">
                  <div className="av-imgs">
                    <img src={IMAGES.profile} alt="Sera.ji patron avatar" />
                    <img src={IMAGES.hat} alt="Sera.ji patron avatar" />
                    <img src={IMAGES.sunface} alt="Sera.ji patron avatar" />
                  </div>
                  <span>Worn by 2,400+ Sera.ji patrons</span>
                </div>
                <button
                  type="button"
                  className="btn-white"
                  onClick={() => openBooking('runway-fitting')}
                  style={{ cursor: 'pointer', border: 'none' }}
                >
                  Order Now
                </button>
              </div>
            </div>

            {/* Card 2: Fabric Quality & Collage */}
            <div className="card c-pad rv" style={{ '--d': 2 } as React.CSSProperties}>
              <div className="collage">
                <img src={IMAGES.product} alt="Sustainable organic garment detail" />
                <img src={IMAGES.profile} alt="Mediterranean silk fabric movement" />
              </div>
              <div className="txt">
                <h4>The Handpicked Standard</h4>
                <p>
                  Sera.ji sources Grade-6A organic mulberry silks, 450GSM French terry, and certified sea-island cottons.
                </p>
              </div>
            </div>

            {/* Card 3: Gauge Quality Metrics */}
            <div className="card c-pad rv" style={{ '--d': 3 } as React.CSSProperties} id="gauge-card">
              <div className="gauge">
                <svg viewBox="0 0 180 100" style={{ width: '180px', height: '110px', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="gg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#a9c6e6" />
                      <stop offset="100%" stopColor="#e9a77d" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M10 95 A80 80 0 0 1 170 95"
                    fill="none"
                    stroke="rgba(42,26,18,.1)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path
                    id="g-arc"
                    d="M10 95 A80 80 0 0 1 170 95"
                    fill="none"
                    stroke="url(#gg)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="252"
                    strokeDashoffset="252"
                    style={{ transition: 'stroke-dashoffset 2.2s cubic-bezier(.22,1,.36,1)' }}
                  />
                </svg>
                <div className="val">
                  <span data-count="94">0</span>%
                </div>
                <div className="ends">
                  <span>Standard Wear</span>
                  <span>Couture Grade</span>
                </div>
              </div>
              <div className="txt">
                <h4>Designed for Timeless Wear</h4>
                <p>
                  Every piece is handpicked and stress-tested against structural drape criteria, ensuring garments hold their
                  silhouette for decades.
                </p>
              </div>
            </div>

            {/* Card 4: Capsule Pieces with Interactive Inspection */}
            <div className="card c-pad rv" style={{ '--d': 4 } as React.CSSProperties}>
              <div className="rows">
                {(capsulePieces.length > 0 ? capsulePieces.slice(0, 3) : [
                  {
                    id: 'cap-1',
                    title: 'Lead Visual',
                    subtitle: 'Soft · Organic · 22 Momme Silk',
                    image: IMAGES.hat,
                    status: 'ready' as const,
                    tag: 'Sera.ji Haute Couture',
                  },
                  {
                    id: 'cap-2',
                    title: 'Product Still',
                    subtitle: 'Washed Linen · Travertine Marble',
                    image: IMAGES.product,
                    status: 'weaving' as const,
                    tag: 'Artisan Tailoring',
                  },
                  {
                    id: 'cap-3',
                    title: 'Story Crop',
                    subtitle: 'Bias Cut Slip · Golden Hour Light',
                    image: IMAGES.profile,
                    status: 'ready' as const,
                    tag: 'Evening Silks',
                  },
                ]).map((piece, idx) => (
                  <div
                    key={piece.id}
                    className="row interactive-row"
                    style={{ '--i': idx } as React.CSSProperties}
                    onClick={() => openCapsuleModal(piece)}
                    title="Click to view Sera.ji specifications"
                  >
                    <img src={piece.image} alt={piece.title} />
                    <div>
                      <b>{piece.title}</b>
                      <em>{piece.subtitle}</em>
                    </div>
                    <div className="ok">
                      <svg
                        width="9"
                        height="7"
                        viewBox="0 0 9 7"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 3.5l2.5 2.5L8 1" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <div className="txt">
                <h4>Every Piece Is Handpicked</h4>
                <p>
                  Click any piece above to inspect hand-rolled seams, momme density, and private commission availability.
                </p>
              </div>
            </div>

            {/* Card 5: Fiber & Motion with Provenance Modal Trigger */}
            <div className="card c-pad rv" style={{ '--d': 5 } as React.CSSProperties}>
              <div className="insight" onClick={openProvenanceModal} style={{ cursor: 'pointer' }} title="View Cryptographic Fiber Provenance Audit">
                <img src={IMAGES.hat} alt="Sera.ji sustainable organic fabric verification" />
                <div className="chip">
                  <span className="dot" />
                  <span>Fiber Origin Verified ↗</span>
                </div>
              </div>
              <div className="txt">
                <h4>From Drape to Finished Garment</h4>
                <p>
                  Sera.ji translates bespoke digital sketches into hand-cut master patterns, artisan spec sheets, and
                  finished couture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
