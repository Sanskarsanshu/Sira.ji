import React, { useMemo, useState } from 'react';
import { Calendar, MoveHorizontal, ShoppingBag } from 'lucide-react';
import ClothingRailHero, { type RailGarment } from '@/components/ui/product-rail-gallery';
import PullLamp from '@/components/ui/pull-lamp';
import { IMAGES } from '../constants/assets';
import { useAtelier } from '../context/AtelierContext';
import type { CapsulePiece } from '../types';
import { WardrobeLibrary } from './WardrobeLibrary';

type StudioGarmentSeed = Omit<RailGarment, 'tag'> & {
  basePrice: number;
  studioOrigin: string;
};

const STUDIO_RAIL_SEEDS: StudioGarmentSeed[] = [
  {
    id: 'bone-tee',
    name: 'Heavyweight Atelier Tee · Bone',
    kind: 'tee',
    color: '#EFEBE2',
    basePrice: 240,
    studioOrigin: 'Milan Studio · Via Gesù',
    description: '240 gsm organic combed cotton finished with tonal Sera.ji crest embroidery at the chest.',
    details: ['240 gsm organic cotton', 'Hand-finished collar', 'Milan Studio Archive'],
    image: 'https://cdn.21st.dev/assets/mirror/14/1485bf44725b18fcdba71bfae54d67d648ab3bff4b24215a042c0cc4c895a2e6.webp',
    backImage: 'https://cdn.21st.dev/assets/mirror/69/69937e656430ae33d950303e0d53051273e5b02189750ef1e7429ec4bbf95e20.webp',
    sideImage: 'https://cdn.21st.dev/assets/mirror/83/838468c32f16b4acba62e4601276737411156052444712ff2534fefe994a7bed.webp',
  },
  {
    id: 'cc-graphic',
    name: 'Nocturne Exhibition Tee · Obsidian',
    kind: 'tee',
    color: '#101214',
    basePrice: 260,
    studioOrigin: 'Paris Salon · Place Vendôme',
    description: 'Deep obsidian jersey tailored for Paris Fashion Week private previews with archival front and back typography.',
    details: ['240 gsm compact jersey', 'Architectural shoulder', 'Paris Fashion Week Edit'],
    image: 'https://cdn.21st.dev/assets/mirror/d7/d769f183472d0fd98a7aff2a643593748cd36ef9da1497d9bf6f0d87d1025a9b.webp',
    backImage: 'https://cdn.21st.dev/assets/mirror/fe/fec6f7e96b198cc5b9aad333ca2c4c10968a746d87f6dc11d9c118607b509058.webp',
    sideImage: 'https://cdn.21st.dev/assets/mirror/b3/b3b6984ea94b8b8cd19fb15387e89dca457ac0f947115c2a54a33217e4fb4571.webp',
  },
  {
    id: 'oxford-sky',
    name: 'Como Poplin Oxford Shirt · Cielo',
    kind: 'shirt',
    color: '#A3D3EB',
    basePrice: 480,
    studioOrigin: 'Lake Como Looms · Italy',
    description: 'Pale Alpine-sky woven oxford cotton with mother-of-pearl buttons and single-needle French side seams.',
    details: ['Como woven cotton', 'Mother-of-pearl buttons', '18 SPI French seams'],
    image: 'https://cdn.21st.dev/assets/mirror/47/470a7723cef068f81e8a4c09d1ab3f8630c61b734c2168b10f3858e45efbf31f.webp',
    backImage: 'https://cdn.21st.dev/assets/mirror/9b/9be14e5dce879756775677e2d82dadc2ad9a1690b7df2f82de360cb3600d0ee5.webp',
    sideImage: 'https://cdn.21st.dev/assets/mirror/59/5984d5ca60fd1aeee7e688ec33c2219a1c537fcde90d2accab813c13985f8632.webp',
  },
  {
    id: 'cardigan-olive',
    name: 'Umbrian Lambswool Cardigan · Olive',
    kind: 'knit',
    color: '#758151',
    basePrice: 690,
    studioOrigin: 'Perugia Knitwear Atelier',
    description: 'Full-fashioned chunky olive lambswool cardigan fastened with turned walnut buttons and linked ribbed trims.',
    details: ['100% Virgin Lambswool', 'Turned walnut buttons', 'Hand-linked V-neck'],
    image: 'https://cdn.21st.dev/assets/mirror/58/581b13c5ca241c653dc94d2c8048c92a60f022cfbaaf153261076d3a6655827e.webp',
    backImage: 'https://cdn.21st.dev/assets/mirror/d9/d9178d906d37268565cf10af3431aee543aacfc73610f7fa7b0fa4758c498cb3.webp',
    sideImage: 'https://cdn.21st.dev/assets/mirror/de/dee1c529600e0460413f1a9b07a29bedb7ea7dc96181fce5d9d6501231e6e45d.webp',
  },
  {
    id: 'hoodie-heather',
    name: 'Sculpted Loopback Hoodie · Ash',
    kind: 'hoodie',
    color: '#A0A5AB',
    basePrice: 540,
    studioOrigin: 'Zurich Private Gallery',
    description: '400 gsm double-faced Italian loopback fleece cut with an architectural double-layer hood and clean kangaroo pocket.',
    details: ['400 gsm Italian fleece', 'Double-lined hood', 'Relaxed studio drape'],
    image: 'https://cdn.21st.dev/assets/mirror/51/51750ba098dd622df46695bca781b3f0ec336a36b93b070e638cc04455def6d6.webp',
    backImage: 'https://cdn.21st.dev/assets/mirror/e7/e75c4ac8fb7f14caae756338a31f81f1437bb312b78e0d7d906e9f956e7968fa.webp',
    sideImage: 'https://cdn.21st.dev/assets/mirror/a2/a2eb2463d52146c341ede6bb9f6067e917a23eb29b7b1d1d4c40ac084a01c7ce.webp',
  },
  {
    id: 'sweat-lilac',
    name: 'Botanical Dyed Crewneck · Parma Lilac',
    kind: 'knit',
    color: '#CCB2E0',
    basePrice: 460,
    studioOrigin: 'Florence Botanical Dye House',
    description: 'Mineral-washed Parma lilac fleece crewneck set in Alpine salt baths with raised relief studio lettering.',
    details: ['400 gsm brushed fleece', 'Botanical mineral dye', 'Relief puff insignia'],
    image: 'https://cdn.21st.dev/assets/mirror/8e/8e38660e2add9637c27846d9b8d620f2abb228a5a153ccfd7b1c808b6845e1f8.webp',
    backImage: 'https://cdn.21st.dev/assets/mirror/b9/b9214a6e009ce4b3044595a51ea010c299135bab5b26775c43d7175c86e77898.webp',
    sideImage: 'https://cdn.21st.dev/assets/mirror/59/591872e42b483c43c1cd08a3ac4d7d40c0b5fa2bc585a36096faded2e696e84e.webp',
  },
  {
    id: 'polo-forest',
    name: 'Riviera Piqué Knit Polo · Cypress',
    kind: 'tee',
    color: '#185B37',
    basePrice: 380,
    studioOrigin: 'Portofino Seasonal Salon',
    description: 'Deep cypress honeycomb piqué polo with a structured two-button placket and ivory silk-thread monogram.',
    details: ['Long-staple piqué knit', 'Two-button tailored placket', 'Silk-thread embroidery'],
    image: 'https://cdn.21st.dev/assets/mirror/19/19fe43cb681195ae227e3164088d86a07a1b6e33cc54c6e35637374736a16894.webp',
    backImage: 'https://cdn.21st.dev/assets/mirror/e0/e095182b1a7f04e600c5662aa871b4c055c294b152586817d84e312c22f744cf.webp',
    sideImage: 'https://cdn.21st.dev/assets/mirror/00/005a8e10be234bc40917f3153208b8196ba1610c53c987e39942da1f4a7cd808.webp',
  },
  {
    id: 'henley-brick',
    name: 'Artisan Slub Henley · Terracotta',
    kind: 'knit',
    color: '#B05139',
    basePrice: 340,
    studioOrigin: 'Rome Private Archive',
    description: 'Sun-baked terracotta slub cotton long-sleeve henley washed for lived-in softness from the first fitting.',
    details: ['Organic slub jersey', 'Three horn buttons', 'Garment-dyed patina'],
    image: 'https://cdn.21st.dev/assets/mirror/84/84aa4b0e21ed11fcbc083647a607b94ee3a6c21cb66c114cfb1dad0792c15499.webp',
    backImage: 'https://cdn.21st.dev/assets/mirror/01/01c299df56a29afca8dad4a64858bd506667338bfbd0435118e6c3698c7881b3.webp',
    sideImage: 'https://cdn.21st.dev/assets/mirror/9c/9ca38eeb156aae7d199d3c1ffb7947e395f77d1f094eea006c1b5fbb22352b4e.webp',
  },
  {
    id: 'breton',
    name: 'Marinière Boat-Neck Knit · Ivory & Ink',
    kind: 'knit',
    color: '#E4DFD3',
    basePrice: 360,
    studioOrigin: 'Antibes Coastal Showroom',
    description: 'Yarn-dyed ink-and-bone Breton stripe knitted in 220 gsm combed cotton with a clean architectural boat neckline.',
    details: ['220 gsm yarn-dyed knit', 'Architectural boat neck', 'Matched side stripes'],
    image: 'https://cdn.21st.dev/assets/mirror/09/096002a95aba7de9c197de4cb5c78cbbe17c1677b19c547cc20c6dbef47a899c.webp',
    backImage: 'https://cdn.21st.dev/assets/mirror/74/74408a7dbb4f4fc6761ebb8d6ed93187248cddf75e1c2e70d38d04dfdd328776.webp',
    sideImage: 'https://cdn.21st.dev/assets/mirror/ed/eda3afca537071a80d7d82b3f0d1055b56f1f3263c20772224bae6660bf4072c.webp',
  },
  {
    id: 'oversized-ochre',
    name: 'Boxy Exhibition Tee · Siena Ochre',
    kind: 'tee',
    color: '#DE9C31',
    basePrice: 280,
    studioOrigin: 'Tokyo Aoyama Exhibition',
    description: 'Warm Siena ochre boxy silhouette with dropped tailoring shoulders and commemorative exhibition back print.',
    details: ['Boxy atelier cut', 'Dropped shoulder', 'Limited Tokyo Edition'],
    image: 'https://cdn.21st.dev/assets/mirror/72/7208c811f54e123dd7b1a5c1c3926f43ca832f6c4c20c45de10671ffd544409d.webp',
    backImage: 'https://cdn.21st.dev/assets/mirror/d3/d356989b7bc741c5cfc934cac34983dfb24d5d6a6b6e7b8b7f6b27cd3eceae69.webp',
    sideImage: 'https://cdn.21st.dev/assets/mirror/bf/bf94beeafb21f9cb21aa45057a67dc8a2e23ba95c7ac0f79dd27ba3ce4a1230c.webp',
  },
];

export const EditorialSection: React.FC = () => {
  const {
    cartCount,
    addToCart,
    currentLocale,
    openBooking,
    openCurationDrawer,
    toggleCuratePiece,
    isPieceCurated,
    showToast,
  } = useAtelier();

  const [sectionTheme, setSectionTheme] = useState<'light' | 'dark'>('light');

  const railItems = useMemo<RailGarment[]>(
    () =>
      STUDIO_RAIL_SEEDS.map((seed) => ({
        ...seed,
        tag: `${currentLocale.symbol}${seed.basePrice}`,
      })),
    [currentLocale.symbol],
  );

  const toCapsulePiece = (item: RailGarment): CapsulePiece => {
    const seed = STUDIO_RAIL_SEEDS.find((s) => s.id === item.id);
    return {
      id: `rail-${item.id}`,
      title: item.name,
      subtitle: seed?.studioOrigin ?? 'Sera.ji Private Studio Archive',
      image: item.image || IMAGES.product,
      status: 'ready',
      tag: 'Private Studio Rail',
      price: item.tag ?? `${currentLocale.symbol}320`,
      details: item.details ?? ['Hand-finished in Italy'],
      fabricSpecs: {
        momme: 24,
        weave: item.details?.[0] ?? 'Atelier Knit & Woven Cotton',
        origin: seed?.studioOrigin ?? 'Milan & Paris',
        composition: '100% Certified Natural Fibers',
      },
    };
  };

  return (
    <section className="s-editorial" id="acclaim">
      <div className="wrap">
        <div className="editorial-shell" data-theme={sectionTheme}>
          {/* Studio Pull Lamp (Toggles Section 5 Day / Night Atelier Theme) */}
          <div className="pointer-events-auto z-20 mx-auto mb-6 w-[170px] sm:w-[195px] lg:absolute lg:left-7 lg:top-7 lg:mb-0 lg:w-[220px] xl:left-11 xl:top-8 xl:w-[240px]">
            <PullLamp
              on={sectionTheme === 'light'}
              onThemeChange={setSectionTheme}
            />
          </div>

          <div className="sec-head">
            <span className="eyebrow rv">Sera.ji Global Acclaim</span>
            <h2 className="h2 split" data-split>
              Celebrated Across<br />
              <span className="lt">Sera.ji Private Studios</span>
            </h2>
            <p className="lead rv" style={{ '--d': 3 } as React.CSSProperties}>
              From Paris Fashion Week to private international exhibitions, Sera.ji is celebrated for uniting
              centuries of Italian weaving heritage with timeless architectural restraint.
            </p>
          </div>

          {/* Interactive 3D Physics Studio Clothing Rail */}
          <div id="studio-rail" className="mx-auto mt-9 max-w-[1220px] sm:mt-11">
            <ClothingRailHero
              items={railItems}
              hanger="none"
              autoplay
              interval={2800}
              caption="Brush along the rail, slide any hanger, or click a garment to lift it off the rail and inspect front & back."
              className="bg-transparent"
              detailExtra={<WardrobeLibrary />}
              railHeader={
                <div className="sera-shelf-scope mx-auto mb-3 w-full max-w-[1160px] px-2 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/90 bg-white/75 px-4 py-2 shadow-[0_14px_34px_-22px_rgba(42,26,18,0.22)] backdrop-blur-xl sm:px-5">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full bg-[#2a1a12]" />
                      <span className="text-[11px] font-medium tracking-[0.14em] text-[#5b4a3f] uppercase">
                        Paris · Milan · Lake Como · Tokyo — 10 Archival Pieces on the Rail
                      </span>
                    </div>

                    <div className="ml-auto flex items-center gap-3.5">
                      <span className="hidden items-center gap-1.5 text-[11.5px] font-medium text-[#7a6a5e] lg:inline-flex">
                        <MoveHorizontal className="size-3.5 text-[#2a1a12]" />
                        Brush or drag hangers · Click any piece to inspect front &amp; back
                      </span>
                      <button
                        type="button"
                        onClick={openCurationDrawer}
                        aria-label={`Open Trunk Show Bag (${cartCount} items)`}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#2a1a12]/12 bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#2a1a12] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a1a12] hover:text-[#fbf7f1]"
                      >
                        <ShoppingBag className="size-3.5" strokeWidth={1.7} />
                        <span>Bag ({cartCount})</span>
                      </button>
                    </div>
                  </div>
                </div>
              }
              isSaved={(item) => isPieceCurated(`rail-${item.id}`)}
              onToggleSave={(item) => {
                const alreadySaved = isPieceCurated(`rail-${item.id}`);
                toggleCuratePiece(toCapsulePiece(item));
                showToast(
                  alreadySaved
                    ? `Removed ${item.name} from Private Trunk Show`
                    : `Saved ${item.name} to Private Trunk Show ♥`,
                  'gold',
                );
              }}
              onAddToBag={(item) => {
                addToCart(1);
                if (!isPieceCurated(`rail-${item.id}`)) {
                  toggleCuratePiece(toCapsulePiece(item));
                }
                showToast(`Added ${item.name} (${item.tag}) to Sera.ji Bag ✓`, 'gold');
              }}
              action={
                <div className="sera-shelf-scope mt-1 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => openBooking()}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#3b2116] px-6 py-3 text-[12.5px] font-medium tracking-[0.06em] text-[#f6ede2] uppercase shadow-[0_14px_28px_-12px_rgba(59,33,22,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a1a12]"
                  >
                    <Calendar className="size-3.5" strokeWidth={1.75} />
                    <span>Book Private Studio Fitting</span>
                  </button>
                  <button
                    type="button"
                    onClick={openCurationDrawer}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#2a1a12]/15 bg-white/85 px-5 py-3 text-[12.5px] font-medium tracking-[0.05em] text-[#2a1a12] uppercase backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
                  >
                    <ShoppingBag className="size-3.5" strokeWidth={1.75} />
                    <span>View Trunk Show ({cartCount})</span>
                  </button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};
