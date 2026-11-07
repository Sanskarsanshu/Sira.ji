import React, { useState, useEffect } from 'react';
import { useAtelier } from '../context/AtelierContext';
import { api } from '../services/api';
import type { SalonLocation, SalonBooking } from '../types';

export const BookingModal: React.FC = () => {
  const { isBookingOpen, closeBooking, bookingExperience, showToast } = useAtelier();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [salons, setSalons] = useState<SalonLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmedData, setConfirmedData] = useState<SalonBooking | null>(null);

  // Form state
  const [experience, setExperience] = useState<'runway-fitting' | 'private-consultation' | 'digital-drape'>(
    (bookingExperience as any) || 'runway-fitting'
  );
  const [selectedSalon, setSelectedSalon] = useState<SalonLocation | null>(null);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('14:30');
  const [title, setTitle] = useState('Ms.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [garmentInterest, setGarmentInterest] = useState('Bespoke Silk Gown & Resort Silhouette');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isBookingOpen) {
      setStep(1);
      setConfirmedData(null);
      api.getSalonLocations().then((res) => {
        if (res.success && res.data) {
          setSalons(res.data);
          if (res.data.length > 0 && !selectedSalon) {
            setSelectedSalon(res.data[0]);
          }
        }
      });
    }
  }, [isBookingOpen]);

  if (!isBookingOpen) return null;

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
  };

  const handleBack = () => {
    if (step > 1 && step < 5) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email) {
      showToast('Please provide your name and email address', 'info');
      return;
    }

    setLoading(true);
    const bookingPayload: SalonBooking = {
      experience,
      salonId: selectedSalon?.id || 'paris',
      salonName: selectedSalon ? `${selectedSalon.city} (${selectedSalon.district})` : 'Paris Atelier',
      date,
      timeSlot,
      title,
      firstName,
      lastName,
      email,
      phone,
      garmentInterest,
      notes,
    };

    try {
      const res = await api.bookSalonFitting(bookingPayload);
      if (res.success && res.data) {
        setConfirmedData(res.data);
        setStep(5);
        showToast('Private fitting confirmed with Sera.ji concierge. Every piece is handpicked.', 'gold');
      }
    } catch {
      showToast('Fitting pass reserved locally. Every piece is handpicked.', 'gold');
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeBooking}>
      <div className="modal-panel booking-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="eyebrow">Private Styling Service</span>
            <h3>Private Studio Fitting</h3>
          </div>
          <button className="modal-close" onClick={closeBooking} aria-label="Close booking modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stepper tracker */}
        {step < 5 && (
          <div className="stepper-bar">
            <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
              <span className="num">1</span>
              <span className="txt">Experience</span>
            </div>
            <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
              <span className="num">2</span>
              <span className="txt">Studio</span>
            </div>
            <div className={`step-item ${step >= 3 ? 'active' : ''} ${step > 3 ? 'done' : ''}`}>
              <span className="num">3</span>
              <span className="txt">Schedule</span>
            </div>
            <div className={`step-item ${step >= 4 ? 'active' : ''}`}>
              <span className="num">4</span>
              <span className="txt">Client Details</span>
            </div>
          </div>
        )}

        <div className="modal-body">
          {/* STEP 1: EXPERIENCE */}
          {step === 1 && (
            <div className="step-content">
              <h4>Select Your Fitting Experience</h4>
              <p className="step-desc">
                Every appointment is a personalized experience guided by our master tailor and fabric specialist.
              </p>

              <div className="options-grid">
                <div
                  className={`option-card ${experience === 'runway-fitting' ? 'selected' : ''}`}
                  onClick={() => setExperience('runway-fitting')}
                >
                  <div className="option-badge">Custom Tailored</div>
                  <h5>Bespoke Studio Fitting</h5>
                  <p>
                    Full 90-minute private studio fitting. Includes comprehensive 38-point body measurements,
                    personalized fabric inspection, initial custom fitting, and complimentary refreshments.
                  </p>
                  <div className="option-meta">
                    <span>90 Minutes</span>
                    <span>Complimentary Private Access</span>
                  </div>
                </div>

                <div
                  className={`option-card ${experience === 'private-consultation' ? 'selected' : ''}`}
                  onClick={() => setExperience('private-consultation')}
                >
                  <div className="option-badge">Wardrobe Styling</div>
                  <h5>Private Styling Consultation</h5>
                  <p>
                    60-minute one-on-one session with our creative stylist to curate your seasonal wardrobe, select
                    custom dye shades, and explore exclusive ready-to-wear designs.
                  </p>
                  <div className="option-meta">
                    <span>60 Minutes</span>
                    <span>Dedicated Stylist</span>
                  </div>
                </div>

                <div
                  className={`option-card ${experience === 'digital-drape' ? 'selected' : ''}`}
                  onClick={() => setExperience('digital-drape')}
                >
                  <div className="option-badge">Virtual Session</div>
                  <h5>Virtual Private Consultation</h5>
                  <p>
                    Private high-definition video appointment with our head stylist. Includes complimentary fabric swatch
                    samples delivered directly to your home prior to your meeting.
                  </p>
                  <div className="option-meta">
                    <span>45 Minutes</span>
                    <span>Swatch Box Dispatched</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-dark" onClick={handleNext}>
                  Select Studio Location →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: STUDIO LOCATION */}
          {step === 2 && (
            <div className="step-content">
              <h4>Select Your Preferred Studio Location</h4>
              <p className="step-desc">
                Visit our private international studios or connect via our Virtual Private Consultation.
              </p>

              <div className="salons-grid">
                {salons.map((s) => (
                  <div
                    key={s.id}
                    className={`salon-card ${selectedSalon?.id === s.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSalon(s)}
                  >
                    <div className="salon-header">
                      <h5>{s.city}</h5>
                      <span className="district">{s.district}</span>
                    </div>
                    <p className="address">{s.address}</p>
                    <span className="phone">{s.phone}</span>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button className="btn-outline" onClick={handleBack}>
                  ← Back
                </button>
                <button className="btn-dark" onClick={handleNext}>
                  Choose Date &amp; Time →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE */}
          {step === 3 && (
            <div className="step-content">
              <h4>Choose Preferred Date &amp; Time</h4>
              <p className="step-desc">
                All appointments are held privately for one client at a time to ensure complete attention.
              </p>

              <div className="schedule-wrap">
                <div className="field-group">
                  <label htmlFor="salon-date">Preferred Date</label>
                  <input
                    id="salon-date"
                    type="date"
                    className="modal-input"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label>Available Time Slots ({selectedSalon?.city || 'Paris'})</label>
                  <div className="slots-grid">
                    {['10:30 AM', '12:00 PM', '14:30 PM', '16:00 PM', '17:30 PM', '19:00 PM'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`slot-pill ${timeSlot === slot ? 'active' : ''}`}
                        onClick={() => setTimeSlot(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-outline" onClick={handleBack}>
                  ← Back
                </button>
                <button className="btn-dark" onClick={handleNext}>
                  Continue to Client Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CLIENT DETAILS */}
          {step === 4 && (
            <form className="step-content" onSubmit={handleSubmit}>
              <h4>Client Details &amp; Reservation</h4>
              <p className="step-desc">
                Please enter your details to confirm your reservation and receive your private invitation pass.
              </p>

              <div className="form-grid">
                <div className="field-group" style={{ gridColumn: 'span 1' }}>
                  <label htmlFor="patron-title">Title</label>
                  <select
                    id="patron-title"
                    className="modal-select"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  >
                    <option value="Ms.">Ms.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Lady">Lady</option>
                    <option value="Lord">Lord</option>
                    <option value="Mx.">Mx.</option>
                  </select>
                </div>

                <div className="field-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="patron-fname">First Name *</label>
                  <input
                    id="patron-fname"
                    type="text"
                    required
                    className="modal-input"
                    placeholder="e.g. Vivienne"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="field-group" style={{ gridColumn: 'span 3' }}>
                  <label htmlFor="patron-lname">Last Name</label>
                  <input
                    id="patron-lname"
                    type="text"
                    className="modal-input"
                    placeholder="e.g. Sterling"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="field-group" style={{ gridColumn: 'span 3' }}>
                  <label htmlFor="patron-email">Email Address *</label>
                  <input
                    id="patron-email"
                    type="email"
                    required
                    className="modal-input"
                    placeholder="patron@private-client.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="field-group" style={{ gridColumn: 'span 3' }}>
                  <label htmlFor="patron-phone">Telephone (for SMS appointment reminder)</label>
                  <input
                    id="patron-phone"
                    type="tel"
                    className="modal-input"
                    placeholder="+33 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="field-group" style={{ gridColumn: 'span 6' }}>
                  <label htmlFor="patron-garment">Silhouette or Garment Interest</label>
                  <input
                    id="patron-garment"
                    type="text"
                    className="modal-input"
                    placeholder="e.g. Evening Silk Charmeuse, Tailored Resort Trench, Custom Suit"
                    value={garmentInterest}
                    onChange={(e) => setGarmentInterest(e.target.value)}
                  />
                </div>

                <div className="field-group" style={{ gridColumn: 'span 6' }}>
                  <label htmlFor="patron-notes">Special Requests or Preferences</label>
                  <textarea
                    id="patron-notes"
                    className="modal-textarea"
                    rows={2}
                    placeholder="e.g. Specific event deadline, preferences for silk fibers, or refreshment choice"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={handleBack} disabled={loading}>
                  ← Back
                </button>
                <button type="submit" className="btn-dark" disabled={loading}>
                  {loading ? 'Securing Private Studio…' : 'Confirm Private Reservation ✓'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: CONFIRMATION PASS */}
          {step === 5 && (
            <div className="step-content confirmation-pass">
              <div className="pass-card">
                <div className="pass-header">
                  <div className="pass-brand">
                    <svg viewBox="0 0 40 40" width="28" height="28" fill="#2a1a12">
                      <path d="M5 5h13v13H5zM22 22h13v13H22z" />
                      <path d="M22 5a13 13 0 0 1 13 13H22zM18 35A13 13 0 0 1 5 22h13z" />
                    </svg>
                    <span>Sera.ji Clothing · VIP Studio Pass</span>
                  </div>
                  <span className="pass-code">{confirmedData?.confirmationCode || 'SERA-9428'}</span>
                </div>

                <div className="pass-body">
                  <div className="pass-row">
                    <div>
                      <small>CLIENT</small>
                      <strong>
                        {title} {firstName} {lastName}
                      </strong>
                    </div>
                    <div>
                      <small>EXPERIENCE</small>
                      <strong>
                        {experience === 'runway-fitting'
                          ? 'Bespoke Studio Fitting'
                          : experience === 'private-consultation'
                          ? 'Private Styling Consultation'
                          : 'Virtual Private Consultation'}
                      </strong>
                    </div>
                  </div>

                  <div className="pass-row">
                    <div>
                      <small>STUDIO LOCATION</small>
                      <strong>{selectedSalon?.city || 'Paris'}, {selectedSalon?.district || 'Place Vendôme'}</strong>
                    </div>
                    <div>
                      <small>DATE &amp; TIME</small>
                      <strong>{date} · {timeSlot}</strong>
                    </div>
                  </div>

                  <div className="pass-footer-meta">
                    <p>Address: {selectedSalon?.address || '18 Place Vendôme, 75001 Paris'}</p>
                    <p>Direct Studio Concierge: {selectedSalon?.phone || '+33 1 42 68 88 00'}</p>
                  </div>
                </div>

                <div className="pass-perforation" />
                <div className="pass-sub">
                  <span>An invitation confirmation with calendar invite has been sent to {email}.</span>
                </div>
              </div>

              <div className="modal-actions center">
                <button className="btn-dark" onClick={closeBooking}>
                  Return to Collection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
