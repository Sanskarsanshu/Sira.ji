import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';
import type { CapsulePiece } from '../types';
import {
  WARDROBE_PRODUCTS,
  RAIL_CATEGORIES,
  type WardrobeProduct,
  type RailCategory,
} from '../data/wardrobeProducts';

export type { WardrobeProduct, RailCategory };

export interface WardrobeLibraryProps {
  selectedRailIndex?: number | null;
}

const FILTER_CHIPS: { label: string; value: string }[] = [
  { label: 'All pieces (80)', value: 'All' },
  { label: 'Oversized T-Shirts (8)', value: 'Oversized T-Shirts' },
  { label: 'Jerseys (8)', value: 'Jerseys' },
  { label: 'Shirts (8)', value: 'Shirts' },
  { label: 'Cardigans (8)', value: 'Cardigans' },
  { label: 'Hoodies (8)', value: 'Hoodies' },
  { label: 'Crewnecks (8)', value: 'Crewnecks' },
  { label: 'Polo T-Shirts (8)', value: 'Polo T-Shirts' },
  { label: 'Henleys & Long Sleeves (8)', value: 'Henleys & Long Sleeves' },
  { label: 'Knitwear & Sweaters (8)', value: 'Knitwear & Sweaters' },
  { label: 'Classic T-Shirts (8)', value: 'Classic T-Shirts' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

const formatInr = (n: number) => `₹${Number(n).toLocaleString('en-IN')}`;

const renderStars = (rating: number) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
};

export const WardrobeLibrary: React.FC<WardrobeLibraryProps> = ({ selectedRailIndex }) => {
  const {
    addToCart,
    openCurationDrawer,
    toggleCuratePiece,
    isPieceCurated,
    showToast,
  } = useAtelier();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'low' | 'high' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<WardrobeProduct | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [localSavedIds, setLocalSavedIds] = useState<Set<number>>(() => new Set());

  // Dynamically update suggestions based on which cloth the user clicks/chooses on the rail
  useEffect(() => {
    if (
      selectedRailIndex !== null &&
      selectedRailIndex !== undefined &&
      selectedRailIndex >= 0 &&
      selectedRailIndex < RAIL_CATEGORIES.length
    ) {
      const targetCategory = RAIL_CATEGORIES[selectedRailIndex];
      setActiveFilter(targetCategory);
      setSelectedProduct(null); // return to catalog view showing matching products
    }
  }, [selectedRailIndex]);

  const toCapsulePiece = (p: WardrobeProduct): CapsulePiece => ({
    id: `wardrobe-${p.id}`,
    title: p.name,
    subtitle: `${p.brand} · ${p.category}`,
    image: p.image,
    status: 'ready',
    tag: p.tag,
    price: formatInr(p.price),
    details: p.about,
    fabricSpecs: {
      momme: 22,
      weave: p.material,
      origin: `${p.brand} Studio`,
      composition: p.material,
    },
  });

  const isSaved = (p: WardrobeProduct) =>
    localSavedIds.has(p.id) || isPieceCurated(`wardrobe-${p.id}`);

  const handleToggleWish = (p: WardrobeProduct, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const currentlySaved = isSaved(p);
    setLocalSavedIds((prev) => {
      const next = new Set(prev);
      if (currentlySaved) next.delete(p.id);
      else next.add(p.id);
      return next;
    });
    toggleCuratePiece(toCapsulePiece(p));
    showToast(
      currentlySaved
        ? `Removed ${p.name} from Wish List`
        : `Saved ${p.name} to Wish List ♥`,
      'gold',
    );
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = WARDROBE_PRODUCTS.filter((p) => {
      const matchesFilter =
        activeFilter === 'All' ||
        p.gender === activeFilter ||
        p.category === activeFilter;
      const matchesSearch =
        !q ||
        `${p.brand} ${p.name} ${p.category} ${p.gender} ${p.color} ${p.material} ${p.fit}`
          .toLowerCase()
          .includes(q);
      return matchesFilter && matchesSearch;
    });

    if (sortBy === 'low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'high') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeFilter, searchQuery, sortBy]);

  const recommendations = useMemo(() => {
    if (!selectedProduct) return [];
    // Prioritize products from the same category
    const sameCat = WARDROBE_PRODUCTS.filter(
      (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id,
    );
    if (sameCat.length >= 5) return sameCat.slice(0, 5);
    const others = WARDROBE_PRODUCTS.filter(
      (p) => p.category !== selectedProduct.category && p.id !== selectedProduct.id,
    );
    return [...sameCat, ...others].slice(0, 5);
  }, [selectedProduct]);

  const scrollToLibraryTop = () => {
    if (!rootRef.current) return;
    const scroller = rootRef.current.closest('[data-rail-scroll]') as HTMLElement | null;
    if (scroller) {
      scroller.scrollTo({ top: Math.max(0, rootRef.current.offsetTop - 48), behavior: 'smooth' });
      return;
    }
    const rect = rootRef.current.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - 92;
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
  };

  const openProduct = (product: WardrobeProduct) => {
    setSelectedProduct(product);
    setActiveImageIdx(0);
    setSelectedSize('M');
    setQuantity(1);
    scrollToLibraryTop();
  };

  const backToCatalog = () => {
    setSelectedProduct(null);
    scrollToLibraryTop();
  };

  const handleAddToCart = (product: WardrobeProduct, qty = 1) => {
    addToCart(qty);
    if (!isPieceCurated(`wardrobe-${product.id}`)) {
      toggleCuratePiece(toCapsulePiece(product));
    }
    showToast(`${qty} × ${product.name} added to your bag ✓`, 'gold');
  };

  const handleBuyNow = (product: WardrobeProduct, qty = 1) => {
    handleAddToCart(product, qty);
    openCurationDrawer();
  };

  const handleShare = (product: WardrobeProduct) => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard ✓', 'gold');
    } else {
      showToast('Share is ready for this wardrobe piece.', 'gold');
    }
  };

  return (
    <div
      ref={rootRef}
      data-slot="wardrobe-library"
      className="sera-shelf-scope animate-in fade-in mx-auto mt-6 w-full max-w-[1260px] border-t border-[#2a1a12]/10 pt-8 font-sans text-[#2a1a12] [animation-duration:420ms]"
    >
      {/* CATALOG VIEW */}
      {!selectedProduct ? (
        <div className="catalog-view">
          <div className="mb-6 flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold tracking-[0.22em] text-[#8c6548] uppercase">
                {activeFilter === 'All'
                  ? 'The Clothing Library · 80 Archive Pieces'
                  : `The Clothing Library · ${activeFilter}`}
              </span>
              {selectedRailIndex !== null &&
                selectedRailIndex !== undefined &&
                selectedRailIndex >= 0 &&
                selectedRailIndex < RAIL_CATEGORIES.length && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2a1a12]/15 bg-white/80 px-2.5 py-0.5 text-[10.5px] font-medium text-[#2a1a12]">
                    <span className="size-1.5 rounded-full bg-[#8c6548] animate-pulse" />
                    Suggested for Rail Piece {selectedRailIndex + 1}
                  </span>
                )}
            </div>
            <h3 className="text-2xl font-medium tracking-[-0.02em] text-[#2a1a12] sm:text-[32px]">
              {activeFilter === 'All' ? (
                <>
                  Find your next <span className="lt">favourite.</span>
                </>
              ) : (
                <>
                  Curated for <span className="lt">{activeFilter}</span>
                </>
              )}
            </h3>
            <p className="max-w-[68ch] text-[14px] leading-relaxed text-[#6f5f53]">
              {activeFilter === 'All'
                ? 'A considered edit of 80 archive essentials, statement layers and timeless wardrobe pieces across 10 distinct categories curated to complement the studio rail.'
                : `Showing all 8 archive pieces in ${activeFilter}, tailored with exceptional materials and artisan finishes to match your selected rail look.`}
            </p>
          </div>

          {/* Filter Chips + Search & Sort Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3.5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter clothing library">
              {FILTER_CHIPS.map((chip) => {
                const active = activeFilter === chip.value;
                return (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => setActiveFilter(chip.value)}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-[12px] font-medium transition-all duration-200 ${
                      active
                        ? 'border-[#2a1a12] bg-[#2a1a12] text-[#fbf7f1] shadow-[0_8px_20px_-10px_rgba(42,26,18,0.45)]'
                        : 'border-[#2a1a12]/12 bg-[#fffdf9]/85 text-[#5b4a3f] hover:border-[#2a1a12]/35 hover:text-[#2a1a12]'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
              <div className="relative min-w-[220px] flex-1 sm:w-[240px] sm:flex-initial">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-[#7a6a5e]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search the collection..."
                  aria-label="Search products"
                  className="w-full rounded-full border border-[#2a1a12]/14 bg-[#fffdf9]/90 py-2 pl-9 pr-4 text-[12.5px] text-[#2a1a12] placeholder:text-[#8c7c70] outline-none transition-all focus:border-[#2a1a12] focus:bg-white"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort products"
                className="cursor-pointer rounded-full border border-[#2a1a12]/14 bg-[#fffdf9]/90 px-4 py-2 text-[12.5px] font-medium text-[#4a3b31] outline-none transition-colors hover:border-[#2a1a12]/35 focus:border-[#2a1a12]"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>

          <div className="mb-4 text-[12px] font-medium text-[#7a6a5e]">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
          </div>

          {/* 4-Column Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((p) => {
                const saved = isSaved(p);
                return (
                  <article
                    key={p.id}
                    tabIndex={0}
                    onClick={() => openProduct(p)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openProduct(p);
                      }
                    }}
                    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[20px] border border-white/90 bg-[#fffdf9]/90 shadow-[0_14px_34px_-22px_rgba(42,26,18,0.16)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-22px_rgba(42,26,18,0.26)]"
                  >
                    <div className="relative h-[265px] w-full overflow-hidden bg-[#efe8dd]">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-white/80 bg-[#fffdf9]/92 px-2.5 py-1 text-[9.5px] font-semibold tracking-[0.08em] text-[#3b2116] uppercase backdrop-blur-md">
                        {p.tag}
                      </span>
                      <button
                        type="button"
                        aria-label={`Save ${p.name}`}
                        onClick={(e) => handleToggleWish(p, e)}
                        className={`absolute right-3 top-3 grid size-8 cursor-pointer place-items-center rounded-full border transition-all duration-200 ${
                          saved
                            ? 'border-[#2a1a12] bg-[#2a1a12] text-[#fbf7f1]'
                            : 'border-white/80 bg-[#fffdf9]/90 text-[#4a3b31] hover:bg-white'
                        }`}
                      >
                        <Heart
                          className="size-3.5"
                          fill={saved ? 'currentColor' : 'none'}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <div className="mb-1 text-[10px] font-bold tracking-[0.12em] text-[#8c7a6b] uppercase">
                          {p.brand}
                        </div>
                        <h4 className="mb-1.5 line-clamp-2 min-h-[36px] text-[13.5px] font-semibold leading-snug text-[#2a1a12]">
                          {p.name}
                        </h4>
                        <div className="mb-2 flex items-center gap-1.5 text-[11.5px] text-[#b87d3b]">
                          <span>{renderStars(p.rating)}</span>
                          <span className="text-[#7a6a5e]">
                            {p.rating} ({p.reviews})
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-[16px] font-bold text-[#2a1a12]">
                            {formatInr(p.price)}
                          </span>
                          <span className="text-[11.5px] text-[#8c7c70] line-through">
                            {formatInr(p.mrp)}
                          </span>
                          <span className="rounded-full bg-[#168044]/10 px-2 py-0.5 text-[10.5px] font-bold text-[#168044]">
                            {p.discount}% off
                          </span>
                        </div>
                        <div className="mt-2 text-[10.5px] text-[#6f5f53]">
                          FREE delivery on eligible orders
                        </div>
                        <div className="mt-0.5 text-[10.5px] font-medium text-[#9e332e]">
                          Limited-time library edit
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#2a1a12]/10 bg-[#fffdf9]/75 px-6 py-12 text-center text-[14px] text-[#6f5f53]">
              No pieces match your search. Try another keyword or category.
            </div>
          )}
        </div>
      ) : (
        /* DETAIL VIEW */
        <div className="detail-view animate-in fade-in [animation-duration:320ms]">
          {/* Breadcrumb Bar */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-[12.5px] text-[#6f5f53]">
            <button
              type="button"
              onClick={backToCatalog}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#2a1a12]/15 bg-[#fffdf9] px-3.5 py-1.5 font-medium text-[#2a1a12] shadow-2xs transition-all hover:-translate-x-0.5 hover:bg-[#2a1a12] hover:text-[#fbf7f1]"
            >
              <ArrowLeft className="size-3.5" strokeWidth={1.8} />
              <span>Back to clothing library</span>
            </button>
            <ChevronRight className="size-3.5 text-[#9c8c80]" />
            <span>{selectedProduct.category}</span>
            <ChevronRight className="size-3.5 text-[#9c8c80]" />
            <span className="font-medium text-[#2a1a12]">{selectedProduct.name}</span>
          </div>

          {/* 3-Column Detail Layout */}
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,1fr)_290px]">
            {/* Column 1: Multi-Angle Gallery */}
            <div className="grid grid-cols-[60px_minmax(0,1fr)] gap-3 sm:grid-cols-[68px_minmax(0,1fr)] lg:sticky lg:top-24">
              <div className="flex flex-col gap-2.5">
                {selectedProduct.images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveImageIdx(i)}
                    className={`h-[74px] cursor-pointer overflow-hidden rounded-xl border p-0.5 transition-all ${
                      activeImageIdx === i
                        ? 'border-2 border-[#2a1a12] bg-white shadow-sm'
                        : 'border-[#2a1a12]/15 bg-[#fffdf9]/80 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${selectedProduct.name} view ${i + 1}`}
                      className="h-full w-full rounded-[9px] object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="relative grid h-[420px] place-items-center overflow-hidden rounded-[22px] border border-white/90 bg-[#efe8dd] sm:h-[540px]">
                <img
                  src={selectedProduct.images[activeImageIdx] ?? selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label="Share product"
                  onClick={() => handleShare(selectedProduct)}
                  className="absolute right-3.5 top-3.5 grid size-10 cursor-pointer place-items-center rounded-full border border-white/85 bg-[#fffdf9]/90 text-[#2a1a12] shadow-md backdrop-blur-md transition-transform hover:scale-105"
                >
                  <Share2 className="size-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {/* Column 2: Product Copy, Offers, Options & Specs */}
            <div className="flex flex-col rounded-[24px] border border-white/85 bg-[#fffdf9]/85 p-5 shadow-[0_16px_40px_-24px_rgba(42,26,18,0.16)] backdrop-blur-xl sm:p-7">
              <span className="mb-1.5 text-[11px] font-bold tracking-[0.16em] text-[#8c6548] uppercase">
                Visit the {selectedProduct.brand} Studio
              </span>
              <h2 className="mb-2.5 text-xl font-medium leading-snug tracking-[-0.015em] text-[#2a1a12] sm:text-2xl">
                {selectedProduct.name} | {selectedProduct.brand} Everyday Collection
              </h2>

              <div className="flex items-center gap-2 border-b border-[#2a1a12]/10 pb-3 text-[13px] text-[#b87d3b]">
                <span>{renderStars(selectedProduct.rating)}</span>
                <span className="font-semibold text-[#2a1a12]">{selectedProduct.rating}</span>
                <span className="text-[#6f5f53]">({selectedProduct.reviews} verified ratings)</span>
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-light text-[#9e332e]">
                  -{selectedProduct.discount}%
                </span>
                <strong className="text-[28px] font-semibold text-[#2a1a12]">
                  {formatInr(selectedProduct.price)}
                </strong>
              </div>
              <div className="mt-0.5 text-[12px] text-[#7a6a5e]">
                M.R.P.: <s className="line-through">{formatInr(selectedProduct.mrp)}</s>
              </div>
              <div className="mt-1 text-[12.5px] font-medium text-[#5b4a3f]">
                Inclusive of all taxes
              </div>

              {/* Offers */}
              <div className="mt-5">
                <div className="mb-2.5 flex items-center gap-1.5 text-[12.5px] font-bold text-[#2a1a12]">
                  <Sparkles className="size-3.5 text-[#8c6548]" />
                  <span>Atelier &amp; Partner Offers</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#2a1a12]/10 bg-[#faf5ec]/90 p-3 text-[11px] leading-relaxed text-[#5b4a3f]">
                    <b className="mb-1 block text-[12px] text-[#2a1a12]">Bank Offer</b>
                    Save extra on selected bank cards and eligible purchases.
                  </div>
                  <div className="rounded-xl border border-[#2a1a12]/10 bg-[#faf5ec]/90 p-3 text-[11px] leading-relaxed text-[#5b4a3f]">
                    <b className="mb-1 block text-[12px] text-[#2a1a12]">Partner Offers</b>
                    Explore payment and partner benefits at checkout.
                  </div>
                  <div className="rounded-xl border border-[#2a1a12]/10 bg-[#faf5ec]/90 p-3 text-[11px] leading-relaxed text-[#5b4a3f]">
                    <b className="mb-1 block text-[12px] text-[#2a1a12]">Special Price</b>
                    Limited-time pricing on this selected wardrobe piece.
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="my-5 grid grid-cols-4 gap-2 border-y border-[#2a1a12]/10 py-4 text-center text-[10.5px] font-medium text-[#5b4a3f]">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="grid size-8 place-items-center rounded-full bg-[#f3ece1] text-[#2a1a12]">
                    <RotateCcw className="size-3.5" />
                  </span>
                  <span>Easy returns</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="grid size-8 place-items-center rounded-full bg-[#f3ece1] text-[#2a1a12]">
                    <ShieldCheck className="size-3.5" />
                  </span>
                  <span>Secure pay</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="grid size-8 place-items-center rounded-full bg-[#f3ece1] text-[#2a1a12]">
                    <Truck className="size-3.5" />
                  </span>
                  <span>Free delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="grid size-8 place-items-center rounded-full bg-[#f3ece1] text-[#2a1a12]">
                    <Star className="size-3.5" />
                  </span>
                  <span>Quality edit</span>
                </div>
              </div>

              {/* Colour & Swatches */}
              <div className="mb-2 text-[12.5px] text-[#5b4a3f]">
                Colour: <b className="text-[#2a1a12]">{selectedProduct.color}</b>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedProduct.images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-[72px] cursor-pointer overflow-hidden rounded-xl border p-1 text-center text-[10px] transition-all ${
                      activeImageIdx === i
                        ? 'border-2 border-[#2a1a12] bg-white font-semibold text-[#2a1a12]'
                        : 'border-[#2a1a12]/15 bg-[#faf5ec] text-[#6f5f53]'
                    }`}
                  >
                    <img
                      src={src}
                      alt={`View ${i + 1}`}
                      className="mb-1 h-12 w-full rounded-lg object-cover"
                    />
                    <span>View {i + 1}</span>
                  </button>
                ))}
              </div>

              {/* Size Selector */}
              <div className="mb-2 text-[12.5px] text-[#5b4a3f]">
                Size: <b className="text-[#2a1a12]">{selectedSize}</b>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((sz) => {
                  const active = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`h-9 min-w-[44px] cursor-pointer rounded-xl border px-3 text-[12px] font-medium transition-all ${
                        active
                          ? 'border-2 border-[#2a1a12] bg-[#2a1a12] font-semibold text-[#fbf7f1]'
                          : 'border-[#2a1a12]/15 bg-white text-[#2a1a12] hover:border-[#2a1a12]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {/* Product Details Table */}
              <div className="mt-6 border-t border-[#2a1a12]/10 pt-4">
                <h3 className="mb-3 text-[15px] font-semibold text-[#2a1a12]">Product details</h3>
                <div className="grid grid-cols-1 gap-y-2 text-[12.5px]">
                  {[
                    ['Material composition', selectedProduct.material],
                    ['Sleeve type', selectedProduct.sleeve],
                    ['Fit type', selectedProduct.fit],
                    ['Neck style', selectedProduct.neck],
                    ['Care instructions', 'Machine wash cold, gentle cycle'],
                    ['Country of origin', 'Designed for everyday wear'],
                  ].map(([label, val]) => (
                    <div key={label} className="grid grid-cols-[44%_56%] gap-2 py-0.5">
                      <b className="font-semibold text-[#4a3b31]">{label}</b>
                      <span className="text-[#6f5f53]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About This Item */}
              <div className="mt-5 border-t border-[#2a1a12]/10 pt-4 text-[13px] leading-relaxed text-[#5b4a3f]">
                <h3 className="mb-2 text-[15px] font-semibold text-[#2a1a12]">About this item</h3>
                <ul className="list-disc space-y-1.5 pl-4">
                  {selectedProduct.about.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 3: Sticky Acquisition Buy Box */}
            <aside className="rounded-[24px] border border-white/90 bg-[#fffdf9]/90 p-5 shadow-[0_18px_42px_-24px_rgba(42,26,18,0.2)] backdrop-blur-xl lg:sticky lg:top-24">
              <div className="mb-3 text-[28px] font-semibold text-[#2a1a12]">
                {formatInr(selectedProduct.price)}
              </div>
              <div className="mb-3 text-[12px] leading-relaxed text-[#5b4a3f]">
                FREE delivery <b className="text-[#2a1a12]">in 3–5 business days</b>
                <br />
                <span className="text-[#8c6548]">Delivering to your location</span>
              </div>
              <div className="my-3 flex items-center gap-1.5 text-[14px] font-semibold text-[#168044]">
                <Check className="size-4" strokeWidth={2.2} />
                <span>In stock</span>
              </div>

              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                aria-label="Select quantity"
                className="mb-3 w-full cursor-pointer rounded-xl border border-[#2a1a12]/15 bg-white px-3.5 py-2.5 text-[12.5px] font-medium text-[#2a1a12] outline-none focus:border-[#2a1a12]"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    Quantity: {n}
                  </option>
                ))}
              </select>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(selectedProduct, quantity)}
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#3b2116] px-5 text-[12.5px] font-semibold tracking-[0.05em] text-[#f6ede2] uppercase shadow-[0_12px_24px_-10px_rgba(59,33,22,0.5)] transition-all hover:-translate-y-0.5 hover:bg-[#2a1a12]"
                >
                  <ShoppingBag className="size-4" strokeWidth={1.75} />
                  <span>Add to bag</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBuyNow(selectedProduct, quantity)}
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full border border-[#2a1a12]/15 bg-[#e9dfd1] px-5 text-[12.5px] font-semibold tracking-[0.05em] text-[#2a1a12] uppercase transition-all hover:-translate-y-0.5 hover:bg-[#dfd1be]"
                >
                  Buy now
                </button>
              </div>

              <div className="my-4 space-y-1 border-y border-[#2a1a12]/10 py-3 text-[11.5px] text-[#6f5f53]">
                <div className="flex justify-between">
                  <span>Ships from</span>
                  <b className="font-medium text-[#2a1a12]">WARDROBE · Sera.ji</b>
                </div>
                <div className="flex justify-between">
                  <span>Sold by</span>
                  <b className="font-medium text-[#2a1a12]">{selectedProduct.brand} Studio</b>
                </div>
                <div className="flex justify-between">
                  <span>Payment</span>
                  <b className="font-medium text-[#2a1a12]">Secure checkout</b>
                </div>
                <div className="flex justify-between">
                  <span>Gift options</span>
                  <b className="font-medium text-[#2a1a12]">At checkout</b>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleWish(selectedProduct)}
                className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[12px] font-medium transition-all ${
                  isSaved(selectedProduct)
                    ? 'border-[#2a1a12] bg-[#2a1a12] text-[#fbf7f1]'
                    : 'border-[#2a1a12]/18 bg-white text-[#2a1a12] hover:border-[#2a1a12]'
                }`}
              >
                <Heart
                  className="size-3.5"
                  fill={isSaved(selectedProduct) ? 'currentColor' : 'none'}
                  strokeWidth={1.8}
                />
                <span>
                  {isSaved(selectedProduct) ? 'Added to Wish List' : 'Add to Wish List'}
                </span>
              </button>
            </aside>
          </div>

          {/* Customers Also Explored */}
          <div className="mt-10 border-t border-[#2a1a12]/10 pt-7">
            <h4 className="mb-4 text-[18px] font-medium tracking-[-0.01em] text-[#2a1a12]">
              Customers also explored
            </h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {recommendations.map((rec) => (
                <article
                  key={rec.id}
                  onClick={() => openProduct(rec)}
                  className="group cursor-pointer rounded-2xl border border-white/85 bg-[#fffdf9]/85 p-2.5 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="overflow-hidden rounded-xl bg-[#efe8dd]">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      loading="lazy"
                      className="h-[165px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-[12px] font-medium leading-snug text-[#4a3b31] group-hover:text-[#2a1a12]">
                    {rec.brand} · {rec.name}
                  </p>
                  <b className="mt-1 block text-[13.5px] font-bold text-[#2a1a12]">
                    {formatInr(rec.price)}
                  </b>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WardrobeLibrary;
