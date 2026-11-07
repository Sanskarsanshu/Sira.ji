import React from 'react';
import { useAtelier } from '../context/AtelierContext';

export const Footer: React.FC = () => {
  const { openBooking, openProvenanceModal, openColorwayModal } = useAtelier();

  return (
    <footer className="foot">
      <div className="foot-grid">
        <div className="about rv" style={{ '--d': 0 } as React.CSSProperties}>
          <h6>About Sera.ji</h6>
          <p>
            Sera.ji is a contemporary luxury clothing brand devoted to architectural tailoring, certified organic
            silks, where every piece is handpicked.
          </p>
          <div className="socials">
            {/* Facebook */}
            <a href="#" className="social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* X (Twitter) */}
            <a href="#" className="social-btn" aria-label="X">
              <svg viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" className="social-btn" aria-label="YouTube">
              <svg viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="rv" style={{ '--d': 1 } as React.CSSProperties}>
          <h6>Collections</h6>
          <ul className="foot-links">
            <li><a href="#product">The Runway Capsule</a></li>
            <li><a href="#features">Resort Silk Edition</a></li>
            <li>
              <button
                type="button"
                className="foot-btn-link"
                onClick={() => openBooking('runway-fitting')}
              >
                Bespoke Tailoring Fitting ↗
              </button>
            </li>
            <li>
              <button
                type="button"
                className="foot-btn-link"
                onClick={openColorwayModal}
              >
                Mediterranean Dye Lots ↗
              </button>
            </li>
          </ul>
        </div>

        <div className="rv" style={{ '--d': 2 } as React.CSSProperties}>
          <h6>Atelier &amp; Craft</h6>
          <ul className="foot-links">
            <li>
              <button
                type="button"
                className="foot-btn-link"
                onClick={openProvenanceModal}
              >
                Fabric Provenance &amp; Audit ↗
              </button>
            </li>
            <li><a href="#inquiries">Garment Care Guide</a></li>
            <li>
              <button
                type="button"
                className="foot-btn-link"
                onClick={() => openBooking('private-consultation')}
              >
                Private Salon Fittings ↗
              </button>
            </li>
            <li><a href="#inquiries">Sizing &amp; Anatomical Tailoring</a></li>
          </ul>
        </div>

        <div className="rv" style={{ '--d': 3 } as React.CSSProperties}>
          <h6>Maison</h6>
          <ul className="foot-links">
            <li><a href="#acclaim">Heritage &amp; Acclaim</a></li>
            <li>
              <button
                type="button"
                className="foot-btn-link"
                onClick={() => openBooking('digital-drape')}
              >
                Digital Haute Concierge ↗
              </button>
            </li>
            <li>
              <button
                type="button"
                className="foot-btn-link"
                onClick={openProvenanceModal}
              >
                Sustainability Charter ↗
              </button>
            </li>
            <li><a href="#inquiries">Client Terms</a></li>
          </ul>
        </div>

        <div className="mark rv" style={{ '--d': 4 } as React.CSSProperties}>
          <svg viewBox="0 0 40 40" fill="#2a1a12">
            <path d="M5 5h13v13H5zM22 22h13v13H22z" />
            <path d="M22 5a13 13 0 0 1 13 13H22zM18 35A13 13 0 0 1 5 22h13z" />
          </svg>
        </div>
      </div>

      <div className="legal">
        <a href="#inquiries">Privacy Charter</a>
        <span>© 2026 Sera.ji Clothing Brand. All rights reserved. Every piece is handpicked.</span>
        <button
          type="button"
          className="foot-btn-link"
          onClick={() => openBooking('private-consultation')}
        >
          Client Relations &amp; Concierge
        </button>
      </div>
    </footer>
  );
};
