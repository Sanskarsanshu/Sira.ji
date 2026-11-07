import React from 'react';
import { useAtelier } from '../context/AtelierContext';
import type { ColorwaySwatch } from '../types';

export const ColorwayModal: React.FC = () => {
  const { isColorwayModalOpen, closeColorwayModal, colorwaysList, selectedColorway, selectColorway } = useAtelier();

  if (!isColorwayModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeColorwayModal}>
      <div className="modal-panel colorways-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Natural Botanical Pigments</span>
            <h3>12 Handpicked Mediterranean Dye Lots</h3>
          </div>
          <button className="modal-close" onClick={closeColorwayModal} aria-label="Close colorways modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="modal-intro">
          Each Sera.ji hue is extracted using traditional zero-chemical botanical infusions, mineral salts, and pure
          Alpine spring wash, where every piece is handpicked with living tones that evolve with graceful patina.
        </p>

        <div className="colorways-layout">
          {/* Swatches Grid */}
          <div className="swatches-grid">
            {colorwaysList.map((swatch: ColorwaySwatch) => {
              const isSelected = selectedColorway?.id === swatch.id;
              return (
                <div
                  key={swatch.id}
                  className={`swatch-tile ${isSelected ? 'active' : ''}`}
                  onClick={() => selectColorway(swatch)}
                >
                  <div className="swatch-circle" style={{ backgroundColor: swatch.hex }}>
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <div className="swatch-meta">
                    <strong>{swatch.name}</strong>
                    <span>{swatch.shade}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Swatch Detail Panel */}
          {selectedColorway && (
            <div className="swatch-detail-card">
              <div
                className="swatch-banner"
                style={{
                  background: `linear-gradient(135deg, ${selectedColorway.hex} 0%, ${selectedColorway.accentHex} 100%)`,
                }}
              >
                <span className="banner-title">{selectedColorway.name}</span>
                <span className="banner-hex">{selectedColorway.hex}</span>
              </div>

              <div className="swatch-specs">
                <div className="spec-row">
                  <small>BOTANICAL DYE PROVENANCE</small>
                  <strong>{selectedColorway.origin}</strong>
                </div>

                <div className="spec-row">
                  <small>RECOMMENDED WEAVE PAIRING</small>
                  <strong>{selectedColorway.fabric}</strong>
                </div>

                <div className="spec-row">
                  <small>ARTISANAL CHARACTER</small>
                  <p>{selectedColorway.description}</p>
                </div>
              </div>

              <button className="btn-dark full-width" onClick={closeColorwayModal}>
                Apply Dye Lot to Silhouette ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
