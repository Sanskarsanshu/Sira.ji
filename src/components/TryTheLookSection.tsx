import React, { useEffect, useRef, useState, useCallback } from 'react';
import './TryTheLookSection.css';
import { useAtelier } from '../context/AtelierContext';
import type { CapsulePiece } from '../types';

interface ProductVariant {
  id: number;
  a: boolean;
  o: string[];
}

interface ProductInfo {
  id: string;
  name: string;
  vendor: string;
  price: number;
  priceStr: string;
  image: string;
  sizes: string[];
  variants: ProductVariant[];
  url: string;
  legend: string;
}

const PRODUCTS: Record<string, ProductInfo> = {
  'tatum-5-orbit-copy': {
    id: 'tatum-5-orbit-copy',
    name: 'Air Jordan 12 Retro',
    vendor: 'Nikey | Password: 1',
    price: 149.0,
    priceStr: '$149.00',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp',
    legend: 'Shoe size',
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    variants: [
      { id: 57015167025457, a: true, o: ['40'] },
      { id: 57015167058225, a: true, o: ['41'] },
      { id: 57015167090993, a: true, o: ['42'] },
      { id: 57015167123761, a: true, o: ['43'] },
      { id: 57015167156529, a: true, o: ['44'] },
      { id: 57015167189297, a: true, o: ['45'] },
      { id: 57015167222065, a: true, o: ['46'] },
    ],
    url: 'https://nike-makknzjs.myshopify.com/products/tatum-5-orbit-copy',
  },
  tshirt: {
    id: 'tshirt',
    name: 'Tshirt',
    vendor: 'Nike',
    price: 199.0,
    priceStr: '$199.00',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
    legend: 'Size',
    sizes: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56835911582001, a: true, o: ['S'] },
      { id: 56835911614769, a: true, o: ['L'] },
      { id: 56835911647537, a: true, o: ['M'] },
      { id: 56835911680305, a: true, o: ['XL'] },
    ],
    url: 'https://nike-makknzjs.myshopify.com/products/tshirt',
  },
  sweatshirt: {
    id: 'sweatshirt',
    name: 'Sweatshirt',
    vendor: 'Nike',
    price: 199.0,
    priceStr: '$199.00',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
    legend: 'Size',
    sizes: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56835806396721, a: true, o: ['S'] },
      { id: 56835806429489, a: true, o: ['L'] },
      { id: 56835806462257, a: true, o: ['M'] },
      { id: 56835806495025, a: true, o: ['XL'] },
    ],
    url: 'https://nike-makknzjs.myshopify.com/products/sweatshirt',
  },
  'tatum-5-orbit': {
    id: 'tatum-5-orbit',
    name: 'Tatum 5 Orbit',
    vendor: 'Nikey | Password: 1',
    price: 149.0,
    priceStr: '$149.00',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp',
    legend: 'Shoe size',
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    variants: [
      { id: 57015166730545, a: true, o: ['40'] },
      { id: 57015166763313, a: true, o: ['41'] },
      { id: 57015166796081, a: true, o: ['42'] },
      { id: 57015166828849, a: true, o: ['43'] },
      { id: 57015166861617, a: true, o: ['44'] },
      { id: 57015166894385, a: true, o: ['45'] },
      { id: 57015166927153, a: true, o: ['46'] },
    ],
    url: 'https://nike-makknzjs.myshopify.com/products/tatum-5-orbit',
  },
  'hoodie-black': {
    id: 'hoodie-black',
    name: 'Hoodie Black',
    vendor: 'Nike',
    price: 199.0,
    priceStr: '$199.00',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-hoodie-black.webp',
    legend: 'Size',
    sizes: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56836251681073, a: true, o: ['S'] },
      { id: 56836251713841, a: true, o: ['L'] },
      { id: 56836251746609, a: true, o: ['M'] },
      { id: 56836251779377, a: true, o: ['XL'] },
    ],
    url: 'https://nike-makknzjs.myshopify.com/products/hoodie-black',
  },
  'sweatshirt-plus': {
    id: 'sweatshirt-plus',
    name: 'Sweatshirt Plus',
    vendor: 'Nike',
    price: 199.0,
    priceStr: '$199.00',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt-plus.webp',
    legend: 'Size',
    sizes: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56836143743281, a: true, o: ['S'] },
      { id: 56836143776049, a: true, o: ['L'] },
      { id: 56836143808817, a: true, o: ['M'] },
      { id: 56836143841585, a: true, o: ['XL'] },
    ],
    url: 'https://nike-makknzjs.myshopify.com/products/sweatshirt-plus',
  },
  hoodie: {
    id: 'hoodie',
    name: 'Hoodie',
    vendor: 'Nike',
    price: 199.0,
    priceStr: '$199.00',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-hoodie.webp',
    legend: 'Size',
    sizes: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56836002185521, a: true, o: ['S'] },
      { id: 56836002218289, a: true, o: ['L'] },
      { id: 56836002251057, a: true, o: ['M'] },
      { id: 56836002283825, a: true, o: ['XL'] },
    ],
    url: 'https://nike-makknzjs.myshopify.com/products/hoodie',
  },
  'air-jordan-12-retro-copy': {
    id: 'air-jordan-12-retro-copy',
    name: 'Luka 5',
    vendor: 'Nikey | Password: 1',
    price: 149.0,
    priceStr: '$149.00',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-air-jordan-12-retro-copy.webp',
    legend: 'Shoe size',
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    variants: [
      { id: 57015167025457, a: true, o: ['40'] },
      { id: 57015167058225, a: true, o: ['41'] },
      { id: 57015167090993, a: true, o: ['42'] },
      { id: 57015167123761, a: true, o: ['43'] },
      { id: 57015167156529, a: true, o: ['44'] },
      { id: 57015167189297, a: true, o: ['45'] },
      { id: 57015167222065, a: true, o: ['46'] },
    ],
    url: 'https://nike-makknzjs.myshopify.com/products/air-jordan-12-retro-copy',
  },
};

interface PinDef {
  num: number;
  productKey: string;
  left: number;
  top: number;
}

interface LookDef {
  index: number;
  numStr: string;
  name: string;
  desc: string;
  src640: string;
  srcset1080: string;
  pins: PinDef[];
  products: string[];
}

const LOOKS: LookDef[] = [
  {
    index: 0,
    numStr: '01',
    name: 'The City Edit',
    desc: 'A charcoal knit and easy relaxed denim.',
    src640: 'https://reel-ref-try-the-look.vercel.app/assets/model-1-640.webp',
    srcset1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-1.webp',
    pins: [
      { num: 1, productKey: 'tatum-5-orbit-copy', left: 47, top: 27 },
      { num: 2, productKey: 'tshirt', left: 48, top: 58 },
      { num: 3, productKey: 'sweatshirt', left: 45, top: 96 },
    ],
    products: ['tatum-5-orbit-copy', 'tshirt', 'sweatshirt'],
  },
  {
    index: 1,
    numStr: '02',
    name: 'Gallery Opening',
    desc: 'A clean white oversized tee and washed vintage denim.',
    src640: 'https://reel-ref-try-the-look.vercel.app/assets/model-5-640.webp',
    srcset1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-5.webp',
    pins: [
      { num: 1, productKey: 'tatum-5-orbit', left: 50, top: 28 },
      { num: 2, productKey: 'hoodie-black', left: 48, top: 58 },
      { num: 3, productKey: 'tshirt', left: 45, top: 88 },
    ],
    products: ['tatum-5-orbit', 'hoodie-black', 'tshirt'],
  },
  {
    index: 2,
    numStr: '03',
    name: 'Gallery Opening',
    desc: 'Olive-green chunky knitwear with grounded earth tones.',
    src640: 'https://reel-ref-try-the-look.vercel.app/assets/model-4-640.webp',
    srcset1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-4.webp',
    pins: [
      { num: 1, productKey: 'sweatshirt-plus', left: 50, top: 28 },
      { num: 2, productKey: 'tatum-5-orbit', left: 48, top: 58 },
      { num: 3, productKey: 'tshirt', left: 45, top: 88 },
    ],
    products: ['sweatshirt-plus', 'tatum-5-orbit', 'tshirt'],
  },
  {
    index: 3,
    numStr: '04',
    name: 'Studio Day',
    desc: 'Black, white and laid-back wide denim drape.',
    src640: 'https://reel-ref-try-the-look.vercel.app/assets/model-6-640.webp',
    srcset1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-6.webp',
    pins: [
      { num: 1, productKey: 'hoodie-black', left: 50, top: 28 },
      { num: 2, productKey: 'tatum-5-orbit-copy', left: 48, top: 58 },
      { num: 3, productKey: 'tshirt', left: 45, top: 88 },
    ],
    products: ['hoodie-black', 'tatum-5-orbit-copy', 'tshirt'],
  },
  {
    index: 4,
    numStr: '05',
    name: 'Studio Day',
    desc: 'Burgundy knit layers over structured white cotton.',
    src640: 'https://reel-ref-try-the-look.vercel.app/assets/model-3-640.webp',
    srcset1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-3.webp',
    pins: [
      { num: 1, productKey: 'sweatshirt', left: 50, top: 28 },
      { num: 2, productKey: 'tatum-5-orbit', left: 48, top: 58 },
      { num: 3, productKey: 'tshirt', left: 45, top: 88 },
    ],
    products: ['sweatshirt', 'tatum-5-orbit', 'tshirt'],
  },
  {
    index: 5,
    numStr: '06',
    name: 'Studio Day',
    desc: 'Light-grey crew sweatshirt with relaxed Italian-cut denim.',
    src640: 'https://reel-ref-try-the-look.vercel.app/assets/model-2-640.webp',
    srcset1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-2.webp',
    pins: [
      { num: 1, productKey: 'hoodie', left: 50, top: 28 },
      { num: 2, productKey: 'air-jordan-12-retro-copy', left: 48, top: 58 },
      { num: 3, productKey: 'tshirt', left: 45, top: 88 },
    ],
    products: ['hoodie', 'air-jordan-12-retro-copy', 'tshirt'],
  },
];

// Linear depth table stops - matching the hero section above
const KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085];
const KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59];
const KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19];
const KB = [0, 0, 1.5, 4, 8, 12, 17];
const KO = [1, 1, 1, 1, 0.86, 0.5, 0];

const N = LOOKS.length;
const wrap = (x: number, n: number) => ((x % n) + n) % n;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

interface BagItem {
  id: number;
  productKey: string;
  name: string;
  size: string;
  price: number;
  image: string;
  url: string;
  quantity: number;
}

export const TryTheLookSection: React.FC = () => {
  const {
    showToast,
    toggleCuratePiece,
    isPieceCurated,
    addToCart,
  } = useAtelier();

  const [pState, setPState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [hotPin, setHotPin] = useState<number | null>(null);

  // Styling bag state
  const [bagItems, setBagItems] = useState<BagItem[]>(() => {
    try {
      const saved = localStorage.getItem('runway-styling-bag-v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isBagDialogOpen, setIsBagDialogOpen] = useState(false);

  // Picking and selections
  const [pickingKey, setPickingKey] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [isAddingBundle, setIsAddingBundle] = useState(false);

  // Animation refs - exactly like the Hero section
  const stageRef = useRef<HTMLDivElement>(null);
  const modelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rollRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const pRef = useRef(0);
  const targetRef = useRef(0);
  const lastTimeRef = useRef(0);
  const dirtyRef = useRef(true);
  const WRef = useRef(0);
  const HRef = useRef(0);
  const baseRef = useRef(0);

  // Pointer drag refs
  const mxRef = useRef(0);
  const myRef = useRef(0);
  const cxRef = useRef(0);
  const cyRef = useRef(0);
  const downRef = useRef(false);
  const sxRef = useRef(0);
  const stRef = useRef(0);
  const movedRef = useRef(0);
  const wheelTimerRef = useRef<number | null>(null);
  const autoplayTimerRef = useRef<number | null>(null);
  const isEngagedRef = useRef(false);

  const activeIdx = wrap(Math.round(pState), N);
  const currentLook = LOOKS[activeIdx];
  const currentProducts = currentLook.products.map((k) => PRODUCTS[k]).filter(Boolean);
  const bundleOriginalPrice = currentProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscountedPrice = bundleOriginalPrice * 0.9;

  // Persist bag items
  useEffect(() => {
    try {
      localStorage.setItem('runway-styling-bag-v3', JSON.stringify(bagItems));
    } catch (e) {
      console.warn('Unable to persist bag', e);
    }
  }, [bagItems]);

  // Size calculation
  const updateSize = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    WRef.current = W;
    HRef.current = H;
    const base = H * 1.2;
    baseRef.current = base;

    LOOKS.forEach((_, i) => {
      const el = modelRefs.current[i];
      if (el) {
        const r = 0.5625; // standard 9:16 aspect ratio
        el.style.width = `${base * r}px`;
        el.style.height = `${base}px`;
      }
    });
    dirtyRef.current = true;
  }, []);

  // Depth Table Painting - exact copy of Hero section movement
  const paint = useCallback(() => {
    const W = WRef.current;
    const H = HRef.current;
    const base = baseRef.current;
    const p = pRef.current;

    LOOKS.forEach((_, i) => {
      const el = modelRefs.current[i];
      if (!el) return;
      const r = 0.5625;
      let d = wrap(i - p, N);
      if (d > N - 1) d -= N;

      const k = clamp(d + 1, 0, 6);
      const idxA = Math.floor(k);
      const idxB = Math.min(6, idxA + 1);
      const t = k - idxA;
      const mix = (arr: number[]) => arr[idxA] + (arr[idxB] - arr[idxA]) * t;

      const h = mix(KH) * H;
      const s = h / (base || 1);
      const w = h * r;
      const x = mix(KX) * W - w / 2;
      const y = mix(KF) * H - h;

      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
      const f = mix(KB) / s;
      el.style.filter = f < 0.2 ? 'none' : `blur(${f.toFixed(1)}px)`;
      el.style.opacity = mix(KO).toFixed(3);
      el.style.zIndex = String(100 - Math.round(d * 10));
    });

    // Rolling look number
    const roll = rollRef.current;
    if (roll && roll.firstChild) {
      const rollHeight = (roll.firstChild as HTMLElement).offsetHeight || 32;
      roll.style.transform = `translate3d(0, ${(-wrap(p, N) * rollHeight).toFixed(1)}px, 0)`;
    }
  }, []);

  // RAF loop - matching Hero section physics
  useEffect(() => {
    updateSize();

    let animId: number;
    const loop = (now: number) => {
      const dt = Math.min(50, now - lastTimeRef.current) || 16;
      lastTimeRef.current = now;

      const was = pRef.current;
      const target = targetRef.current;

      pRef.current += (target - pRef.current) * (1 - Math.exp(-dt * 0.0072));

      if (Math.abs(target - pRef.current) < 0.0004) {
        pRef.current = target;
      }

      if (Math.abs(pRef.current - was) > 0.0001 || dirtyRef.current) {
        dirtyRef.current = false;
        paint();
        setPState(pRef.current);
      }

      // Cursor follow
      cxRef.current += (mxRef.current - cxRef.current) * 0.32;
      cyRef.current += (myRef.current - cyRef.current) * 0.32;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cxRef.current.toFixed(1)}px, ${cyRef.current.toFixed(1)}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    window.addEventListener('resize', updateSize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
    };
  }, [updateSize, paint]);

  // Pointer interactions
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && ringRef.current) {
      ringRef.current.classList.add('show');
    }
  };

  const handlePointerLeave = () => {
    if (ringRef.current) ringRef.current.classList.remove('show');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    mxRef.current = e.clientX - r.left;
    myRef.current = e.clientY - r.top;

    if (!downRef.current) return;
    const dx = e.clientX - sxRef.current;
    movedRef.current = Math.max(movedRef.current, Math.abs(dx));
    const pull = Math.max(150, WRef.current * 0.2);
    targetRef.current = stRef.current + dx / pull;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('.ttl-glass-suite') || target.closest('.ttl-controls-bar')) {
      return;
    }
    downRef.current = true;
    sxRef.current = e.clientX;
    stRef.current = targetRef.current;
    movedRef.current = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    if (ringRef.current) ringRef.current.classList.add('drag');
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!downRef.current) return;
    downRef.current = false;
    if (ringRef.current) ringRef.current.classList.remove('drag');

    if (movedRef.current < 6) {
      const hit = document.elementsFromPoint(e.clientX, e.clientY).find(
        (x) => x.classList && x.classList.contains('ttl-model')
      ) as HTMLElement | undefined;
      if (hit && hit.dataset.i !== undefined) {
        const clickedIdx = +hit.dataset.i;
        let d = wrap(clickedIdx - targetRef.current, N);
        d = Math.round(d);
        if (d === 0) {
          // Click on front model opens lightbox popup with pins!
          setIsLightboxOpen(true);
        } else if (d > 0 && d < N) {
          targetRef.current = Math.round(targetRef.current) + d;
        }
      }
    } else {
      targetRef.current = Math.round(targetRef.current);
    }
  };

  // Wheel handling with debounced snapping
  const handleWheel = (e: React.WheelEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.ttl-items-list')) return;

    e.preventDefault();
    targetRef.current += clamp(e.deltaY + e.deltaX, -120, 120) / 420;
    if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    wheelTimerRef.current = window.setTimeout(() => {
      targetRef.current = Math.round(targetRef.current);
    }, 150);
  };

  // Keyboard controls
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetRef.current = Math.round(targetRef.current) + 1;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetRef.current = Math.round(targetRef.current) - 1;
    }
  };

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || isLightboxOpen || isEngagedRef.current) {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = window.setTimeout(() => {
      if (!downRef.current && !isLightboxOpen && !isEngagedRef.current) {
        targetRef.current = Math.round(targetRef.current) + 1;
      }
    }, 5000);

    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };
  }, [isPlaying, pState, isLightboxOpen]);

  // Jump to specific look
  const jumpToLook = (idx: number) => {
    let d = (idx - activeIdx) % N;
    if (d > 3) d -= 6;
    else if (d < -3) d += 6;
    targetRef.current = Math.round(targetRef.current) + d;
  };

  // Toggle favorite in Trunk Show Curation
  const handleToggleFavorite = (product: ProductInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFaved = isPieceCurated(product.id);
    const piece: CapsulePiece = {
      id: product.id,
      title: product.name,
      subtitle: product.vendor,
      image: product.image,
      status: 'ready',
      tag: 'Streetwear Look',
      price: product.priceStr,
      details: [
        `${product.legend}: ${product.sizes.join(', ')}`,
        `Vendor: ${product.vendor}`,
        'Every piece handpicked & verified',
      ],
    };
    toggleCuratePiece(piece);
    showToast(
      isFaved
        ? `Removed ${product.name} from Trunk Show`
        : `${product.name} saved to Trunk Show ♥`,
      'gold'
    );
  };

  // Add individual piece to styling bag
  const handleAddPiece = (lookIdx: number, itemIdx: number, productKey: string) => {
    const rowKey = `${lookIdx}-${itemIdx}`;
    const product = PRODUCTS[productKey];
    if (!product) return;

    const chosenSize = selectedSizes[rowKey] || product.sizes[0];
    const variant = product.variants.find((v) => v.o[0] === chosenSize) || product.variants[0];

    isEngagedRef.current = true;
    setIsPlaying(false);
    setAddedItems((prev) => ({ ...prev, [rowKey]: true }));
    setPickingKey(null);

    // Update universal header cart count
    addToCart(1);

    setBagItems((prev) => {
      const existingIdx = prev.findIndex((b) => b.id === variant.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity = Math.min(20, updated[existingIdx].quantity + 1);
        return updated;
      }
      return [
        ...prev,
        {
          id: variant.id,
          productKey,
          name: product.name,
          size: chosenSize,
          price: product.price,
          image: product.image,
          url: product.url,
          quantity: 1,
        },
      ];
    });

    showToast(`Added ${product.name} (Size ${chosenSize}) to bag ✓`, 'gold');
  };

  // Complete look bundle add
  const handleAddFullLook = () => {
    setIsAddingBundle(true);
    isEngagedRef.current = true;
    setIsPlaying(false);

    setTimeout(() => {
      setIsAddingBundle(false);
      // Update universal header cart count with all 3 pieces
      addToCart(currentLook.products.length);
      currentLook.products.forEach((productKey, itemIdx) => {
        const rowKey = `${activeIdx}-${itemIdx}`;
        setAddedItems((prev) => ({ ...prev, [rowKey]: true }));
        const product = PRODUCTS[productKey];
        if (product) {
          const chosenSize = selectedSizes[rowKey] || product.sizes[0];
          const variant = product.variants.find((v) => v.o[0] === chosenSize) || product.variants[0];

          setBagItems((prev) => {
            const existingIdx = prev.findIndex((b) => b.id === variant.id);
            if (existingIdx >= 0) {
              const updated = [...prev];
              updated[existingIdx].quantity = Math.min(20, updated[existingIdx].quantity + 1);
              return updated;
            }
            return [
              ...prev,
              {
                id: variant.id,
                productKey,
                name: product.name,
                size: chosenSize,
                price: product.price,
                image: product.image,
                url: product.url,
                quantity: 1,
              },
            ];
          });
        }
      });
      showToast(`Full Look ${currentLook.numStr}: ${currentLook.name} added to bag (10% discount) ✓`, 'gold');
    }, 500);
  };

  // Export Shortlist TXT
  const handleExportShortlist = () => {
    if (bagItems.length === 0) return;
    const subtotal = bagItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const lines = [
      'RUNWAY — STYLING SHORTLIST',
      '',
      'Reference prices; no order or payment has been placed.',
      '',
      ...bagItems.map(
        (b) => `${b.name} · Size ${b.size} · Quantity ${b.quantity} · $${(b.price * b.quantity).toFixed(2)}\n${b.url}`
      ),
      '',
      `Reference subtotal: $${subtotal.toFixed(2)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'runway-outfit-shortlist.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Downloaded outfit shortlist txt ✓');
  };

  return (
    <section className="hero try-the-look-hero-section" id="streetwear">
      <div className="wrap">
        {/* SECTION HEADER - Matching Hero Style */}
        <div className="hero-head">
          <div
            style={{
              marginBottom: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: '#e9edf2',
              borderRadius: '99px',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#16191f',
              fontFamily: 'Michroma, sans-serif',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16191f' }} />
            <span>Streetwear Edition · Try The Look</span>
          </div>

          <h2 className="h-display split" data-split style={{ fontSize: 'clamp(34px, 4vw, 54px)', margin: 0 }}>
            Urban Poise,<br />Streetwear Runway
          </h2>
          <p className="hero-sub rv" style={{ marginTop: '16px' }}>
            Six curated streetwear looks styled head to toe. Drag to explore the perspective line, tap pins to inspect every piece.
          </p>
        </div>

        {/* HERO CARD CONTAINER - Identical to Hero Section Above */}
        <div className="hero-card rv rv-scale runway-hero-wrapper try-the-look-card">
          <div className="ttl-container">
            <main className="ttl-main">
              {/* STAGE */}
              <section
                ref={stageRef}
                className="ttl-stage"
                tabIndex={0}
                aria-label="Streetwear runway looks. Drag or scroll to change look."
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
                onKeyDown={handleKeyDown}
              >
                {/* 3D Runway Models in Perspective Line */}
                <div className="ttl-line">
                  {LOOKS.map((look, i) => (
                    <div
                      key={i}
                      className="ttl-model"
                      data-i={i}
                      ref={(el) => {
                        modelRefs.current[i] = el;
                      }}
                      title={`Click Look ${look.numStr}: ${look.name}`}
                    >
                      <div className="ttl-model-figure">
                        <img
                          src={look.src640}
                          srcSet={`${look.src640} 640w, ${look.srcset1080} 1080w`}
                          sizes="(min-width: 1800px) 540px, (min-width: 750px) 420px, 320px"
                          alt={look.name}
                          loading="eager"
                          draggable={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Glass Suite (Styled like Hero Atelier Suite) */}
                <div className="ttl-glass-suite">
                  <div className="ttl-glass-header">
                    <div className="ttl-brand-badge">
                      <span className="ttl-pulse-dot" />
                      <span>Nike Streetwear · Look {currentLook.numStr}</span>
                    </div>

                    <button
                      className="ttl-inspect-btn"
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                    >
                      <span>Inspect Pins</span>
                      <span>↗</span>
                    </button>
                  </div>

                  <div className="ttl-look-info">
                    <span className="ttl-look-kicker">Lookbook Curation</span>
                    <span className="ttl-look-title">{currentLook.name}</span>
                    <p className="ttl-look-desc">{currentLook.desc}</p>
                  </div>

                  <div className="ttl-pins-ribbon">
                    <span>Active Pins:</span>
                    {currentLook.pins.map((pin) => {
                      const prod = PRODUCTS[pin.productKey];
                      return (
                        <button
                          key={pin.num}
                          type="button"
                          className="ttl-pin-chip"
                          onClick={() => {
                            setHotPin(pin.num);
                            setPickingKey(`${activeIdx}-${pin.num - 1}`);
                          }}
                        >
                          <span>{pin.num}</span>
                          <span>{prod?.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Complete the Look Card (Positioned in Bottom-Left of Main Runway Area) */}
                <div className="ttl-runway-bundle-card">
                  <div className="ttl-bundle-row">
                    <div>
                      <div className="ttl-bundle-title">Complete the look</div>
                      <div className="ttl-bundle-note">Bundle all 3 and save 10%</div>
                    </div>
                    <div className="ttl-bundle-pricing">
                      <s>${bundleOriginalPrice.toFixed(2)}</s>
                      <strong>${bundleDiscountedPrice.toFixed(2)}</strong>
                    </div>
                  </div>

                  <button
                    className="ttl-cta-bundle-btn"
                    type="button"
                    disabled={isAddingBundle}
                    onClick={handleAddFullLook}
                  >
                    <span>{isAddingBundle ? 'Adding to bag…' : 'ADD FULL LOOK TO BAG →'}</span>
                  </button>
                </div>

                {/* Bottom Controls Bar (Rolling Look Number & Segmented Ticks, No Prev/Play/Next buttons) */}
                <div className="ttl-controls-bar">
                  <div className="ttl-rolling-look">
                    <span>Look</span>
                    <span className="ttl-look-win">
                      <span className="ttl-look-roll" ref={rollRef}>
                        {LOOKS.map((look) => (
                          <b key={look.index}>{look.numStr}</b>
                        ))}
                        <b>01</b>
                      </span>
                    </span>
                  </div>

                  {/* Segmented Ticks */}
                  <div className="ttl-ticks-group">
                    {LOOKS.map((look, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`ttl-tick-btn ${i === activeIdx ? 'active' : ''} ${i < activeIdx ? 'past' : ''}`}
                        onClick={() => jumpToLook(i)}
                        aria-label={`Look ${look.numStr}: ${look.name}`}
                      >
                        <div className="ttl-tick-track">
                          <div className="ttl-tick-fill" />
                        </div>
                        <span className="ttl-tick-label">
                          {look.numStr}
                          <span className="ttl-tick-name">&nbsp;&nbsp;{look.name}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Follower Ring Cursor */}
                <div className="ring" ref={ringRef} />
              </section>

              {/* RIGHT PANEL - Exactly Three Product Cards, No Header */}
              <aside className="ttl-panel" aria-label="Pieces in this look">
                <div className="ttl-cards-track" aria-label="Curated pieces for this look">
                  {currentLook.products.map((productKey, itemIdx) => {
                    const product = PRODUCTS[productKey];
                    if (!product) return null;
                    const rowKey = `${activeIdx}-${itemIdx}`;
                    const isPicking = pickingKey === rowKey;
                    const isAdded = !!addedItems[rowKey];
                    const isHot = hotPin === itemIdx + 1;
                    const chosenSize = selectedSizes[rowKey] || product.sizes[0];
                    const isFaved = isPieceCurated(product.id);

                    return (
                      <article
                        key={itemIdx}
                        className={`card runway-card ttl-runway-card ${itemIdx % 2 ? 'alt' : ''} ${isHot ? 'hot' : ''}`}
                        onPointerEnter={() => setHotPin(itemIdx + 1)}
                        onPointerLeave={() => setHotPin(null)}
                      >
                        {/* Heart / Fav button — same as RunwayLookbook */}
                        <button
                          className="fav"
                          type="button"
                          aria-pressed={isFaved}
                          aria-label={`${isFaved ? 'Remove' : 'Save'} ${product.name}`}
                          onClick={(e) => handleToggleFavorite(product, e)}
                          title={isFaved ? 'Saved in Trunk Show' : 'Add to Trunk Show'}
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.600 4.600 0 0 1 20.500 9C20.500 15 12 20 12 20Z" />
                          </svg>
                        </button>

                        {/* Large Prominent Product Image Shot */}
                        <div className="shot">
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={-1}
                            className="ttl-shot-link"
                          >
                            <img src={product.image} alt={product.name} />
                          </a>
                          <span className="ttl-card-badge" title={`Pin ${itemIdx + 1} on model`}>
                            {itemIdx + 1}
                          </span>
                        </div>

                        {/* Meta: Title, Price, and Plus + Button */}
                        <div className="meta">
                          <div>
                            <span className="ttl-vendor-tag">{product.vendor}</span>
                            <h3 className="wide">{product.name}</h3>
                            <span>{product.priceStr}</span>
                          </div>

                          <button
                            className={`add ${isPicking ? 'picking' : ''} ${isAdded ? 'added' : ''}`}
                            type="button"
                            aria-label={`Select size for ${product.name}`}
                            onClick={() => {
                              if (!isAdded) {
                                setPickingKey(isPicking ? null : rowKey);
                              }
                            }}
                            title={isPicking ? 'Close size picker' : 'Select size and add to bag'}
                          />
                        </div>

                        {/* Interactive Size Picker & Add to Bag Confirm */}
                        {isPicking && (
                          <div className="ttl-picker-box">
                            <div className="ttl-picker-header">
                              <span className="ttl-picker-legend">{product.legend}</span>
                              <span className="ttl-picker-selected">
                                Selected: <b>{chosenSize}</b>
                              </span>
                            </div>

                            <div className="ttl-pills-row">
                              {product.sizes.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  className={`ttl-pill-label ${chosenSize === s ? 'checked' : ''}`}
                                  onClick={() => setSelectedSizes((prev) => ({ ...prev, [rowKey]: s }))}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>

                            <button
                              className="ttl-confirm-btn"
                              type="button"
                              onClick={() => handleAddPiece(activeIdx, itemIdx, productKey)}
                            >
                              <span>Add to bag</span>
                              <span>·</span>
                              <span>{product.priceStr}</span>
                            </button>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </aside>
            </main>

            {/* LIGHTBOX POPUP ("View Look" with Interactive Numbered Pins) */}
            <div className={`ttl-lightbox ${isLightboxOpen ? 'open' : ''}`}>
              <div className="ttl-lb-header">
                <div className="ttl-lb-title-group">
                  <span className="ttl-lb-kicker">Look {currentLook.numStr}</span>
                  <span className="ttl-lb-name">{currentLook.name}</span>
                </div>

                <button
                  className="ttl-lb-close-btn"
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Close lightbox"
                >
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="ttl-lb-stage" onClick={() => setIsLightboxOpen(false)}>
                <div className="ttl-lb-figure-box" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={currentLook.src640}
                    srcSet={`${currentLook.src640} 640w, ${currentLook.srcset1080} 1080w`}
                    alt={currentLook.name}
                  />

                  {/* Interactive Pins */}
                  {currentLook.pins.map((pin) => {
                    const prod = PRODUCTS[pin.productKey];
                    return (
                      <button
                        key={pin.num}
                        type="button"
                        className={`ttl-pin-node ${hotPin === pin.num ? 'active' : ''}`}
                        style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                        data-tip={prod?.name || ''}
                        onPointerEnter={() => setHotPin(pin.num)}
                        onPointerLeave={() => setHotPin(null)}
                        onClick={() => {
                          setHotPin(pin.num);
                          setPickingKey(`${activeIdx}-${pin.num - 1}`);
                          setIsLightboxOpen(false);
                          showToast(`Selected piece ${pin.num}: ${prod?.name}`);
                        }}
                      >
                        <span className="ttl-pin-circle">{pin.num}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="ttl-lb-footer-hint">Tap a numbered dot to isolate and shop the piece</p>
            </div>
          </div>
        </div>
      </div>

      {/* STYLING BAG DIALOG */}
      {isBagDialogOpen && (
        <dialog id="bag-dialog" open>
          <div className="bag-heading">
            <h2>Your styling bag</h2>
            <button id="close-bag" type="button" onClick={() => setIsBagDialogOpen(false)}>
              ×
            </button>
          </div>
          <p className="bag-note">
            A local outfit shortlist. No payment or order is collected here. Open a piece on the original demo to continue.
          </p>

          <div id="bag-items">
            {bagItems.length === 0 ? (
              <p className="bag-note">Your styling bag is empty. Choose a size beside a piece to save it.</p>
            ) : (
              bagItems.map((item, idx) => (
                <div key={idx} className="bag-row">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      Size {item.size} · Quantity {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      View original piece ↗
                    </a>
                  </div>
                  <button
                    className="bag-remove-btn"
                    type="button"
                    onClick={() => {
                      setBagItems((prev) => prev.filter((_, i) => i !== idx));
                      showToast(`Removed ${item.name} from styling bag`);
                    }}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {bagItems.length > 0 && (
            <p id="bag-total">
              Reference subtotal $
              {bagItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
            </p>
          )}

          <button
            id="export-bag"
            type="button"
            disabled={bagItems.length === 0}
            onClick={handleExportShortlist}
          >
            Download outfit shortlist
          </button>
        </dialog>
      )}
    </section>
  );
};
