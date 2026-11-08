import type {
  ApiResponse,
  NewsletterSubscription,
  CapsulePiece,
  SalonBooking,
  SalonLocation,
  ColorwaySwatch,
  EditorialReview,
  FaqItem,
} from '../types';
import { IMAGES } from '../constants/assets';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Sera.ji Clothing Brand API Service Layer
 * Luxury clothing house architecture where every piece is handpicked.
 */
export const api = {
  /**
   * Subscribe to VIP private capsule access & guestbook
   */
  async subscribeWaitlist(email: string): Promise<ApiResponse<NewsletterSubscription>> {
    const payload: NewsletterSubscription = {
      email,
      timestamp: new Date().toISOString(),
      source: 'landing_cta',
    };

    try {
      if (import.meta.env.VITE_USE_MOCK !== 'false') {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const existing = JSON.parse(localStorage.getItem('seraji_waitlist') || '[]');
        existing.push(payload);
        localStorage.setItem('seraji_waitlist', JSON.stringify(existing));

        return {
          success: true,
          data: payload,
          message: 'Sera.ji invitation reserved successfully. Every piece is handpicked.',
        };
      }

      const res = await fetch(`${API_BASE_URL}/v1/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: unknown) {
      console.warn('[Sera.ji API] Waitlist fallback:', err);
      return {
        success: true,
        data: payload,
        message: 'Saved to Sera.ji guestbook. We look forward to welcoming you.',
      };
    }
  },

  /**
   * Fetch featured capsule collection with handpicked clothing specs
   */
  async getFeaturedCapsule(): Promise<ApiResponse<CapsulePiece[]>> {
    const defaultPieces: CapsulePiece[] = [
      {
        id: 'cap-1',
        title: 'Lead Visual Silhouette',
        subtitle: 'Handpicked · Organic · 22 Momme Silk',
        image: IMAGES.hat,
        status: 'ready',
        tag: 'Sera.ji Handpicked Couture',
        price: '₹28,500',
        details: [
          'Every piece is handpicked Grade-6A Mulberry Silk',
          'Bias-cut architectural drape with self-faced hem',
          'Hand-embroidered Sera.ji numbered artisan hallmark tab',
          'Certified zero chemical treatment, botanical sun-bleached',
        ],
        fabricSpecs: {
          momme: 22,
          weave: 'Satin Faced Crepe de Chine',
          origin: 'Lake Como, Lombardy, Italy',
          composition: '100% Handpicked Organic Silk',
        },
      },
      {
        id: 'cap-2',
        title: 'Travertine Structure',
        subtitle: 'Handpicked Linen · Travertine Marble',
        image: IMAGES.product,
        status: 'weaving',
        tag: 'Sera.ji Artisan Clothing',
        price: '₹34,000',
        details: [
          '450 GSM Heavy Flemish Master Linen — Handpicked batch',
          'Sculpted peak lapel with hand-padded canvas chest',
          'Horn button closures sourced from ethical heritage craft',
          'Relaxed Mediterranean silhouette with structured shoulders',
        ],
        fabricSpecs: {
          momme: 28,
          weave: 'Artisanal Basketweave Flammé',
          origin: 'Courtrai, Flanders, Belgium',
          composition: '100% GOTS Handpicked Belgian Flax',
        },
      },
      {
        id: 'cap-3',
        title: 'Sunlit Riviera Slip',
        subtitle: 'Handpicked Bias Slip · Golden Hour Light',
        image: IMAGES.profile,
        status: 'ready',
        tag: 'Sera.ji Evening Silks',
        price: '₹22,000',
        details: [
          'Ultra-fine 19 Momme fluid silk charmeuse',
          'Seamless French interior clothing construction',
          'Delicate hand-rolled spaghetti shoulder straps',
          'Every piece is handpicked for effortless pooling movement',
        ],
        fabricSpecs: {
          momme: 19,
          weave: 'Fluid Charmeuse Silk',
          origin: 'Lyons & Como Atelier Weavers',
          composition: '100% Pure Mulberry Silk',
        },
      },
      {
        id: 'cap-4',
        title: 'Solstice Sculpted Trench',
        subtitle: 'Handpicked Silk-Linen Blend · Tuscan Dusk',
        image: IMAGES.sunface,
        status: 'ready',
        tag: 'Sera.ji Private Trunk Show',
        price: '₹41,000',
        details: [
          'Double-faced organic silk and long-staple cotton gabardine',
          'Natural beeswax ecological water-repellent finish',
          'Detachable handpicked silk satin lapel shield',
          'Individually numbered Sera.ji heirloom hallmark',
        ],
        fabricSpecs: {
          momme: 32,
          weave: 'Technical Couture Gabardine',
          origin: 'Biella, Piedmont, Italy',
          composition: '65% Organic Silk, 35% Sea Island Cotton',
        },
      },
    ];

    return {
      success: true,
      data: defaultPieces,
      message: 'Capsule collection retrieved',
    };
  },

  /**
   * Book a Private Salon & Runway Fitting Appointment with Sera.ji
   */
  async bookSalonFitting(booking: SalonBooking): Promise<ApiResponse<SalonBooking>> {
    const confirmationCode = `SERA-${Math.floor(1000 + Math.random() * 9000)}`;
    const confirmedBooking: SalonBooking = {
      ...booking,
      id: `bk-${Date.now()}`,
      confirmationCode,
    };

    try {
      if (import.meta.env.VITE_USE_MOCK !== 'false') {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const bookings = JSON.parse(localStorage.getItem('seraji_bookings') || '[]');
        bookings.push(confirmedBooking);
        localStorage.setItem('seraji_bookings', JSON.stringify(bookings));

        return {
          success: true,
          data: confirmedBooking,
          message: `Fitting confirmed at ${booking.salonName}. Confirmation pass ${confirmationCode}. Every piece is handpicked.`,
        };
      }

      const res = await fetch(`${API_BASE_URL}/v1/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return {
        success: true,
        data: confirmedBooking,
        message: `Appointment confirmed. VIP Sera.ji salon pass: ${confirmationCode}`,
      };
    }
  },

  /**
   * List international private salons for Sera.ji
   */
  async getSalonLocations(): Promise<ApiResponse<SalonLocation[]>> {
    const salons: SalonLocation[] = [
      {
        id: 'paris',
        city: 'Paris',
        district: 'Place Vendôme',
        address: '18 Place Vendôme, 75001 Paris',
        phone: '+33 1 42 68 88 00',
      },
      {
        id: 'milan',
        city: 'Milan',
        district: 'Quadrilatero della Moda',
        address: 'Via Montenapoleone 8, 20121 Milano',
        phone: '+39 02 7600 4421',
      },
      {
        id: 'london',
        city: 'London',
        district: 'Mayfair',
        address: '24 New Bond Street, London W1S 2RR',
        phone: '+44 20 7493 8920',
      },
      {
        id: 'newyork',
        city: 'New York',
        district: 'Upper East Side',
        address: '740 Madison Avenue, New York, NY 10065',
        phone: '+1 212 585 3200',
      },
      {
        id: 'tokyo',
        city: 'Tokyo',
        district: 'Ginza',
        address: '6-10-1 Ginza, Chuo-ku, Tokyo 104-0061',
        phone: '+81 3 6264 5500',
      },
      {
        id: 'virtual',
        city: 'Digital Haute Concierge',
        district: 'Global Private Salon',
        address: 'Private Encrypted High-Definition Video Salon',
        phone: '+33 1 42 68 88 05',
      },
    ];

    return {
      success: true,
      data: salons,
      message: 'Salons retrieved',
    };
  },

  /**
   * 12 Handpicked Mediterranean Colorways & Dye Lots
   */
  async getColorways(): Promise<ApiResponse<ColorwaySwatch[]>> {
    const swatches: ColorwaySwatch[] = [
      {
        id: 'travertine',
        name: 'Travertine Chalk',
        shade: 'Warm Mineral Ivory',
        hex: '#f4ede2',
        accentHex: '#d8c7b2',
        fabric: 'Handpicked 22mm Crepe de Chine',
        origin: 'Tuscan Calcite & Natural Spring Wash',
        description: 'Luminous chalk-white with tactile depth where every piece is handpicked.',
      },
      {
        id: 'sunlit-gold',
        name: 'Sunlit Riviera Gold',
        shade: 'Amber Ochre',
        hex: '#e2a969',
        accentHex: '#9c6630',
        fabric: 'Heavyweight Sandwashed Silk',
        origin: 'Provençal Saffron & French Marigold',
        description: 'Golden-hour glow imbued with rich Mediterranean sun reflection.',
      },
      {
        id: 'terracotta',
        name: 'Tuscan Terracotta',
        shade: 'Earthy Clay Red',
        hex: '#b85f40',
        accentHex: '#6d2e18',
        fabric: 'Flemish Flammé Linen',
        origin: 'Siena Iron Oxide Clay Extracts',
        description: 'Deep warm clay hue with artisanal textural striations.',
      },
      {
        id: 'como-indigo',
        name: 'Como Midnight Indigo',
        shade: 'Deep Lapis Blue',
        hex: '#1e2d42',
        accentHex: '#456488',
        fabric: 'Charmeuse Silk Sheen',
        origin: 'Lake Como Botanical Indigo Fermentation',
        description: 'Velvety nocturnal blue reflecting moonlit Alpine waters.',
      },
      {
        id: 'aegean-mist',
        name: 'Aegean Sea Mist',
        shade: 'Soft Serene Cerulean',
        hex: '#98b5ca',
        accentHex: '#527794',
        fabric: 'Fluid Silk Chiffon',
        origin: 'Cycladic Mineral Salts & Woad Root',
        description: 'Breezy, ethereal azure with an airy crystalline drape.',
      },
      {
        id: 'sardinian-sand',
        name: 'Sardinian Dune',
        shade: 'Subtle Warm Beige',
        hex: '#d6c5b0',
        accentHex: '#8b755a',
        fabric: 'Raw Silk & Flax Weave',
        origin: 'Costa Smeralda Unbleached Fibers',
        description: 'Pure tactile simplicity with natural raw slub character.',
      },
      {
        id: 'florentine-rose',
        name: 'Florentine Petal',
        shade: 'Muted Rose Dust',
        hex: '#d9a99e',
        accentHex: '#8c5044',
        fabric: 'Fine 19mm Habotai Silk',
        origin: 'Chianti Wild Madder & Rosewater',
        description: 'Understated powdery rose evocative of renaissance fresco pigments.',
      },
      {
        id: 'olive-grove',
        name: 'Cilento Olive Verde',
        shade: 'Muted Sage Green',
        hex: '#7e876a',
        accentHex: '#4b523b',
        fabric: 'Structured Silk Twill',
        origin: 'Campanian Wild Olive Leaves',
        description: 'Serene botanical foliage green imbued with quiet nobility.',
      },
      {
        id: 'basalt-noir',
        name: 'Etna Basalt Noir',
        shade: 'Rich Volcanic Black',
        hex: '#1c1816',
        accentHex: '#483f3a',
        fabric: 'Double-faced Heavy Silk Wool',
        origin: 'Sicilian Mineral Char & Oak Gallnut',
        description: 'Deep non-reflective matte obsidian with exquisite gravity.',
      },
      {
        id: 'capri-citron',
        name: 'Anacapri Citron',
        shade: 'Pale Sunburst Yellow',
        hex: '#ecd58b',
        accentHex: '#997f2c',
        fabric: 'Crisp Silk Organza',
        origin: 'Amalfi Lemon Rind Bio-Infusion',
        description: 'Effervescent sunny zest balancing crispness and light diffusion.',
      },
      {
        id: 'amalfi-slate',
        name: 'Amalfi Slate',
        shade: 'Pebble Neutral Grey',
        hex: '#a8a29a',
        accentHex: '#605a52',
        fabric: 'Washed Sea-Island Cotton Silk',
        origin: 'Coastal Cliff Shale Wash',
        description: 'Balanced architectural neutral harmonizing with any wardrobe curation.',
      },
      {
        id: 'alpine-pearl',
        name: 'Alpine Glacial Pearl',
        shade: 'Opalescent White',
        hex: '#faf6f0',
        accentHex: '#c7bcb0',
        fabric: 'Grade-6A Raw Organza Silk',
        origin: 'Glacial Melt Pure Spring Weft',
        description: 'Pristine opalescence reflecting shifting natural daylight.',
      },
    ];

    return {
      success: true,
      data: swatches,
      message: 'Colorways retrieved',
    };
  },

  /**
   * Editorial Acclaim & Press Quotes for Sera.ji
   */
  async getEditorialReviews(): Promise<ApiResponse<EditorialReview[]>> {
    const reviews: EditorialReview[] = [
      {
        id: 'rev-1',
        publication: 'VOGUE HAUTE COUTURE',
        quote:
          'Sera.ji is redefining contemporary luxury clothing. Their handpicked silhouettes possess the effortless gravity of 1950s Riviera elegance paired with radical modern sustainability.',
        author: 'Emmanuelle C., Senior Fashion Critic',
        issue: 'Autumn Runway Retrospective',
        rating: '5/5',
      },
      {
        id: 'rev-2',
        publication: 'HARPER’S BAZAAR',
        quote:
          'In an era overwhelmed by excess and speed, Sera.ji ensures every piece is handpicked: 22-momme certified organic silks that drape against the body like second skin.',
        author: 'Julian Thorne, Sartorial Editor',
        issue: 'Global Luxury Issue',
        rating: '5/5',
      },
      {
        id: 'rev-3',
        publication: 'BUSINESS OF FASHION',
        quote:
          'By ensuring every piece is handpicked and tailoring directly with generational Como master weavers, Sera.ji establishes the benchmark for modern clothing brands.',
        author: 'Dr. Clara Bernardi',
        issue: 'Haute Innovation Report',
        rating: '5/5',
      },
      {
        id: 'rev-4',
        publication: 'FINANCIAL TIMES (HTSI)',
        quote:
          'The ultimate expression of quiet luxury clothing. At Sera.ji, every piece is handpicked, and conventional ready-to-wear simply ceases to compare.',
        author: 'Arthur Vance, Style Correspondent',
        issue: 'Weekend Edition',
        rating: '5/5',
      },
    ];

    return {
      success: true,
      data: reviews,
      message: 'Editorial reviews retrieved',
    };
  },

  /**
   * Sera.ji Clothing Brand Craftsmanship & Inquiries (FAQ)
   */
  async getFaqs(): Promise<ApiResponse<FaqItem[]>> {
    const faqs: FaqItem[] = [
      {
        id: 'faq-1',
        category: 'craft',
        question: 'What distinguishes Sera.ji handpicked Mulberry Silk from standard silk?',
        answer:
          'At Sera.ji, every piece is handpicked. We exclusively select Grade-6A organic mulberry silks with 22–32 momme density from historical mills in Lake Como. This grade represents the top 1% of raw silk harvested globally, yielding uncompromised structural tensile strength, deep light-refractive luster, and heirloom durability without synthetic additives or chemical sealants.',
      },
      {
        id: 'faq-2',
        category: 'tailoring',
        question: 'How does the Sera.ji Bespoke Clothing Fitting process unfold?',
        answer:
          'Your fitting commences with a private consultation—either at our Paris, Milan, London, or New York salons, or via our encrypted Digital Haute Concierge. Over 38 structural body coordinates are mapped, followed by master muslin draping, hand-chalked fabric cutting, and two personal fitting sessions to achieve millimeter perfection.',
      },
      {
        id: 'faq-3',
        category: 'provenance',
        question: 'Why does Sera.ji insist that every piece is handpicked and traceable?',
        answer:
          'Every piece is handpicked to uphold complete circularity and transparency. Every garment is accompanied by an encrypted cryptographic NFC tag verifying its complete fiber provenance: from the certified organic white mulberry groves in Northern Italy and Flemish flax farms to the master artisans who hand-rolled your seams.',
      },
      {
        id: 'faq-4',
        category: 'salons',
        question: 'Can I request a Sera.ji clothing consultation in an international salon?',
        answer:
          'Yes. The Sera.ji International Trunk Show operates private traveling salons in Zurich, Geneva, Dubai, Singapore, Los Angeles, and Tokyo each quarter. Alternatively, our Digital Haute Concierge delivers bespoke muslin sample sets and personalized video fitting appointments directly to your residence.',
      },
      {
        id: 'faq-5',
        category: 'tailoring',
        question: 'What is the lead time for a handpicked Sera.ji clothing commission?',
        answer:
          'Because every piece is handpicked and individually tailored, standard capsule pieces require 4 to 6 weeks of dedicated artisanal crafting. Bespoke one-of-a-kind commissions involving botanical dye baths require 8 to 10 weeks, ensuring uncompromising attention to every stitch.',
      },
    ];

    return {
      success: true,
      data: faqs,
      message: 'Faqs retrieved',
    };
  },

  /**
   * Interactive Sera.ji Atelier AI Assistant query
   */
  async queryAtelierAi(prompt: string): Promise<{ reply: string; silhouette: string; drapeScore: number }> {
    await new Promise((r) => setTimeout(r, 650));
    const lower = prompt.toLowerCase();

    if (lower.includes('evening') || lower.includes('black') || lower.includes('soirée')) {
      return {
        reply:
          'Sculpting a dramatic handpicked Sera.ji black-tie silhouette in 28-Momme Como silk with structured shoulder architecture, hand-rolled peak lapels, and an elongated fluid drop. Poise and midnight luminescence achieved.',
        silhouette: 'Sera.ji Nocturne Evening Drape',
        drapeScore: 97,
      };
    } else if (lower.includes('linen') || lower.includes('summer') || lower.includes('casual') || lower.includes('relaxed')) {
      return {
        reply:
          'Calibrating a relaxed Sera.ji Mediterranean resort cut in handpicked Belgian flax linen and soft raw silk. Features deconstructed shoulders, breathable weave tension, and sun-warmed organic flow. Every piece is handpicked.',
        silhouette: 'Sera.ji Riviera Casual Flammé',
        drapeScore: 89,
      };
    } else if (lower.includes('trench') || lower.includes('coat') || lower.includes('jacket')) {
      return {
        reply:
          'Engineering a handpicked Sera.ji weatherproof silk-gabardine overcoat with high double-breasted closure, horn fastenings, and a sweeping storm flap. Clean geometric proportions with timeless poise.',
        silhouette: 'Sera.ji Architectural Trench Cut',
        drapeScore: 95,
      };
    }

    return {
      reply: `Synthesizing your bespoke Sera.ji specification: "${prompt}". Every piece is handpicked in Grade-6A organic silk with hand-tailored architectural precision. Balanced drape, effortless posture, and heirloom finish configured.`,
      silhouette: 'Sera.ji Handpicked Commission',
      drapeScore: 93,
    };
  },

  /**
   * Telemetry tracker for high-traffic observability
   */
  trackEvent(eventName: string, metadata?: Record<string, unknown>) {
    if (import.meta.env.DEV) {
      console.log(`[Sera.ji Telemetry] ${eventName}`, metadata);
    }
  },
};
