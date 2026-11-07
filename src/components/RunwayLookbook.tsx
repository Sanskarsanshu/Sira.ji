import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAtelier } from '../context/AtelierContext';
import { api } from '../services/api';
import type { CapsulePiece } from '../types';
import './TryTheLookSection.css';

const MODELS =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042056_1a704ff7-b0e5-4a9f-bbda-62392b819fb6.png&w=3840&q=85';
const PIECES =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042057_080e85b0-b4aa-4072-8eb9-2304c7baf42b.png&w=2400&q=85';

// Each model's box on the 960 x 540 sheet: x0, x1
const LOOKS: [number, number][] = [
  [12, 176],
  [178, 330],
  [331, 470],
  [476, 633],
  [634, 767],
  [767, 956],
];
const Y0 = 48;
const Y1 = 496;

// Each piece's box on the 960 x 720 sheet: x0, x1, y0, y1, name, price
interface ItemData {
  id: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  name: string;
  price: string;
}

const ITEMS: ItemData[] = [
  { id: 'p-1', x0: 26, x1: 224, y0: 28, y1: 214, name: 'Feather Jacket', price: '$2,900' },
  { id: 'p-2', x0: 304, x1: 412, y0: 22, y1: 236, name: 'Satin Wide Leg Trousers', price: '$1,450' },
  { id: 'p-3', x0: 530, x1: 666, y0: 12, y1: 242, name: 'Pleated Dress', price: '$2,200' },
  { id: 'p-4', x0: 752, x1: 922, y0: 100, y1: 146, name: 'Gold Waist Belt', price: '$420' },
  { id: 'p-5', x0: 70, x1: 176, y0: 246, y1: 466, name: 'Satin Trench Dress', price: '$2,350' },
  { id: 'p-6', x0: 294, x1: 422, y0: 294, y1: 432, name: 'Top Handle Bag', price: '$980' },
  { id: 'p-7', x0: 508, x1: 688, y0: 240, y1: 452, name: 'Billow Sleeve Blouse', price: '$860' },
  { id: 'p-8', x0: 780, x1: 890, y0: 252, y1: 466, name: 'Tie Waist Trousers', price: '$740' },
  { id: 'p-9', x0: 64, x1: 178, y0: 484, y1: 698, name: 'Powder Long Coat', price: '$1,980' },
  { id: 'p-10', x0: 316, x1: 396, y0: 482, y1: 698, name: 'Ivory Straight Trousers', price: '$690' },
  { id: 'p-11', x0: 530, x1: 672, y0: 508, y1: 682, name: 'Sculpted Ruffle Top', price: '$1,120' },
  { id: 'p-12', x0: 754, x1: 916, y0: 484, y1: 700, name: 'Pleated Maxi Skirt', price: '$1,340' },
];

export interface FemaleLookMeta {
  index: number;
  numStr: string;
  name: string;
  desc: string;
  productIds: string[];
}

export const FEMALE_LOOKS: FemaleLookMeta[] = [
  {
    index: 0,
    numStr: '15',
    name: 'Feather & Silk Silhouette',
    desc: 'Blush ostrich feather jacket with fluid Como silk wide-leg trousers and gold-tone accessories.',
    productIds: ['p-1', 'p-2', 'p-4'],
  },
  {
    index: 1,
    numStr: '16',
    name: 'Pleated Riviera Evening',
    desc: 'Architectural pleated gown in sage silk charmeuse cinched with an artisanal gold waist belt.',
    productIds: ['p-3', 'p-4', 'p-6'],
  },
  {
    index: 2,
    numStr: '17',
    name: 'Champagne Satin Trench',
    desc: 'Fluid double-breasted satin trench dress paired with structured calfskin top-handle bag.',
    productIds: ['p-5', 'p-6', 'p-4'],
  },
  {
    index: 3,
    numStr: '18',
    name: 'Billow Silk Poise',
    desc: 'Voluminous gathered silk blouse in rose-dust paired with tailored tie-waist pleated trousers.',
    productIds: ['p-7', 'p-8', 'p-6'],
  },
  {
    index: 4,
    numStr: '19',
    name: 'Powder Blue Couture',
    desc: 'Double-faced cashmere long coat over high-waist ivory straight trousers with quiet poise.',
    productIds: ['p-9', 'p-10', 'p-6'],
  },
  {
    index: 5,
    numStr: '20',
    name: 'Sculpted Ruffle Statement',
    desc: 'Tiered ruffle bodice in organza silk over dramatic flowing pleated floor-length maxi skirt.',
    productIds: ['p-11', 'p-12', 'p-4'],
  },
];

// Depth stops from d = -1 (leaving past the rail) to d = 5 (arriving out of the haze)
const KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085];
const KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59];
const KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19];
const KB = [0, 0, 1.5, 4, 8, 12, 17];
const KO = [1, 1, 1, 1, 0.86, 0.5, 0];

const N = LOOKS.length;
const wrap = (x: number, n: number) => ((x % n) + n) % n;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

interface ChatMsg {
  id: string;
  sender: 'client' | 'atelier';
  text: string;
}

export const RunwayLookbook: React.FC = () => {
  const {
    openBooking,
    curatedPieces,
    toggleCuratePiece,
    showToast,
    activeSilhouette,
    setActiveSilhouette,
    activeDrapeScore,
    setActiveDrapeScore,
    addToCart,
  } = useAtelier();

  // Container refs
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const rollRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Model element refs
  const modelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Motion and interaction state stored in refs for 60fps RAF loop
  const pRef = useRef(0);
  const targetRef = useRef(0);
  const lastTimeRef = useRef(0);
  const dirtyRef = useRef(true);
  const WRef = useRef(0);
  const HRef = useRef(0);
  const baseRef = useRef(0);
  const sideRef = useRef(false);
  const calmRef = useRef(false);

  // Pointer dragging refs
  const mxRef = useRef(0);
  const myRef = useRef(0);
  const cxRef = useRef(0);
  const cyRef = useRef(0);
  const downRef = useRef(false);
  const sxRef = useRef(0);
  const stRef = useRef(0);
  const movedRef = useRef(0);
  const wheelTimerRef = useRef<number | null>(null);

  // Atelier concierge interactive state
  const [suiteMinimized, setSuiteMinimized] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'm-1',
      sender: 'client',
      text: 'Tailor an effortless Sera.ji silhouette in pure Italian mulberry silk and washed Belgian linen.',
    },
    {
      id: 'm-2',
      sender: 'atelier',
      text: 'Curating a handpicked Sera.ji silhouette with relaxed architectural drapes, natural raw textures, and quiet luxury. Every piece is handpicked, polished, and quietly elevated.',
    },
    {
      id: 'm-3',
      sender: 'client',
      text: 'Push it further: more formal soirée, handpicked lapel.',
    },
    {
      id: 'm-4',
      sender: 'atelier',
      text: 'Refining the cut into a formal Sera.ji evening drape — sculpted shoulder lines, handpicked silk lapels, and hand-embroidered artisanal detailing. Crafted for lasting poise and Mediterranean grace.',
    },
  ]);

  const promptPresets = [
    'Handpicked Riviera Lapel',
    'Bias-Cut Evening Charmeuse',
    'Sera.ji Washed Linen Trench',
  ];

  const [pState, setPState] = useState(0);
  const [isAddingBundle, setIsAddingBundle] = useState(false);
  const [pickingKey, setPickingKey] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const activeIdx = wrap(Math.round(pState), N);
  const currentLook = FEMALE_LOOKS[activeIdx];
  const currentProducts = currentLook.productIds
    .map((id) => ITEMS.find((item) => item.id === id))
    .filter(Boolean) as ItemData[];

  const parsePrice = (priceStr: string) =>
    parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  const bundleOriginalPrice = currentProducts.reduce(
    (sum, item) => sum + parsePrice(item.price),
    0
  );
  const bundleDiscountedPrice = bundleOriginalPrice * 0.9;

  const jumpToLook = (idx: number) => {
    let d = (idx - activeIdx) % N;
    if (d > 3) d -= 6;
    else if (d < -3) d += 6;
    targetRef.current = Math.round(targetRef.current) + d;
  };

  const handleAddFullLook = () => {
    setIsAddingBundle(true);
    setTimeout(() => {
      setIsAddingBundle(false);
      addToCart(currentProducts.length);
      currentProducts.forEach((_, itemIdx) => {
        setAddedItems((prev) => ({ ...prev, [`${activeIdx}-${itemIdx}`]: true }));
      });
      showToast(
        `Look ${currentLook.numStr}: ${currentLook.name} (3 pieces) added to bag (10% discount) ✓`,
        'gold'
      );
    }, 400);
  };

  // Sizing calculation
  const updateSize = useCallback(() => {
    const stage = stageRef.current;
    const rail = railRef.current;
    if (!stage || !rail) return;

    const W = stage.clientWidth;
    const H = stage.clientHeight;
    WRef.current = W;
    HRef.current = H;
    const base = H * 1.2;
    baseRef.current = base;
    const side = window.innerWidth <= 820;
    sideRef.current = side;

    LOOKS.forEach(([a, b], i) => {
      const el = modelRefs.current[i];
      if (el) {
        const r = (b - a) / (Y1 - Y0);
        el.style.width = `${base * r}px`;
        el.style.height = `${base}px`;
      }
    });

    dirtyRef.current = true;
  }, []);

  // Painting depth table
  const paint = useCallback(() => {
    const W = WRef.current;
    const H = HRef.current;
    const base = baseRef.current;
    const p = pRef.current;

    // Paint Models
    LOOKS.forEach(([a, b], i) => {
      const el = modelRefs.current[i];
      if (!el) return;
      const r = (b - a) / (Y1 - Y0);
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

      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
      const f = mix(KB) / s;
      el.style.filter = f < 0.2 ? 'none' : `blur(${f.toFixed(1)}px)`;
      el.style.opacity = mix(KO).toFixed(3);
      el.style.zIndex = String(100 - Math.round(d * 10));
    });

    // Paint Rolling Look Number
    const roll = rollRef.current;
    if (roll && roll.firstChild) {
      const rollHeight = (roll.firstChild as HTMLElement).offsetHeight || 38;
      roll.style.transform = `translate3d(0,${(-wrap(p, N) * rollHeight).toFixed(1)}px,0)`;
    }
  }, []);

  // RAF loop
  useEffect(() => {
    calmRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    updateSize();

    let animId: number;
    const loop = (now: number) => {
      const dt = Math.min(50, now - lastTimeRef.current) || 16;
      lastTimeRef.current = now;

      const was = pRef.current;
      const target = targetRef.current;
      if (calmRef.current) {
        pRef.current = target;
      } else {
        pRef.current += (target - pRef.current) * (1 - Math.exp(-dt * 0.0072));
      }

      if (Math.abs(target - pRef.current) < 0.0004) {
        pRef.current = target;
      }

      if (pRef.current !== was || dirtyRef.current) {
        dirtyRef.current = false;
        paint();
        setPState(pRef.current);
      }

      // Cursor ring follow
      cxRef.current += (mxRef.current - cxRef.current) * 0.32;
      cyRef.current += (myRef.current - cyRef.current) * 0.32;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cxRef.current.toFixed(1)}px,${cyRef.current.toFixed(1)}px,0)`;
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
    if (target.closest('a') || target.closest('button') || target.closest('.runway-atelier-glass')) {
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

  const handleRelease = (e: React.PointerEvent) => {
    if (!downRef.current) return;
    downRef.current = false;
    if (ringRef.current) ringRef.current.classList.remove('drag');

    if (movedRef.current < 6) {
      const hit = document.elementsFromPoint(e.clientX, e.clientY).find(
        (x) => x.classList && x.classList.contains('m')
      ) as HTMLElement | undefined;
      if (hit && hit.dataset.i !== undefined) {
        let d = wrap(+hit.dataset.i - targetRef.current, N);
        d = Math.round(d);
        if (d > 0 && d < N) targetRef.current = Math.round(targetRef.current) + d;
      }
    } else {
      targetRef.current = Math.round(targetRef.current);
    }
  };

  // Wheel handling with debounced snapping
  const handleWheel = (e: React.WheelEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.runway-chat-scroll')) return;

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

  // Curate item toggle
  const handleToggleFavorite = (item: ItemData, e: React.MouseEvent) => {
    e.stopPropagation();
    const piece: CapsulePiece = {
      id: item.id,
      title: item.name,
      subtitle: 'Sera.ji Runway Piece',
      image: PIECES,
      status: 'ready',
      tag: 'Runway Look',
      price: item.price,
      details: ['Pure Como silk weave', 'Hand-tailored precision', 'Every piece handpicked'],
    };
    toggleCuratePiece(piece);
  };

  const isItemSaved = (id: string) => curatedPieces.some((p) => p.id === id);

  // Interactive AI prompt submission
  const handlePromptSubmit = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    const userMsg: ChatMsg = {
      id: `p-${Date.now()}`,
      sender: 'client',
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setCustomPrompt('');
    setIsProcessing(true);

    try {
      const response = await api.queryAtelierAi(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'atelier',
          text: response.reply,
        },
      ]);
      setActiveSilhouette(response.silhouette);
      setActiveDrapeScore(response.drapeScore);
      showToast(`Cut refined: ${response.silhouette} (${response.drapeScore}%)`, 'gold');
    } catch {
      let reply = `Refining ${text} with pure Como mulberry silk weave. Handpicked precision & poise elevated.`;
      let silhouette = 'Sera.ji Riviera Silhouette';
      let drape = 96;
      if (text.toLowerCase().includes('lapel')) {
        silhouette = 'Sera.ji Riviera Peak Lapel';
        reply = 'Refining architectural lapels with 450GSM hand-embroidered silk lining and relaxed Italian cut.';
        drape = 97;
      } else if (text.toLowerCase().includes('charmeuse')) {
        silhouette = 'Sera.ji Bias-Cut Charmeuse Drape';
        reply = 'Fluid evening silhouette sculpted along natural bias grain. Pure grade-6A Como mulberry silk.';
        drape = 98;
      } else if (text.toLowerCase().includes('linen')) {
        silhouette = 'Sera.ji Washed Linen Trench Cut';
        reply = 'Raw-textured washed Belgian linen with unstructured shoulders and double-faced storm flap.';
        drape = 95;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'atelier',
          text: reply,
        },
      ]);
      setActiveSilhouette(silhouette);
      setActiveDrapeScore(drape);
      showToast(`Cut refined: ${silhouette}`, 'gold');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="runway-hero-container">
      <main className="runway-main">
        {/* RUNWAY STAGE */}
        <section
          ref={stageRef}
          className="stage runway-stage"
          id="stage"
          tabIndex={0}
          aria-label="Runway looks. Drag, scroll or use arrow keys to change look."
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handleRelease}
          onPointerCancel={handleRelease}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
        >
          {/* Models Line */}
          <div className="line" id="line">
            {LOOKS.map(([a, b], i) => (
              <div
                key={i}
                className="m"
                data-i={i}
                ref={(el) => {
                  modelRefs.current[i] = el;
                }}
              >
                <svg
                  viewBox={`${a} ${Y0} ${b - a} ${Y1 - Y0}`}
                  aria-hidden="true"
                  style={{ width: '100%', height: '100%', display: 'block' }}
                >
                  <svg x={a} y={Y0} width={b - a} height={Y1 - Y0} viewBox={`${a} ${Y0} ${b - a} ${Y1 - Y0}`}>
                    <image href={MODELS} width={960} height={540} />
                  </svg>
                </svg>
              </div>
            ))}
          </div>

          {/* SERA.JI HANDPICKED ATELIER CONCIERGE GLASS CARD */}
          <div className={`runway-atelier-glass ${suiteMinimized ? 'minimized' : ''}`}>
            {/* Header */}
            <div className="glass-header">
              <div className="atelier-brand-pill wide">
                <span className="pulse-dot" />
                <span>Sera.ji Handpicked Atelier</span>
              </div>
              <button
                className="toggle-mini-btn wide"
                type="button"
                onClick={() => setSuiteMinimized(!suiteMinimized)}
                title={suiteMinimized ? 'Expand Atelier Concierge' : 'Minimize to focus on runway'}
              >
                {suiteMinimized ? 'Expand Concierge' : 'Minimize'}
              </button>
            </div>

            {!suiteMinimized && (
              <>
                {/* Dialogue stream */}
                <div className="runway-chat-scroll">
                  {messages.map((m) =>
                    m.sender === 'client' ? (
                      <div key={m.id} className="chat-bubble-client">
                        {m.text}
                      </div>
                    ) : (
                      <div key={m.id} className="chat-bubble-ai">
                        <div className="ai-icon-mini">
                          <svg viewBox="0 0 40 40" width="14" height="14" fill="#2a1a12">
                            <path d="M5 5h13v13H5zM22 22h13v13H22z" />
                            <path d="M22 5a13 13 0 0 1 13 13H22zM18 35A13 13 0 0 1 5 22h13z" />
                          </svg>
                        </div>
                        <p>{m.text}</p>
                      </div>
                    )
                  )}
                  {isProcessing && (
                    <div className="chat-bubble-ai typing">
                      <span className="dot-flashing" />
                    </div>
                  )}
                </div>

                {/* Specification card with Order Now */}
                <div className="runway-spec-card">
                  <div className="spec-eyebrow wide">SERA.JI CLOTHING SPECIFICATION</div>
                  <div className="spec-row">
                    <span className="spec-silhouette-name">{activeSilhouette}</span>
                    <button
                      className="btn-order-now wide"
                      type="button"
                      onClick={() => openBooking('runway-fitting')}
                      title="Reserve your private fitting and order this cut"
                    >
                      Order Now
                    </button>
                  </div>
                  <div className="spec-metric-wrap">
                    <span className="spec-metric-label">
                      Handpicked precision &amp; poise ({activeDrapeScore}%)
                    </span>
                    <div className="spec-metric-track">
                      <div className="spec-metric-bar" style={{ width: `${activeDrapeScore}%` }} />
                    </div>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="runway-presets-row">
                  {promptPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className="chip-action-btn"
                      onClick={() => handlePromptSubmit(preset)}
                      disabled={isProcessing}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* Direct Request Input */}
                <form
                  className="runway-prompt-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePromptSubmit(customPrompt);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Direct request to Sera.ji Master Draper (every piece is handpicked)..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    disabled={isProcessing}
                  />
                  <button type="submit" disabled={isProcessing || !customPrompt.trim()} aria-label="Send prompt">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              </>
            )}

            {suiteMinimized && (
              <div className="minimized-info">
                <span className="min-sil">{activeSilhouette}</span>
                <button
                  className="btn-order-now-mini wide"
                  type="button"
                  onClick={() => openBooking('runway-fitting')}
                >
                  Order Now
                </button>
              </div>
            )}
          </div>

          {/* Complete the Look Card (Positioned in Bottom-Left of Main Runway Area) */}
          <div className="ttl-runway-bundle-card">
            <div className="ttl-bundle-row">
              <div>
                <div className="ttl-bundle-title">Complete the look</div>
                <div className="ttl-bundle-note">Bundle all 3 and save 10%</div>
              </div>
              <div className="ttl-bundle-pricing">
                <s>${bundleOriginalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</s>
                <strong>${bundleDiscountedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
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
                  {FEMALE_LOOKS.map((look) => (
                    <b key={look.index}>{look.numStr}</b>
                  ))}
                  <b>15</b>
                </span>
              </span>
            </div>

            {/* Segmented Ticks */}
            <div className="ttl-ticks-group">
              {FEMALE_LOOKS.map((look, i) => (
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
          <div className="ring" ref={ringRef} id="ring" />
        </section>

        {/* PRODUCT RAIL - Exactly Three Product Cards, No Header */}
        <aside className="rail runway-rail" aria-label="Pieces in this look">
          <div className="ttl-cards-track" aria-label="Curated pieces for this look">
            {currentProducts.map((item, itemIdx) => {
              const isSaved = isItemSaved(item.id);
              const rowKey = `${activeIdx}-${itemIdx}`;
              const isPicking = pickingKey === rowKey;
              const isAdded = !!addedItems[rowKey];
              const sizes = ['36', '38', '40', '42'];
              const chosenSize = selectedSizes[rowKey] || sizes[0];

              return (
                <article
                  key={item.id}
                  className={`card runway-card ttl-runway-card ${itemIdx % 2 ? 'alt' : ''}`}
                >
                  <button
                    className="fav"
                    type="button"
                    aria-pressed={isSaved}
                    aria-label={`Save ${item.name}`}
                    onClick={(e) => handleToggleFavorite(item, e)}
                    title={isSaved ? 'Saved in Trunk Show' : 'Add to Trunk Show'}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.600 4.600 0 0 1 20.500 9C20.500 15 12 20 12 20Z" />
                    </svg>
                  </button>

                  <span className="shot">
                    <svg
                      viewBox={`${item.x0} ${item.y0} ${item.x1 - item.x0} ${item.y1 - item.y0}`}
                      aria-hidden="true"
                      style={{ width: '100%', height: '100%', display: 'block' }}
                    >
                      <svg
                        x={item.x0}
                        y={item.y0}
                        width={item.x1 - item.x0}
                        height={item.y1 - item.y0}
                        viewBox={`${item.x0} ${item.y0} ${item.x1 - item.x0} ${item.y1 - item.y0}`}
                      >
                        <image href={PIECES} width={960} height={720} />
                      </svg>
                    </svg>
                    <span className="ttl-card-badge" title={`Piece ${itemIdx + 1}`}>
                      {itemIdx + 1}
                    </span>
                  </span>

                  <div className="meta">
                    <div>
                      <span className="ttl-vendor-tag">SERA.JI ATELIER</span>
                      <h3 className="wide">{item.name}</h3>
                      <span>{item.price}</span>
                    </div>

                    <button
                      className={`add ${isPicking ? 'picking' : ''} ${isAdded ? 'added' : ''}`}
                      type="button"
                      aria-label={`Select size for ${item.name}`}
                      onClick={() => {
                        if (!isAdded) {
                          setPickingKey(isPicking ? null : rowKey);
                        }
                      }}
                      title={isPicking ? 'Close size picker' : 'Select size and add to bag'}
                    />
                  </div>

                  {/* Size Picker Pills & Add to Bag */}
                  {isPicking && (
                    <div className="ttl-picker-box">
                      <div className="ttl-picker-header">
                        <span className="ttl-picker-legend">Atelier Size</span>
                        <span className="ttl-picker-selected">
                          Selected: <b>IT {chosenSize}</b>
                        </span>
                      </div>

                      <div className="ttl-pills-row">
                        {sizes.map((s) => (
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
                        onClick={() => {
                          addToCart(1);
                          setAddedItems((prev) => ({ ...prev, [rowKey]: true }));
                          setPickingKey(null);
                          showToast(`Added ${item.name} (IT ${chosenSize}) to bag ✓`, 'gold');
                        }}
                      >
                        <span>Add to bag</span>
                        <span>·</span>
                        <span>{item.price}</span>
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </aside>
      </main>
    </div>
  );
};
