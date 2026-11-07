import React, { useEffect, useRef } from 'react';
import { ProductShelf, type Product } from '@/components/ui/skincare-product-shelf';
import back1Video from '../assets/Back - 1.mp4';
import { IMAGES } from '../constants/assets';
import { useAtelier } from '../context/AtelierContext';
import type { CapsulePiece } from '../types';

export const ProductionSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    cartCount,
    addToCart,
    currentLocale,
    showToast,
    openCurationDrawer,
    toggleCuratePiece,
    isPieceCurated,
  } = useAtelier();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  const buildShelfCapsulePiece = (product: Product, size: string, unitPrice: number): CapsulePiece => ({
    id: `shelf-${product.id}`,
    title: product.name,
    subtitle: `${size} · ${product.category}`,
    image: product.studioImage || IMAGES.product,
    status: 'ready',
    tag: 'Sera.ji Atelier Shelf',
    price: `${currentLocale.symbol}${unitPrice.toFixed(2)}`,
    details: product.benefits,
    fabricSpecs: {
      momme: 22,
      weave: product.category,
      origin: 'Milan & Lake Como, Italy',
      composition: product.ingredients.split(',').slice(0, 3).join(','),
    },
  });

  return (
    <section className="s-prod" id="pricing">
      <div className="wrap">
        <div className="prod-shell">
          <video
            ref={videoRef}
            className="prod-bg-video"
            src={back1Video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="prod-bg-scrim" aria-hidden="true" />

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

          <div id="atelier-shelf" className="mt-9 sm:mt-11">
            <ProductShelf
              embedded
              darkStage
              brandName="SERA.JI"
              currency={currentLocale.symbol}
              externalBagCount={cartCount}
              onBagClick={openCurationDrawer}
              isSaved={(product) => isPieceCurated(`shelf-${product.id}`)}
              onToggleSave={(product, size, unitPrice) => {
                const alreadySaved = isPieceCurated(`shelf-${product.id}`);
                toggleCuratePiece(buildShelfCapsulePiece(product, size, unitPrice));
                showToast(
                  alreadySaved
                    ? `Removed ${product.name} from Private Trunk Show`
                    : `Saved ${product.name} (${size}) to Private Trunk Show ♥`,
                  'gold',
                );
              }}
              onAddToBag={(product, qty, size, unitPrice) => {
                addToCart(qty);
                if (!isPieceCurated(`shelf-${product.id}`)) {
                  toggleCuratePiece(buildShelfCapsulePiece(product, size, unitPrice));
                }
                showToast(
                  `Added ${qty}× ${product.name} (${size} · ${currentLocale.symbol}${unitPrice.toFixed(2)}) to bag ✓`,
                  'gold',
                );
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
