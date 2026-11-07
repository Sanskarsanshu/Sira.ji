import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { EditorialReview } from '../types';

export const EditorialSection: React.FC = () => {
  const [reviews, setReviews] = useState<EditorialReview[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    api.getEditorialReviews().then((res) => {
      if (res.success && res.data) {
        setReviews(res.data);
      }
    });
  }, []);

  const currentReview = reviews[activeIdx] || reviews[0];

  return (
    <section className="s-editorial" id="acclaim">
      <div className="wrap">
        <div className="editorial-shell">
          <div className="sec-head">
            <span className="eyebrow rv">Sera.ji Global Acclaim</span>
            <h2 className="h2 split" data-split>
              Celebrated Across<br />
              <span className="lt">Sera.ji Private Studios</span>
            </h2>
            <p className="lead rv" style={{ '--d': 3 } as React.CSSProperties}>
              From Paris Fashion Week to private international exhibitions, Sera.ji is celebrated for uniting
              centuries of Italian weaving heritage with timeless architectural restraint.
            </p>
          </div>

          {/* Testimonial Spotlight */}
          {currentReview && (
            <div className="quote-spotlight rv" style={{ '--d': 2 } as React.CSSProperties}>
              <div className="quote-badge">
                <span>{currentReview.publication}</span>
                <span className="stars">★★★★★</span>
              </div>
              <blockquote className="quote-text">“{currentReview.quote}”</blockquote>
              <div className="quote-byline">
                <strong>{currentReview.author}</strong>
                <span>{currentReview.issue}</span>
              </div>

              {/* Indicator dots */}
              <div className="quote-nav">
                {reviews.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`quote-dot ${i === activeIdx ? 'active' : ''}`}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`View review from ${r.publication}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stat metrics ribbon */}
          <div className="editorial-stats rv" style={{ '--d': 4 } as React.CSSProperties}>
            <div className="stat-col">
              <span className="stat-num">
                <span data-count="100">0</span>%
              </span>
              <span className="stat-label">Handpicked Como Silk</span>
              <p>Grade-6A organically cultivated white mulberry</p>
            </div>
            <div className="stat-col">
              <span className="stat-num">
                <span data-count="38">0</span>
              </span>
              <span className="stat-label">Precision Fit Points</span>
              <p>Precision hand-tailored custom fitting</p>
            </div>
            <div className="stat-col">
              <span className="stat-num">
                <span>4.98</span>
              </span>
              <span className="stat-label">Client Fit Satisfaction</span>
              <p>Across 2,400+ handpicked custom garments</p>
            </div>
            <div className="stat-col">
              <span className="stat-num">
                <span data-count="18">0</span>
              </span>
              <span className="stat-label">Sera.ji Private Studios</span>
              <p>Permanent locations and exclusive seasonal showrooms</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
