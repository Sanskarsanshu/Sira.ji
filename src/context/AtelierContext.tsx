import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CapsulePiece, ColorwaySwatch, LocaleConfig, ToastMessage } from '../types';
import { api } from '../services/api';

export const LOCALES: LocaleConfig[] = [
  { code: 'en-GB', label: 'ENG', language: 'English', currency: 'GBP', symbol: '£', flag: '🇬🇧' },
  { code: 'en-US', label: 'USD', language: 'English', currency: 'USD', symbol: '$', flag: '🇺🇸' },
  { code: 'fr-FR', label: 'FRA', language: 'Français', currency: 'EUR', symbol: '€', flag: '🇫🇷' },
  { code: 'it-IT', label: 'ITA', language: 'Italiano', currency: 'EUR', symbol: '€', flag: '🇮🇹' },
  { code: 'ja-JP', label: 'JPN', language: '日本語', currency: 'JPY', symbol: '¥', flag: '🇯🇵' },
];

interface AtelierContextType {
  // Booking modal
  isBookingOpen: boolean;
  bookingExperience?: string;
  openBooking: (exp?: string) => void;
  closeBooking: () => void;

  // Capsule lookbook modal
  selectedCapsulePiece: CapsulePiece | null;
  openCapsuleModal: (piece: CapsulePiece) => void;
  closeCapsuleModal: () => void;

  // Colorways modal
  isColorwayModalOpen: boolean;
  selectedColorway: ColorwaySwatch | null;
  colorwaysList: ColorwaySwatch[];
  openColorwayModal: () => void;
  closeColorwayModal: () => void;
  selectColorway: (swatch: ColorwaySwatch) => void;

  // Provenance & Sustainability modal
  isProvenanceOpen: boolean;
  openProvenanceModal: () => void;
  closeProvenanceModal: () => void;

  // Trunk Show Curation drawer
  curatedPieces: CapsulePiece[];
  toggleCuratePiece: (piece: CapsulePiece) => void;
  isPieceCurated: (id: string) => boolean;
  isCurationDrawerOpen: boolean;
  openCurationDrawer: () => void;
  closeCurationDrawer: () => void;

  // Locale & Currency
  currentLocale: LocaleConfig;
  setLocale: (loc: LocaleConfig) => void;

  // Toast feedback
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'gold') => void;
  removeToast: (id: string) => void;

  // Cart state
  cartCount: number;
  addToCart: (qty?: number) => void;

  // Dynamic Atelier Config state
  activeSilhouette: string;
  setActiveSilhouette: (val: string) => void;
  activeDrapeScore: number;
  setActiveDrapeScore: (val: number) => void;
}

const AtelierContext = createContext<AtelierContextType | undefined>(undefined);

export const AtelierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Booking modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingExperience, setBookingExperience] = useState<string | undefined>(undefined);

  // Capsule Modal
  const [selectedCapsulePiece, setSelectedCapsulePiece] = useState<CapsulePiece | null>(null);

  // Colorways
  const [isColorwayModalOpen, setIsColorwayModalOpen] = useState(false);
  const [colorwaysList, setColorwaysList] = useState<ColorwaySwatch[]>([]);
  const [selectedColorway, setSelectedColorway] = useState<ColorwaySwatch | null>(null);

  // Provenance
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);

  // Trunk Show Curations (saved pieces)
  const [curatedPieces, setCuratedPieces] = useState<CapsulePiece[]>(() => {
    try {
      const saved = localStorage.getItem('seraji_curated_pieces');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCurationDrawerOpen, setIsCurationDrawerOpen] = useState(false);

  // Locales
  const [currentLocale, setCurrentLocale] = useState<LocaleConfig>(LOCALES[0]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Cart
  const [cartCount, setCartCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('seraji_cart_count');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const addToCart = (qty = 1) => {
    setCartCount((prev) => {
      const next = prev + qty;
      try {
        localStorage.setItem('seraji_cart_count', String(next));
      } catch {}
      return next;
    });
  };

  // Studio customizer state
  const [activeSilhouette, setActiveSilhouette] = useState('Sera.ji Riviera Silhouette');
  const [activeDrapeScore, setActiveDrapeScore] = useState(94);

  // Load colorways on mount
  useEffect(() => {
    api.getColorways().then((res) => {
      if (res.success && res.data) {
        setColorwaysList(res.data);
        if (res.data.length > 0 && !selectedColorway) {
          setSelectedColorway(res.data[0]);
        }
      }
    });
  }, []);

  // Save curated pieces to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('seraji_curated_pieces', JSON.stringify(curatedPieces));
    } catch (e) {
      console.warn('Unable to persist curation', e);
    }
  }, [curatedPieces]);

  // Lock body scroll when modals are open
  useEffect(() => {
    const isAnyModalOpen = isBookingOpen || !!selectedCapsulePiece || isColorwayModalOpen || isProvenanceOpen || isCurationDrawerOpen;
    if (isAnyModalOpen) {
      document.body.classList.add('modal-active');
    } else {
      document.body.classList.remove('modal-active');
    }
  }, [isBookingOpen, selectedCapsulePiece, isColorwayModalOpen, isProvenanceOpen, isCurationDrawerOpen]);

  const openBooking = (exp?: string) => {
    setBookingExperience(exp);
    setIsBookingOpen(true);
    api.trackEvent('open_booking_modal', { experience: exp });
  };

  const closeBooking = () => setIsBookingOpen(false);

  const openCapsuleModal = (piece: CapsulePiece) => {
    setSelectedCapsulePiece(piece);
    api.trackEvent('open_capsule_piece', { pieceId: piece.id });
  };

  const closeCapsuleModal = () => setSelectedCapsulePiece(null);

  const openColorwayModal = () => {
    setIsColorwayModalOpen(true);
    api.trackEvent('open_colorway_modal');
  };

  const closeColorwayModal = () => setIsColorwayModalOpen(false);

  const selectColorway = (swatch: ColorwaySwatch) => {
    setSelectedColorway(swatch);
    showToast(`Palette switched to ${swatch.name}`, 'gold');
    api.trackEvent('select_colorway', { colorwayId: swatch.id });
  };

  const openProvenanceModal = () => {
    setIsProvenanceOpen(true);
    api.trackEvent('open_provenance_modal');
  };

  const closeProvenanceModal = () => setIsProvenanceOpen(false);

  const toggleCuratePiece = (piece: CapsulePiece) => {
    const exists = curatedPieces.some((p) => p.id === piece.id);
    if (exists) {
      setCuratedPieces((prev) => prev.filter((p) => p.id !== piece.id));
      showToast(`Removed "${piece.title}" from your private curation`, 'info');
    } else {
      setCuratedPieces((prev) => [...prev, piece]);
      showToast(`Added "${piece.title}" to your private trunk show curation`, 'gold');
    }
  };

  const isPieceCurated = (id: string) => curatedPieces.some((p) => p.id === id);

  const openCurationDrawer = () => setIsCurationDrawerOpen(true);
  const closeCurationDrawer = () => setIsCurationDrawerOpen(false);

  const showToast = (message: string, type: 'success' | 'info' | 'gold' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, message, type, duration: 4000 };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AtelierContext.Provider
      value={{
        isBookingOpen,
        bookingExperience,
        openBooking,
        closeBooking,
        selectedCapsulePiece,
        openCapsuleModal,
        closeCapsuleModal,
        isColorwayModalOpen,
        selectedColorway,
        colorwaysList,
        openColorwayModal,
        closeColorwayModal,
        selectColorway,
        isProvenanceOpen,
        openProvenanceModal,
        closeProvenanceModal,
        curatedPieces,
        toggleCuratePiece,
        isPieceCurated,
        isCurationDrawerOpen,
        openCurationDrawer,
        closeCurationDrawer,
        currentLocale,
        setLocale: setCurrentLocale,
        toasts,
        showToast,
        removeToast,
        cartCount,
        addToCart,
        activeSilhouette,
        setActiveSilhouette,
        activeDrapeScore,
        setActiveDrapeScore,
      }}
    >
      {children}
    </AtelierContext.Provider>
  );
};

export const useAtelier = (): AtelierContextType => {
  const context = useContext(AtelierContext);
  if (!context) {
    throw new Error('useAtelier must be used within an AtelierProvider');
  }
  return context;
};
