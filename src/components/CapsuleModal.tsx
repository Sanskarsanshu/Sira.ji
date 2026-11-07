import React from 'react';
import { useAtelier } from '../context/AtelierContext';

export const CapsuleModal: React.FC = () => {
  const { selectedCapsulePiece, closeCapsuleModal, toggleCuratePiece, isPieceCurated, openBooking } = useAtelier();

  if (!selectedCapsulePiece) return null;

  const isSaved = isPieceCurated(selectedCapsulePiece.id);

  const handleBookFitting = () => {
    closeCapsuleModal();
    openBooking('runway-fitting');
  };

  return (
    <div className="modal-backdrop" onClick={closeCapsuleModal}>
      <div className="modal-panel capsule-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeCapsuleModal} aria-label="Close capsule piece modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="capsule-grid">
          {/* Image & Tag */}
          <div className="capsule-visual">
            <img src={selectedCapsulePiece.image} alt={selectedCapsulePiece.title} />
            <div className="capsule-badge">{selectedCapsulePiece.tag}</div>
            <div className="capsule-status">
              <span className="dot" />
              <span>Status: {selectedCapsulePiece.status === 'ready' ? 'Atelier Finished' : 'Currently On Loom'}</span>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="capsule-info">
            <span className="eyebrow">Sera.ji Handpicked Capsule</span>
            <h2>{selectedCapsulePiece.title}</h2>
            <p className="subtitle">{selectedCapsulePiece.subtitle}</p>

            {selectedCapsulePiece.price && (
              <div className="price-tag">
                <small>Bespoke Commission from</small>
                <strong>{selectedCapsulePiece.price}</strong>
              </div>
            )}

            {/* Fabric specs card */}
            {selectedCapsulePiece.fabricSpecs && (
              <div className="specs-card">
                <h5>Tactile Provenance &amp; Density</h5>
                <div className="specs-grid">
                  <div>
                    <small>MOMME WEIGHT</small>
                    <span>{selectedCapsulePiece.fabricSpecs.momme || 22} Momme Density</span>
                  </div>
                  <div>
                    <small>WEAVE STRUCTURE</small>
                    <span>{selectedCapsulePiece.fabricSpecs.weave || 'Crepe de Chine'}</span>
                  </div>
                  <div>
                    <small>HERITAGE MILL</small>
                    <span>{selectedCapsulePiece.fabricSpecs.origin || 'Lake Como, Italy'}</span>
                  </div>
                  <div>
                    <small>COMPOSITION</small>
                    <span>{selectedCapsulePiece.fabricSpecs.composition || '100% Organic Silk'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tailoring details checklist */}
            {selectedCapsulePiece.details && (
              <div className="details-list">
                <h5>Atelier Execution Milestones</h5>
                <ul>
                  {selectedCapsulePiece.details.map((item, idx) => (
                    <li key={idx}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e9a77d" strokeWidth="2.4">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="capsule-actions">
              <button
                className={`btn-curate ${isSaved ? 'saved' : ''}`}
                onClick={() => toggleCuratePiece(selectedCapsulePiece)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>{isSaved ? 'Curated in Trunk Show ✓' : 'Add to Private Trunk Show'}</span>
              </button>

              <button className="btn-dark" onClick={handleBookFitting}>
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
