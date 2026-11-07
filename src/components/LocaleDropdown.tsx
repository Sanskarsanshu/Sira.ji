import React, { useState, useRef, useEffect } from 'react';
import { useAtelier, LOCALES } from '../context/AtelierContext';
import type { LocaleConfig } from '../types';

export const LocaleDropdown: React.FC = () => {
  const { currentLocale, setLocale, showToast } = useAtelier();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocaleConfig) => {
    setLocale(loc);
    setIsOpen(false);
    showToast(`Atelier region switched to ${loc.language} (${loc.currency} ${loc.symbol})`, 'gold');
  };

  return (
    <div className="locale-dropdown-wrapper" ref={dropdownRef}>
      <button
        className="lang"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select locale and currency"
      >
        <span>{currentLocale.label}</span>
        <span className="locale-flag" role="img" aria-label={currentLocale.language}>
          {currentLocale.flag}
        </span>
        <svg
          width="9"
          height="6"
          viewBox="0 0 9 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M1 1l3.5 3.5L8 1" />
        </svg>
      </button>

      {isOpen && (
        <div className="locale-popover">
          <div className="popover-title">Atelier Region &amp; Currency</div>
          <div className="popover-list">
            {LOCALES.map((loc) => (
              <button
                key={loc.code}
                type="button"
                className={`locale-option ${currentLocale.code === loc.code ? 'selected' : ''}`}
                onClick={() => handleSelect(loc)}
              >
                <span className="loc-flag">{loc.flag}</span>
                <span className="loc-name">{loc.language}</span>
                <span className="loc-curr">
                  {loc.currency} ({loc.symbol})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
