import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAtelier } from '../context/AtelierContext';
import type { FaqItem } from '../types';

export const FaqSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'faq-1': true });
  const { openBooking } = useAtelier();

  useEffect(() => {
    api.getFaqs().then((res) => {
      if (res.success && res.data) {
        setFaqs(res.data);
      }
    });
  }, []);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs =
    activeCategory === 'all' ? faqs : faqs.filter((f) => f.category === activeCategory);

  return (
    <section className="s-faq" id="inquiries">
      <div className="wrap">
        <div className="faq-shell">
          <div className="sec-head">
            <span className="eyebrow rv">Sera.ji Dialogue &amp; Atelier Standards</span>
            <h2 className="h2 split" data-split>
              Craftsmanship &amp;<br />
              <span className="lt">Handpicked Inquiries</span>
            </h2>
            <p className="lead rv" style={{ '--d': 3 } as React.CSSProperties}>
              Transparent answers regarding Sera.ji clothing, our handpicked fabric sourcing, private fitting protocols, and bespoke
              production lead times.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="faq-tabs rv" style={{ '--d': 2 } as React.CSSProperties}>
            {[
              { id: 'all', label: 'All Inquiries' },
              { id: 'craft', label: 'Silk & Craft' },
              { id: 'tailoring', label: 'Bespoke Process' },
              { id: 'provenance', label: 'Provenance' },
              { id: 'salons', label: 'Sera.ji Salons' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab-pill ${activeCategory === tab.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Accordion list */}
          <div className="faq-list rv" style={{ '--d': 3 } as React.CSSProperties}>
            {filteredFaqs.map((faq) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div key={faq.id} className={`faq-card ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-question"
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        {isOpen ? <path d="M5 12h14" /> : <path d="M12 5v14M5 12h14" />}
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Concierge Card */}
          <div className="faq-concierge-card rv" style={{ '--d': 4 } as React.CSSProperties}>
            <div>
              <h5>Have a Specific Handpicked Commission in Mind?</h5>
              <p>Our Sera.ji Master Draper is available for direct private correspondence and video consultations.</p>
            </div>
            <button className="btn-dark" onClick={() => openBooking('private-consultation')}>
              Speak with Master Draper →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
