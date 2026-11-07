import React from 'react';
import { RunwayLookbook } from './RunwayLookbook';

export const Hero: React.FC = () => {
  return (
    <section className="hero" id="product">
      <div className="wrap">
        <div className="hero-head">
          <h1 className="h-display split" data-split style={{ '--base': '150ms' } as React.CSSProperties}>
            Handpicked Luxury,<br />By Sera.ji
          </h1>
          <p className="hero-sub rv" style={{ '--base': '700ms' } as React.CSSProperties}>
            Every piece is handpicked into enduring wardrobe statements.
          </p>
        </div>

        <div className="hero-card rv rv-scale runway-hero-wrapper" style={{ '--base': '850ms' } as React.CSSProperties}>
          <RunwayLookbook />
        </div>
      </div>
    </section>
  );
};
