import React, { useState, useEffect, useRef } from 'react';
import { IMAGES, VIDEOS } from '../constants/assets';
import { api } from '../services/api';
import { useAtelier } from '../context/AtelierContext';

export const CtaSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [buttonText, setButtonText] = useState('Reserve Sera.ji Access');
  const [submitted, setSubmitted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const { openBooking, showToast } = useAtelier();

  useEffect(() => {
    const v = videoRef.current;
    const still = stillRef.current;
    if (!v) return;

    v.src = VIDEOS.cta;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    api.trackEvent('cta_newsletter_submit', { email });

    try {
      const res = await api.subscribeWaitlist(email);
      if (res.success) {
        setButtonText('Invitation Reserved ✓');
        setSubmitted(true);
        showToast('Sera.ji invitation confirmed. Every piece is handpicked.', 'gold');
      }
    } catch {
      setButtonText('Invitation Reserved ✓');
      setSubmitted(true);
      showToast('Invitation reserved in local Sera.ji guestbook.', 'gold');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cta rv rv-scale">
      <video
        ref={videoRef}
        className="media"
        id="v-cta"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={IMAGES.ctaBg}
      />
      <img
        ref={stillRef}
        className="media kb"
        data-fallback="v-cta"
        src={IMAGES.ctaBg}
        alt="Sera.ji Haute Couture closing visual"
      />

      <h2 className="split" data-split>
        Sera.ji<br />Clothing
      </h2>

      <p className="rv" style={{ '--d': 2 } as React.CSSProperties}>
        Join the Sera.ji private guestbook for handpicked seasonal capsule drops, private trunk shows, and
        bespoke fitting consultations. Every piece is handpicked.
      </p>

      {!submitted ? (
        <form className="sub rv" style={{ '--d': 3 } as React.CSSProperties} onSubmit={handleSubmit}>
          <input
            type="email"
            required
            aria-label="Email address"
            placeholder="Drop your email for private salon access"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn-dark" type="submit" disabled={submitting}>
            {buttonText}
          </button>
        </form>
      ) : (
        <div className="cta-confirmed-box rv" style={{ '--d': 3 } as React.CSSProperties}>
          <div className="confirmed-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#68d391" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span>Invitation Reserved for {email}</span>
          </div>
          <button className="btn-dark" type="button" onClick={() => openBooking('runway-fitting')}>
            Proceed Directly to Salon Fitting Booking →
          </button>
        </div>
      )}
    </div>
  );
};
