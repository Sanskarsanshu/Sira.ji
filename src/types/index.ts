export interface NewsletterSubscription {
  email: string;
  timestamp: string;
  source?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

export interface AtelierMessage {
  id: string;
  sender: 'client' | 'atelier';
  text: string;
  category?: 'request' | 'recommendation' | 'specification';
  timestamp?: string;
}

export interface CapsulePiece {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  status: 'rendered' | 'weaving' | 'ready';
  tag: string;
  price?: string;
  details?: string[];
  fabricSpecs?: {
    momme?: number;
    weave?: string;
    origin?: string;
    composition?: string;
  };
}

export interface AtelierConfig {
  garmentName: string;
  fabric: string;
  exposure: string;
  arrangement: string;
  drapePrecision: number;
  progressPercent: number;
}

export interface SalonLocation {
  id: string;
  city: string;
  address: string;
  district: string;
  phone: string;
  image?: string;
}

export interface SalonBooking {
  id?: string;
  experience: 'runway-fitting' | 'private-consultation' | 'digital-drape';
  salonId: string;
  salonName: string;
  date: string;
  timeSlot: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  garmentInterest: string;
  notes?: string;
  confirmationCode?: string;
}

export interface ColorwaySwatch {
  id: string;
  name: string;
  shade: string;
  hex: string;
  accentHex: string;
  fabric: string;
  origin: string;
  description: string;
  previewImage?: string;
}

export interface EditorialReview {
  id: string;
  publication: string;
  quote: string;
  author: string;
  issue: string;
  rating?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'craft' | 'tailoring' | 'salons' | 'provenance';
}

export interface LocaleConfig {
  code: string;
  label: string;
  language: string;
  currency: string;
  symbol: string;
  flag: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'gold';
  duration?: number;
}
