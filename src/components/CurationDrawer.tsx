import React from 'react';
import { useAtelier } from '../context/AtelierContext';
import type { CapsulePiece } from '../types';

export const CurationDrawer: React.FC = () => {
  const {
    isCurationDrawerOpen,
    closeCurationDrawer,
    curatedPieces,
    toggleCuratePiece,
    openCapsuleModal,
    openBooking,
  } = useAtelier();

  if (!isCurationDrawerOpen) return null;

  const handlePieceClick = (piece: CapsulePiece) => {
    closeCurationDrawer();
    openCapsuleModal(piece);
  };

  const handleBookCommission = () => {
    closeCurationDrawer();
    openBooking('runway-fitting');
  };

  return (
    <div className="drawer-backdrop" onClick={closeCurationDrawer}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="eyebrow">Personal Sera.ji Portfolio</span>
            <h4>Private Trunk Show Curation</h4>
          </div>
          <button className="drawer-close" onClick={closeCurationDrawer} aria-label="Close private curation drawer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          {curatedPieces.length === 0 ? (
            <div className="empty-curation">
              <div className="empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h5>Your Trunk Show is Empty</h5>
              <p>
                Explore our handpicked collection and click <em>“Add to Private Trunk Show”</em> on any capsule piece to
                assemble your personalized salon consultation. Every piece is handpicked.
              </p>
              <button className="btn-outline" onClick={closeCurationDrawer}>
                Explore Handpicked Collection
              </button>
            </div>
          ) : (
            <div className="curated-items-list">
              <p className="curation-count">
                <span>{curatedPieces.length} handpicked pieces saved for private salon review</span>
              </p>

              {curatedPieces.map((piece) => (
                <div key={piece.id} className="curated-item-card">
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="curated-img"
                    onClick={() => handlePieceClick(piece)}
                  />
                  <div className="curated-info" onClick={() => handlePieceClick(piece)}>
                    <span className="tag">{piece.tag}</span>
                    <h6>{piece.title}</h6>
                    <small>{piece.subtitle}</small>
                    {piece.price && <span className="price">{piece.price}</span>}
                  </div>
                  <button
                    className="curated-remove"
                    onClick={() => toggleCuratePiece(piece)}
                    aria-label={`Remove ${piece.title} from curation`}
                    title="Remove piece"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {curatedPieces.length > 0 && (
          <div className="drawer-footer">
            <div className="curation-summary">
              <span>Complimentary Salon Champagne &amp; Muslin Fitting Included</span>
            </div>
            <button className="btn-dark full-width" onClick={handleBookCommission}>
              Order Now ({curatedPieces.length} {curatedPieces.length === 1 ? 'Piece' : 'Pieces'}) →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
