/**
 * Product Shelf. Designed & built by Aakash Mehra — adapted & integrated for Sera.ji Atelier.
 *
 * A store wall of three floating shelves with twelve cosmetics & atelier care vessels, drawn to look like studio
 * product shots: cylinder shading with softbox reflections, printed type, ridged caps, thick glass bases,
 * visible liquid and dip tubes. Click one and it moves from its place on the shelf to the left of a
 * product page and turns once, its print wrapping round the body. Drag it to turn it yourself; let go
 * and it carries your speed, then settles facing front.
 *
 * Motion follows Apple's fluid-interface rules: critically damped springs, symmetric enter and exit,
 * velocity handed off on release, and a cross-fade under prefers-reduced-motion.
 */
"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  LayoutGroup,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ChevronDown,
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  Rotate3d,
  ShoppingBag,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "jar" | "tube" | "pump" | "dropper" | "perfume" | "mist" | "bottle" | "stick" | "lip";

export type Product = {
  id: string;
  kind: Kind;
  name: string;
  /** Name printed on the pack, with an optional second line. */
  short: string;
  sub?: string;
  category: string;
  /** Body colour, cap colour, label colour, print colour. */
  color: string;
  cap: string;
  label: string;
  ink: string;
  /** See-through glass, and the colour of what is inside. */
  glass?: boolean;
  liquid?: string;
  price: number;
  compareAt?: number;
  sizes: string[];
  rating: number;
  reviews: number;
  tagline: string;
  description: string;
  benefits: string[];
  ingredients: string;
  howTo: string;
  /** Editorial botanical / formulation reference shot. */
  studioImage?: string;
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "barrier-cream",
    kind: "jar",
    name: "Barrier Restore Cream",
    short: "Barrier Restore",
    sub: "Cream",
    category: "Moisturizer",
    color: "#f3f1ec",
    cap: "#f6f5f1",
    label: "#f3f1ec",
    ink: "#1a1a1a",
    price: 2900,
    sizes: ["50 ml", "100 ml"],
    rating: 4.8,
    reviews: 3284,
    tagline: "A cushiony cream for a stronger skin barrier.",
    description:
      "A rich but weightless moisturizer with ceramides, cholesterol and fatty acids in skin-identical ratios, so a compromised barrier recovers and stays calm.",
    benefits: ["Ceramide complex 3%", "Fragrance free", "For dry and sensitive skin"],
    ingredients:
      "Aqua, Squalane, Glycerin, Ceramide NP, Ceramide AP, Cholesterol, Phytosphingosine, Panthenol, Niacinamide.",
    howTo: "Warm a small amount between fingertips and press into clean skin, morning and night.",
    studioImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "niacinamide",
    kind: "dropper",
    name: "Niacinamide 10% + Zinc 1%",
    short: "Niacinamide",
    sub: "10% + Zinc 1%",
    category: "Serum",
    color: "#e9eef0",
    cap: "#f7f7f5",
    label: "#ffffff",
    ink: "#111111",
    glass: true,
    liquid: "#f4efe2",
    price: 1200,
    sizes: ["30 ml", "60 ml"],
    rating: 4.6,
    reviews: 18420,
    tagline: "A high-strength serum for blemishes and shine.",
    description:
      "A water-based serum that visibly reduces blemishes and congestion, balances oil and refines the look of pores with 10% niacinamide and 1% zinc PCA.",
    benefits: ["Reduces the look of pores", "Balances oil", "Vegan, cruelty free"],
    ingredients:
      "Aqua, Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum.",
    howTo: "Apply a few drops to the face morning and evening before heavier creams.",
    studioImage: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mineral-spf",
    kind: "tube",
    name: "Mineral UV Filters SPF 30",
    short: "Mineral UV Filters",
    sub: "SPF 30 with antioxidants",
    category: "Sunscreen",
    color: "#f6f6f3",
    cap: "#efeee9",
    label: "#f6f6f3",
    ink: "#111111",
    price: 1400,
    sizes: ["50 ml"],
    rating: 4.4,
    reviews: 2150,
    tagline: "Broad-spectrum mineral protection, no white cast.",
    description:
      "A lightweight mineral sunscreen with zinc oxide and titanium dioxide, plus antioxidants to help defend against daily stressors. Sheer on all skin tones.",
    benefits: ["SPF 30 broad spectrum", "Mineral filters only", "Wears well under makeup"],
    ingredients:
      "Aqua, Zinc Oxide, Titanium Dioxide, Caprylic Triglyceride, Tocopherol, Squalane, Glycerin.",
    howTo: "Apply generously as the last step of your morning routine. Reapply every two hours in sun.",
    studioImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "glazing-milk",
    kind: "pump",
    name: "Glazing Milk",
    short: "glazing milk",
    sub: "ceramide essence",
    category: "Essence",
    color: "#ebe3d9",
    cap: "#e6ddd2",
    label: "#ebe3d9",
    ink: "#6b5a4c",
    price: 3000,
    sizes: ["150 ml"],
    rating: 4.7,
    reviews: 5210,
    tagline: "A milky essence that preps skin for glow.",
    description:
      "A silky, milky essence with ceramides and peptides that softens and hydrates as the first step, leaving skin plump and glazed.",
    benefits: ["Ceramides and peptides", "Lightweight milk texture", "Layers under everything"],
    ingredients:
      "Aqua, Glycerin, Ceramide NP, Palmitoyl Tripeptide-1, Beta Glucan, Squalane, Panthenol.",
    howTo: "Pump into palms and press over clean skin before serum and moisturizer.",
    studioImage: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "hyaluronic",
    kind: "dropper",
    name: "Hyaluronic Acid 2% + B5",
    short: "Hyaluronic Acid",
    sub: "2% + B5",
    category: "Serum",
    color: "#e9eef0",
    cap: "#f7f7f5",
    label: "#ffffff",
    ink: "#111111",
    glass: true,
    liquid: "#eef3f6",
    price: 1100,
    sizes: ["30 ml", "60 ml"],
    rating: 4.6,
    reviews: 21870,
    tagline: "Multi-depth hydration with vitamin B5.",
    description:
      "Low, medium and high molecular weight hyaluronic acid with vitamin B5 for hydration at every layer of the skin, leaving it plump and smooth.",
    benefits: ["Three weights of HA", "Oil free", "Suits all skin types"],
    ingredients:
      "Aqua, Sodium Hyaluronate, Pentylene Glycol, Propanediol, Sodium Hyaluronate Crosspolymer, Panthenol.",
    howTo: "Apply a few drops to damp skin morning and evening, then seal with moisturizer.",
    studioImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "invisible-spf",
    kind: "pump",
    name: "Invisible Fluid SPF 50",
    short: "Invisible Fluid",
    sub: "SPF 50 PA++++",
    category: "Sunscreen",
    color: "#f1ede6",
    cap: "#2b2b2b",
    label: "#f1ede6",
    ink: "#3c342d",
    price: 2400,
    sizes: ["50 ml", "100 ml"],
    rating: 4.7,
    reviews: 1608,
    tagline: "A weightless daily fluid with high protection.",
    description:
      "A clear-finish chemical sunscreen fluid with SPF 50 that disappears into skin, never pills and doubles as a hydrating primer.",
    benefits: ["SPF 50 PA++++", "Invisible finish", "Water resistant 40 min"],
    ingredients:
      "Aqua, Homosalate, Ethylhexyl Salicylate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Glycerin, Niacinamide.",
    howTo: "Apply two finger lengths to face and neck each morning. Reapply after swimming or sweating.",
    studioImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lip-treatment",
    kind: "lip",
    name: "Peptide Lip Treatment",
    short: "peptide lip",
    sub: "treatment",
    category: "Lip care",
    color: "#e7c3bb",
    cap: "#e7c3bb",
    label: "#e7c3bb",
    ink: "#7d4740",
    price: 1800,
    sizes: ["10 ml"],
    rating: 4.8,
    reviews: 9420,
    tagline: "A glossy, cushiony balm with peptides.",
    description:
      "A thick, high-shine treatment with peptides and shea that smooths and plumps the look of lips, with a sheer wash of colour.",
    benefits: ["Peptide complex", "Glossy, non-sticky finish", "Sheer ribbon tint"],
    ingredients:
      "Polybutene, Shea Butter, Palmitoyl Tripeptide-1, Babassu Oil, Cupuacu Butter, Tocopherol.",
    howTo: "Apply to bare lips or over liner. Reapply whenever you like.",
    studioImage: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "squalane-cleanser",
    kind: "tube",
    name: "Squalane Cleanser",
    short: "Squalane",
    sub: "Cleanser",
    category: "Cleanser",
    color: "#f6f6f3",
    cap: "#f6f6f3",
    label: "#f6f6f3",
    ink: "#111111",
    price: 1000,
    sizes: ["50 ml", "150 ml"],
    rating: 4.7,
    reviews: 12040,
    tagline: "A balm-to-oil cleanser that lifts makeup.",
    description:
      "A gentle balm that melts into an oil as you massage, dissolving makeup and sunscreen without leaving skin tight or dry.",
    benefits: ["Removes makeup", "Never stripping", "Rinses clean"],
    ingredients:
      "Squalane, Aqua, Coco-Caprylate/Caprate, Glycerin, Sucrose Stearate, Ethyl Macadamiate.",
    howTo: "Massage onto dry skin, add water to emulsify, then rinse.",
    studioImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "malt-shampoo",
    kind: "bottle",
    name: "Malt & Hops Volumising Shampoo",
    short: "Malt & Hops",
    sub: "Volumising shampoo",
    category: "Hair care",
    color: "#7a3f14",
    cap: "#141414",
    label: "#f6f2ea",
    ink: "#111111",
    glass: true,
    liquid: "#b8752a",
    price: 1800,
    compareAt: 2200,
    sizes: ["250 ml", "500 ml"],
    rating: 4.6,
    reviews: 611,
    tagline: "Brewed for body and shine.",
    description:
      "Made with brewer's hops, malt protein and biotin, this lather lifts flat hair at the root and leaves a glassy shine from root to tip.",
    benefits: ["Volume at the root", "Sulfate free", "Colour safe"],
    ingredients:
      "Aqua, Humulus Lupulus Extract, Hydrolyzed Barley Protein, Coco-Glucoside, Biotin, Citric Acid.",
    howTo: "Massage into wet hair, leave for one minute, rinse. Follow with conditioner.",
    studioImage: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "glycolic-toner",
    kind: "bottle",
    name: "Glycolic Acid 7% Toning Solution",
    short: "Glycolic Acid 7%",
    sub: "Toning solution",
    category: "Exfoliant",
    color: "#e8eef0",
    cap: "#f4f4f1",
    label: "#ffffff",
    ink: "#111111",
    glass: true,
    liquid: "#f2e9ee",
    price: 1300,
    sizes: ["100 ml", "240 ml"],
    rating: 4.5,
    reviews: 15530,
    tagline: "Exfoliates for brighter, smoother skin.",
    description:
      "A 7% glycolic acid toner with amino acids, aloe and ginseng that gently resurfaces for improved radiance and a more even texture.",
    benefits: ["7% glycolic acid", "Improves radiance", "Use in the evening"],
    ingredients:
      "Aqua, Glycolic Acid, Rosa Damascena Flower Water, Aloe Barbadensis Leaf Water, Panax Ginseng Root Extract.",
    howTo: "Sweep over the face with a cotton pad in the evening. Use sunscreen the next day.",
    studioImage: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "barrier-butter",
    kind: "jar",
    name: "Barrier Butter Night Cream",
    short: "barrier butter",
    sub: "night cream",
    category: "Night cream",
    color: "#e8dbd1",
    cap: "#e8dbd1",
    label: "#e8dbd1",
    ink: "#6b4f44",
    price: 2800,
    sizes: ["50 ml"],
    rating: 4.8,
    reviews: 2710,
    tagline: "A buttery overnight cream for soft mornings.",
    description:
      "A dense, cocooning night cream with shea, peptides and bakuchiol that restores moisture and smooths the look of fine lines while you sleep.",
    benefits: ["Bakuchiol and peptides", "Rich, non-greasy", "Barrier repair overnight"],
    ingredients:
      "Aqua, Shea Butter, Squalane, Bakuchiol, Palmitoyl Tripeptide-1, Ceramide NP, Cholesterol.",
    howTo: "Apply as the last step of your evening routine.",
    studioImage: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "no1-parfum",
    kind: "perfume",
    name: "No. 1 Eau de Parfum",
    short: "No. 1",
    sub: "Eau de parfum",
    category: "Fragrance",
    color: "#eeece8",
    cap: "#151515",
    label: "#eeece8",
    ink: "#1a1a1a",
    glass: true,
    liquid: "#f1e2cd",
    price: 6800,
    sizes: ["50 ml", "100 ml"],
    rating: 4.9,
    reviews: 812,
    tagline: "Skin musk, white tea and a little fig.",
    description:
      "A quiet, close-to-skin scent that smells like freshly washed skin, warmed with musk and lifted with white tea and green fig.",
    benefits: ["8 hour wear", "Vegan formula", "Refillable bottle"],
    ingredients: "Alcohol Denat., Parfum, Aqua, Ambrettolide, Iso E Super, Fig Leaf Absolute.",
    howTo: "Spray once on the wrist and once on the neck. Layer for more.",
    studioImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
  },
];

// ---------- colour ----------

type RGB = [number, number, number];
const hexRgb = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const mixRgb = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const css = (c: RGB, k = 1, a = 1) =>
  `rgba(${[0, 1, 2].map((i) => Math.round(Math.min(255, Math.max(0, c[i] * k)))).join(",")},${a})`;
const WHITE: RGB = [255, 255, 255];
const lum = (c: RGB) => c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;

// ---------- packaging (viewBox 200 x 300, everything stands on y = 286) ----------

type Box = { x: number; y: number; w: number; h: number };
type Shape = {
  body: string;
  box: Box;
  /** Where the print sits. `paper` puts it on a paper label instead of straight on the pack. */
  print: Box & { paper?: boolean };
  /** Liquid top for see-through packs. */
  fill?: number;
  /** Dip tube for see-through pumps and mists. */
  tube?: boolean;
  cap: (id: string) => ReactNode;
};

const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

// knurled grip: fine vertical ridges across a cap
const ridges = (x: number, y: number, w: number, h: number, step = 2.6) =>
  Array.from({ length: Math.floor(w / step) }, (_, i) => (
    <line
      key={i}
      x1={x + 1 + i * step}
      y1={y + 1.5}
      x2={x + 1 + i * step}
      y2={y + h - 1.5}
      stroke="#000"
      strokeOpacity={i % 2 ? 0.14 : 0.06}
      strokeWidth="1"
    />
  ));

const SHAPES: Record<Kind, Shape> = {
  jar: {
    body: "M42 208 H158 Q162 208 162 214 V276 Q162 286 150 286 H50 Q38 286 38 276 V214 Q38 208 42 208 Z",
    box: { x: 38, y: 208, w: 124, h: 78 },
    print: { x: 38, y: 226, w: 124, h: 46 },
    cap: (id) => (
      <>
        <path d={rr(36, 172, 128, 38, 6)} fill={`url(#${id}-cap)`} />
        <g>{ridges(36, 178, 128, 30, 2.2)}</g>
        <path d={rr(36, 172, 128, 38, 6)} fill={`url(#${id}-capv)`} />
        <path d="M42 173.2 H158" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2" />
        <rect x="38" y="208" width="124" height="3" fill="#000" opacity="0.22" />
      </>
    ),
  },
  tube: {
    body: "M80 250 L67 74 Q66 60 74 58 L126 58 Q134 60 133 74 L120 250 Z",
    box: { x: 66, y: 58, w: 68, h: 192 },
    print: { x: 66, y: 104, w: 68, h: 110 },
    cap: (id) => (
      <>
        {/* flat, crimped end with its sealing teeth */}
        <path d={`M62 40 H138 V58 H62 Z`} fill={`url(#${id}-body)`} />
        <path
          d={`M62 40 ${Array.from({ length: 19 }, (_, i) => `L${64 + i * 4} ${i % 2 ? 40 : 37.5}`).join(" ")} L138 40`}
          fill={`url(#${id}-body)`}
        />
        {Array.from({ length: 18 }, (_, i) => (
          <line key={i} x1={64 + i * 4.1} y1="42" x2={64 + i * 4.1} y2="56" stroke="#000" strokeOpacity="0.09" />
        ))}
        <text x="132" y="53" fontSize="3.4" textAnchor="end" fill="#000" fillOpacity="0.35">
          L2611 EXP 06/28
        </text>
        <path d={rr(73, 248, 54, 38, 7)} fill={`url(#${id}-cap)`} />
        <g>{ridges(73, 256, 54, 28, 2.4)}</g>
        <path d={rr(73, 248, 54, 38, 7)} fill={`url(#${id}-capv)`} />
        <path d="M75 251 H125" stroke="#000" strokeOpacity="0.2" />
      </>
    ),
  },
  pump: {
    body: "M58 136 Q58 110 84 108 L116 108 Q142 110 142 136 L142 272 Q142 286 128 286 L72 286 Q58 286 58 272 Z",
    box: { x: 58, y: 108, w: 84, h: 178 },
    print: { x: 58, y: 160, w: 84, h: 90 },
    tube: true,
    fill: 132,
    cap: (id) => (
      <>
        <rect x="95.5" y="60" width="9" height="32" fill={`url(#${id}-cap)`} />
        <path d="M82 50 H126 Q132 50 132 55 V64 H78 V55 Q78 50 82 50 Z" fill={`url(#${id}-cap)`} />
        <path d="M126 53 H153 Q157 53 157 56.5 V60 H126 Z" fill={`url(#${id}-cap)`} />
        <path d="M80 51.5 H128" stroke="#fff" strokeOpacity="0.7" />
        <path d={rr(80, 88, 40, 22, 3)} fill={`url(#${id}-cap)`} />
        <g>{ridges(80, 88, 40, 22, 2.2)}</g>
        <path d={rr(80, 88, 40, 22, 3)} fill={`url(#${id}-capv)`} />
      </>
    ),
  },
  dropper: {
    body: "M64 170 Q64 152 86 150 L86 140 L114 140 L114 150 Q136 152 136 170 L136 272 Q136 286 122 286 L78 286 Q64 286 64 272 Z",
    box: { x: 64, y: 140, w: 72, h: 146 },
    print: { x: 64, y: 192, w: 72, h: 70, paper: true },
    fill: 168,
    cap: (id) => (
      <>
        <path d="M86 118 V86 Q86 62 100 62 Q114 62 114 86 V118 Z" fill={`url(#${id}-bulb)`} />
        <path
          d="M91 74 Q93 66 100 65"
          stroke="#fff"
          strokeOpacity="0.4"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path d={rr(80, 114, 40, 28, 3)} fill={`url(#${id}-cap)`} />
        <g>{ridges(80, 114, 40, 28, 2)}</g>
        <path d={rr(80, 114, 40, 28, 3)} fill={`url(#${id}-capv)`} />
      </>
    ),
  },
  perfume: {
    body: "M58 166 H142 Q154 166 156 178 L158 270 Q158 286 142 286 H58 Q42 286 42 270 L44 178 Q46 166 58 166 Z",
    box: { x: 42, y: 166, w: 116, h: 120 },
    print: { x: 66, y: 204, w: 68, h: 44 },
    fill: 178,
    cap: (id) => (
      <>
        <rect x="88" y="150" width="24" height="18" fill={`url(#${id}-cap)`} />
        <path d={rr(70, 96, 60, 56, 4)} fill={`url(#${id}-cap)`} />
        <path d={rr(70, 96, 60, 56, 4)} fill={`url(#${id}-capv)`} />
        <path d="M72 97.5 H128" stroke="#fff" strokeOpacity="0.8" />
      </>
    ),
  },
  mist: {
    body: "M62 154 Q62 130 86 128 L114 128 Q138 130 138 154 L138 272 Q138 286 124 286 L76 286 Q62 286 62 272 Z",
    box: { x: 62, y: 128, w: 76, h: 158 },
    print: { x: 62, y: 178, w: 76, h: 78 },
    tube: true,
    fill: 168,
    cap: (id) => (
      <>
        <path d={rr(82, 110, 36, 22, 3)} fill={`url(#${id}-cap)`} />
        <g>{ridges(82, 110, 36, 22, 2.2)}</g>
        <path d={rr(86, 82, 28, 30, 6)} fill={`url(#${id}-cap)`} />
        <path d={rr(86, 82, 28, 30, 6)} fill={`url(#${id}-capv)`} />
        <circle cx="111" cy="94" r="2.2" fill="#000" opacity="0.45" />
      </>
    ),
  },
  bottle: {
    body: "M62 114 Q62 86 86 82 L114 82 Q138 86 138 114 L141 268 Q141 286 122 286 L78 286 Q59 286 59 268 Z",
    box: { x: 59, y: 82, w: 82, h: 204 },
    print: { x: 59, y: 140, w: 82, h: 100, paper: true },
    fill: 110,
    cap: (id) => (
      <>
        <path d={rr(78, 50, 44, 34, 6)} fill={`url(#${id}-cap)`} />
        <path d={rr(78, 50, 44, 34, 6)} fill={`url(#${id}-capv)`} />
        <path d="M80 63 H120" stroke="#000" strokeOpacity="0.45" />
        <path d="M80 51.5 H120" stroke="#fff" strokeOpacity="0.4" />
      </>
    ),
  },
  lip: {
    body: "M89 250 L85 152 Q85 144 91 143 L109 143 Q115 144 115 152 L111 250 Z",
    box: { x: 85, y: 143, w: 30, h: 107 },
    print: { x: 85, y: 166, w: 30, h: 60 },
    cap: (id) => (
      <>
        <path d={`M83 128 H117 V143 H83 Z`} fill={`url(#${id}-body)`} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={85 + i * 4.2} y1="130" x2={85 + i * 4.2} y2="141" stroke="#000" strokeOpacity="0.08" />
        ))}
        <path d={rr(86, 248, 28, 38, 5)} fill={`url(#${id}-cap)`} />
        <path d={rr(86, 248, 28, 38, 5)} fill={`url(#${id}-capv)`} />
      </>
    ),
  },
  stick: {
    body: rr(81, 224, 38, 62, 4),
    box: { x: 81, y: 224, w: 38, h: 62 },
    print: { x: 81, y: 236, w: 38, h: 38 },
    cap: (id) => (
      <>
        <path d={rr(81, 168, 38, 58, 5)} fill={`url(#${id}-cap)`} />
        <path d={rr(81, 168, 38, 58, 5)} fill={`url(#${id}-capv)`} />
        <rect x="81" y="222" width="38" height="2.5" fill="#000" opacity="0.3" />
      </>
    ),
  },
};

// How tall and wide each pack is (cap included), so small ones can be zoomed to fill the product page.
const EXTENT: Record<Kind, { top: number; w: number }> = {
  jar: { top: 172, w: 128 },
  tube: { top: 37, w: 76 },
  pump: { top: 50, w: 101 },
  dropper: { top: 60, w: 72 },
  perfume: { top: 96, w: 116 },
  mist: { top: 80, w: 76 },
  bottle: { top: 48, w: 84 },
  stick: { top: 166, w: 38 },
  lip: { top: 128, w: 34 },
};
const pageZoom = (k: Kind) => Math.min(2.2, 262 / (290 - EXTENT[k].top), 190 / EXTENT[k].w);

// ---------- the product drawing ----------

function ProductArt({
  p,
  spin,
  brandName = "SERA.JI",
  className,
}: {
  p: Product;
  spin?: MotionValue<number>;
  brandName?: string;
  className?: string;
}) {
  const id = "ps" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const s = SHAPES[p.kind];
  const c = hexRgb(p.color);
  const k = hexRgb(p.cap);
  const lab = hexRgb(p.label);
  const a = p.glass ? (lum(c) > 200 ? 0.28 : 0.8) : 1;
  const liq = hexRgb(p.liquid ?? p.color);
  const { print: P, box: B } = s;
  const period = P.w * 2.6; // the print covers the front, then the back of the pack goes by
  const fallback = useMotionValue(0);
  const x = useTransform(spin ?? fallback, (v) => -((((v * period) % period) + period) % period));
  const nameSize = Math.min(10.5, P.w * 0.12, (P.w * 1.12) / p.short.length);
  const subSize = Math.min(7, P.w * 0.08, (P.w * 1.25) / (p.sub ?? "").length);
  const printArt = (dx: number) => (
    <g transform={`translate(${dx} 0)`}>
      {P.paper && <rect x={P.x} y={P.y} width={P.w} height={P.h} fill={css(lab)} />}
      <text
        x={P.x + P.w / 2}
        y={P.y + P.h * 0.2}
        fill={p.ink}
        fontSize={Math.min(6.5, P.w * 0.075)}
        fontWeight="600"
        letterSpacing={Math.min(1.6, P.w * 0.02)}
        textAnchor="middle"
      >
        {brandName}
      </text>
      <text
        x={P.x + P.w / 2}
        y={P.y + P.h * 0.46}
        fill={p.ink}
        fontSize={nameSize}
        fontWeight="500"
        letterSpacing="-0.15"
        textAnchor="middle"
      >
        {p.short}
      </text>
      {p.sub && (
        <text
          x={P.x + P.w / 2}
          y={P.y + P.h * 0.62}
          fill={p.ink}
          fontSize={subSize}
          opacity="0.8"
          textAnchor="middle"
        >
          {p.sub}
        </text>
      )}
      <text
        x={P.x + P.w / 2}
        y={P.y + P.h * 0.86}
        fill={p.ink}
        opacity="0.6"
        fontSize={Math.min(5.8, P.w * 0.07)}
        textAnchor="middle"
      >
        {p.sizes[0]}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden overflow="visible">
      <defs>
        {/* cylinder shading lit by a big softbox from the front left, with a bounce on the right */}
        <linearGradient id={`${id}-body`} x1="0" x2="1">
          <stop offset="0" stopColor={css(c, 0.42, a)} />
          <stop offset="0.06" stopColor={css(c, 0.64, a)} />
          <stop offset="0.1" stopColor={css(c, 0.92, a)} />
          <stop offset="0.16" stopColor={css(mixRgb(c, WHITE, 0.16), 1, a)} />
          <stop offset="0.36" stopColor={css(c, 1.02, a)} />
          <stop offset="0.55" stopColor={css(c, 0.93, a)} />
          <stop offset="0.76" stopColor={css(c, 0.78, a)} />
          <stop offset="0.9" stopColor={css(c, 0.6, a)} />
          <stop offset="0.95" stopColor={css(mixRgb(c, WHITE, 0.14), 0.9, a)} />
          <stop offset="1" stopColor={css(c, 0.5, a)} />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" x2="1">
          <stop offset="0" stopColor={css(k, 0.4)} />
          <stop offset="0.1" stopColor={css(k, 0.7)} />
          <stop offset="0.22" stopColor={css(mixRgb(k, WHITE, 0.6))} />
          <stop offset="0.3" stopColor={css(k, 1.02)} />
          <stop offset="0.6" stopColor={css(k, 0.86)} />
          <stop offset="0.85" stopColor={css(k, 0.62)} />
          <stop offset="0.93" stopColor={css(mixRgb(k, WHITE, 0.2), 0.9)} />
          <stop offset="1" stopColor={css(k, 0.4)} />
        </linearGradient>
        <linearGradient id={`${id}-capv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.86" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-wrap`} x1="0" x2="1">
          <stop offset="0" stopColor={css(c, 0.42)} stopOpacity="1" />
          <stop offset="0.14" stopColor={css(c, 0.42)} stopOpacity="0" />
          <stop offset="0.86" stopColor={css(c, 0.42)} stopOpacity="0" />
          <stop offset="1" stopColor={css(c, 0.42)} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`${id}-liquid`} x1="0" x2="1">
          <stop offset="0" stopColor={css(liq, 0.7)} />
          <stop offset="0.3" stopColor={css(liq, 1)} />
          <stop offset="0.7" stopColor={css(liq, 0.92)} />
          <stop offset="1" stopColor={css(liq, 0.7)} />
        </linearGradient>
        <filter id={`${id}-soft`} x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={s.body} />
        </clipPath>
        <radialGradient id={`${id}-bulb`} cx="0.35" cy="0.25" r="0.9">
          <stop offset="0" stopColor={css(mixRgb(k, WHITE, 0.4))} />
          <stop offset="0.55" stopColor={css(k, 0.9)} />
          <stop offset="1" stopColor={css(k, 0.55)} />
        </radialGradient>
        <radialGradient id={`${id}-floor`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* contact shadow: a tight dark line where it touches, a soft spread around it */}
      <ellipse cx="100" cy="287" rx={B.w * 0.7} ry="6" fill={`url(#${id}-floor)`} />
      <ellipse cx="100" cy="286.3" rx={B.w * 0.47} ry="1.4" fill="#000" opacity="0.35" />

      <path d={s.body} fill={`url(#${id}-body)`} />
      <g clipPath={`url(#${id}-clip)`}>
        {p.glass && s.fill !== undefined && (
          <>
            <rect x={B.x + 3} y={s.fill} width={B.w - 6} height={286 - s.fill - 9} fill={`url(#${id}-liquid)`} opacity="0.75" />
            <rect x={B.x + 3} y={s.fill} width={B.w - 6} height="1.6" fill="#fff" opacity="0.45" />
            {s.tube && <rect x="98.6" y={B.y - 4} width="2.8" height={286 - B.y - 4} fill="#fff" opacity="0.4" />}
            {/* thick glass base */}
            <rect x={B.x} y="274" width={B.w} height="12" fill={css(c, 0.5, 0.55)} />
            <path d={`M${B.x + 6} 275 H${B.x + B.w - 6}`} stroke="#fff" strokeOpacity="0.5" strokeWidth="0.8" />
          </>
        )}
        <motion.g style={{ x }}>
          {printArt(0)}
          {printArt(period)}
        </motion.g>
        {/* the print fades into shadow as it curves round the sides */}
        <rect x={B.x} y={P.y - 2} width={B.w} height={P.h + 4} fill={`url(#${id}-wrap)`} opacity="0.5" />
        <rect x={B.x} y={B.y} width={B.w} height={B.h} fill={`url(#${id}-shade)`} />
        {/* softbox reflections: one broad and soft, one crisp, a faint kicker on the right */}
        <rect
          x={B.x + B.w * 0.07}
          y={B.y + 4}
          width={B.w * 0.11}
          height={B.h - 8}
          rx="3"
          fill="#fff"
          opacity={lum(c) > 200 ? 0.45 : 0.3}
          filter={`url(#${id}-soft)`}
        />
        <rect x={B.x + B.w * 0.11} y={B.y + 6} width={B.w * 0.028} height={B.h - 12} rx="1" fill="#fff" opacity="0.85" />
        <rect x={B.x + B.w * 0.86} y={B.y + 8} width={B.w * 0.025} height={B.h - 16} rx="1" fill="#fff" opacity="0.3" />
      </g>
      <path d={s.body} fill="none" stroke={css(c, 0.45, 0.45)} strokeWidth="0.7" />
      {s.cap(id)}
    </svg>
  );
}

// ---------- component ----------

export type ProductShelfProps = {
  products?: Product[];
  currency?: string;
  className?: string;
  children?: ReactNode;
  /** Render seamlessly inside an existing page section instead of full-page standalone mode. */
  embedded?: boolean;
  /** Adapts shelf typography, frosted controls, and architectural ledges for a dark video/cinema backdrop. */
  darkStage?: boolean;
  /** Printed brand mark on each vessel & studio header. */
  brandName?: string;
  /** Optional external cart count to sync with global site header. */
  externalBagCount?: number;
  /** Callback fired when a user adds a product to bag. */
  onAddToBag?: (product: Product, qty: number, size: string, unitPrice: number) => void;
  /** Optional click handler for the bag button. */
  onBagClick?: () => void;
  /** Optional wishlist / Trunk Show saved state check. */
  isSaved?: (product: Product) => boolean;
  /** Optional callback to toggle saving a vessel to Private Trunk Show. */
  onToggleSave?: (product: Product, size: string, unitPrice: number) => void;
};

const SPRING = { type: "spring" as const, bounce: 0, duration: 0.55 };
const SHELF_META = [
  { id: 0, filterLabel: "01 · Daily Prep", plaque: "Shelf 01 — Barrier Cream, Serum, Mineral SPF & Essence", aria: "Daily barrier and prep" },
  { id: 1, filterLabel: "02 · Hydration & Lip", plaque: "Shelf 02 — Hyaluronic, Invisible Fluid, Peptide Lip & Cleanser", aria: "Hydration and cleanser" },
  { id: 2, filterLabel: "03 · Night & Parfum", plaque: "Shelf 03 — Botanical Hair, Glycolic Toning, Night Butter & Extrait", aria: "Night care and fragrance" },
] as const;

export function ProductShelf({
  products = DEFAULT_PRODUCTS,
  currency = "₹",
  className,
  children,
  embedded = false,
  darkStage = false,
  brandName,
  externalBagCount,
  onAddToBag,
  onBagClick,
  isSaved,
  onToggleSave,
}: ProductShelfProps) {
  const resolvedBrand = brandName ?? (embedded ? "SERA.JI" : "SKASMAN");
  const [openId, setOpenId] = useState(null as string | null);
  const [activeShelf, setActiveShelf] = useState<"all" | 0 | 1 | 2>("all");
  const [bag, setBag] = useState(0);
  const [bump, setBump] = useState(0);
  const bagRef = useRef(null as HTMLButtonElement | null);
  const overlayBagRef = useRef(null as HTMLButtonElement | null);
  const allRows = [products.slice(0, 4), products.slice(4, 8), products.slice(8, 12)];
  const visibleRows = activeShelf === "all" ? [0, 1, 2] : [activeShelf];
  const open = products.find((p) => p.id === openId) ?? null;
  const displayBag = externalBagCount !== undefined ? externalBagCount : bag;

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const wasLenisStopped = html.classList.contains("lenis-stopped");
    html.style.overflow = "hidden";
    html.classList.add("lenis-stopped");
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      if (!wasLenisStopped) {
        html.classList.remove("lenis-stopped");
      }
    };
  }, [openId]);

  const handleAdd = (product: Product, qty: number, size: string, unitPrice: number) => {
    setBag((b) => b + qty);
    setBump((n) => n + 1);
    onAddToBag?.(product, qty, size, unitPrice);
  };

  const renderBagButton = (
    ref: RefObject<HTMLButtonElement | null>,
    extraClass?: string,
    onClickOverride?: () => void,
    isDark = false,
  ) => (
    <button
      ref={ref}
      type="button"
      onClick={onClickOverride ?? onBagClick}
      aria-label={`Bag, ${displayBag} ${displayBag === 1 ? "item" : "items"}`}
      className={cn(
        "relative grid size-11 place-items-center rounded-full backdrop-blur-xl transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 active:scale-[0.95] focus-visible:outline-2",
        isDark
          ? "border border-white/25 bg-white/12 text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.45)] hover:bg-white/22 focus-visible:outline-white"
          : "border border-white/90 bg-white/80 text-[#2a1a12] shadow-[0_8px_24px_-8px_rgba(42,26,18,0.18)] hover:bg-white focus-visible:outline-[#2a1a12]",
        (onClickOverride ?? onBagClick) && "cursor-pointer",
        extraClass,
      )}
    >
      <ShoppingBag className="size-[18px]" strokeWidth={1.65} />
      {displayBag > 0 && (
        <motion.span
          key={bump}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING}
          className={cn(
            "absolute -top-1 -right-1 grid h-[19px] min-w-[19px] place-items-center rounded-full px-1 text-[10.5px] font-semibold tabular-nums shadow-sm",
            isDark ? "bg-white text-[#111111]" : "bg-[#2a1a12] text-[#fbf7f1]",
          )}
        >
          {displayBag}
        </motion.span>
      )}
    </button>
  );

  return (
    <div
      className={cn(
        "sera-shelf-scope relative w-full overflow-x-hidden font-sans antialiased",
        embedded
          ? darkStage
            ? "bg-transparent text-[#fbf8f3]"
            : "bg-transparent text-[#2a1a12]"
          : "min-h-dvh bg-[#f3f1ed] text-[#111111]",
        className,
      )}
    >
      {embedded ? (
        /* Sleek Atelier Filter & Bag Controls directly under Section 4's hero header */
        <div className="mx-auto w-full max-w-[1120px] px-4 pb-2 sm:px-8 sm:pb-4">
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 rounded-full p-1.5 pl-2 backdrop-blur-2xl sm:pr-2.5",
              darkStage
                ? "border border-white/18 bg-white/[0.08] shadow-[0_20px_48px_-20px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.16)]"
                : "border border-white/90 bg-white/70 shadow-[0_14px_34px_-22px_rgba(42,26,18,0.25)]",
            )}
          >
            <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Filter Atelier Shelves">
              <button
                type="button"
                role="tab"
                aria-selected={activeShelf === "all"}
                onClick={() => setActiveShelf("all")}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 text-[12px] font-medium tracking-[0.02em] transition-all duration-200",
                  activeShelf === "all"
                    ? darkStage
                      ? "bg-[#fbf8f3] text-[#14110f] shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
                      : "bg-[#2a1a12] text-[#fbf7f1] shadow-[0_6px_16px_-6px_rgba(42,26,18,0.45)]"
                    : darkStage
                      ? "bg-transparent text-white/75 hover:bg-white/12 hover:text-white"
                      : "bg-transparent text-[#5b4a3f] hover:bg-white/85 hover:text-[#2a1a12]",
                )}
              >
                All Editions (12)
              </button>
              {SHELF_META.map((meta) => (
                <button
                  key={meta.id}
                  type="button"
                  role="tab"
                  aria-selected={activeShelf === meta.id}
                  onClick={() => setActiveShelf(meta.id)}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-2 text-[12px] font-medium tracking-[0.02em] transition-all duration-200",
                    activeShelf === meta.id
                      ? darkStage
                        ? "bg-[#fbf8f3] text-[#14110f] shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
                        : "bg-[#2a1a12] text-[#fbf7f1] shadow-[0_6px_16px_-6px_rgba(42,26,18,0.45)]"
                      : darkStage
                        ? "bg-transparent text-white/75 hover:bg-white/12 hover:text-white"
                        : "bg-transparent text-[#5b4a3f] hover:bg-white/85 hover:text-[#2a1a12]",
                  )}
                >
                  {meta.filterLabel}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-3.5">
              <span
                className={cn(
                  "hidden items-center gap-1.5 text-[11.5px] font-medium lg:inline-flex",
                  darkStage ? "text-white/72" : "text-[#7a6a5e]",
                )}
              >
                <Rotate3d className={cn("size-3.5", darkStage ? "text-white/90" : "text-[#2a1a12]")} />
                Click any vessel to inspect &amp; spin 360°
              </span>
              {renderBagButton(bagRef, undefined, undefined, darkStage)}
            </div>
          </div>
        </div>
      ) : (
        /* Standalone mode: wordmark top left, bag top right */
        <>
          <div className="pointer-events-none fixed top-4 left-5 z-30 flex h-11 items-center text-[15px] font-semibold tracking-[0.18em]">
            {resolvedBrand}
          </div>
          {renderBagButton(bagRef, "fixed top-4 right-4 z-30")}
        </>
      )}

      <LayoutGroup>
        <main
          className={cn(
            "mx-auto w-full max-w-[1120px] px-2 sm:px-8",
            embedded ? "pt-6 pb-4 sm:pt-8 sm:pb-6" : "pt-16 pb-12",
          )}
        >
          {visibleRows.map((r) => {
            const row = allRows[r];
            const meta = SHELF_META[r];
            return (
              <section
                key={r}
                aria-label={meta.aria}
                className="relative mb-12 last:mb-0 sm:mb-14"
              >
                {embedded && (
                  <div className="mb-3 flex items-center justify-between px-2 sm:px-6">
                    <span
                      className={cn(
                        "text-[10px] font-medium tracking-[0.16em] uppercase",
                        darkStage ? "text-white/65" : "text-[#8a7a6e]",
                      )}
                    >
                      {meta.plaque}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] tracking-[0.12em] uppercase",
                        darkStage ? "text-white/48" : "text-[#9b8b7e]",
                      )}
                    >
                      4 Vessels
                    </span>
                  </div>
                )}

                {/* Softbox overhead studio light cone */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-x-[6%] top-2 h-[78%] rounded-full",
                    darkStage
                      ? "bg-[radial-gradient(50%_80%_at_50%_46%,rgba(255,255,255,0.11),transparent_74%)]"
                      : "bg-[radial-gradient(50%_80%_at_50%_42%,rgba(255,253,249,0.75),transparent_75%)]",
                  )}
                />

                <div className="relative z-10 grid grid-cols-2 items-end gap-4 px-2 sm:grid-cols-4 sm:gap-8 sm:px-6">
                  {row.map((p) => (
                    <div key={p.id} className="flex flex-col items-center">
                      {openId === p.id ? (
                        <div className="aspect-[2/3] w-full max-w-[144px] sm:max-w-[158px]" />
                      ) : (
                        <motion.button
                          layoutId={`product-${p.id}`}
                          type="button"
                          onClick={() => setOpenId(p.id)}
                          aria-label={`${p.name}, ${currency}${p.price}`}
                          transition={SPRING}
                          className={cn(
                            "group relative aspect-[2/3] w-full max-w-[144px] cursor-pointer rounded-2xl bg-transparent outline-none transition-transform duration-300 ease-out hover:-translate-y-1.5 focus-visible:ring-2 sm:max-w-[158px]",
                            darkStage ? "focus-visible:ring-white" : "focus-visible:ring-[#2a1a12]",
                          )}
                        >
                          {/* Subtle hover halo behind the vessel */}
                          <span
                            aria-hidden
                            className={cn(
                              "pointer-events-none absolute inset-x-3 top-6 bottom-3 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100",
                              darkStage
                                ? "bg-[radial-gradient(circle,rgba(255,255,255,0.24)_0%,transparent_72%)]"
                                : "bg-[radial-gradient(circle,rgba(255,248,235,0.95)_0%,transparent_72%)]",
                            )}
                          />
                          <ProductArt p={p} brandName={resolvedBrand} className="relative z-10 size-full" />
                          {/* Delicate hover inspect pill */}
                          <span className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 translate-y-1 rounded-full border border-white/90 bg-white/88 px-2.5 py-0.5 text-[10px] font-medium tracking-[0.06em] whitespace-nowrap text-[#2a1a12] uppercase opacity-0 shadow-[0_6px_16px_rgba(42,26,18,0.14)] backdrop-blur-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                            Inspect 360°
                          </span>
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Floating architectural shelf: illuminated top plane, crisp front bevel, deep drop shadow */}
                <div aria-hidden className="relative -mt-[10px] h-[18px]">
                  <div
                    className={cn(
                      "absolute inset-x-0 top-0 h-[9px] rounded-t-[2px]",
                      darkStage
                        ? "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.48),rgba(255,255,255,0.92))]"
                        : embedded
                          ? "bg-[linear-gradient(to_bottom,#ece4d8,#fdfbf7)]"
                          : "bg-[linear-gradient(to_bottom,#e6e6ea,#fbfbfd)]",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-x-0 top-[9px] h-[9px] rounded-b-[3px]",
                      darkStage
                        ? "bg-[linear-gradient(to_bottom,#ffffff,rgba(214,220,232,0.82))] shadow-[0_4px_24px_rgba(255,255,255,0.16)]"
                        : embedded
                          ? "bg-[linear-gradient(to_bottom,#ffffff,#e7ded1)] shadow-[0_1px_0_rgba(42,26,18,0.06)]"
                          : "bg-[linear-gradient(to_bottom,#ffffff,#ececf0)] shadow-[0_1px_0_rgba(0,0,0,0.04)]",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-x-[2%] top-[18px] h-[36px]",
                      darkStage
                        ? "bg-[radial-gradient(50%_100%_at_50%_0%,rgba(0,0,0,0.75),transparent)]"
                        : embedded
                          ? "bg-[radial-gradient(50%_100%_at_50%_0%,rgba(42,26,18,0.15),transparent)]"
                          : "bg-[radial-gradient(50%_100%_at_50%_0%,rgba(0,0,0,0.13),transparent)]",
                    )}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 px-2 sm:grid-cols-4 sm:gap-8 sm:px-6">
                  {row.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setOpenId(p.id)}
                      className="group cursor-pointer bg-transparent text-center transition-opacity duration-200 hover:opacity-85"
                    >
                      <div
                        className={cn(
                          "text-[10px] font-medium tracking-[0.12em] uppercase",
                          darkStage ? "text-white/58" : "text-[#8a7a6e]",
                        )}
                      >
                        {p.category}
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 text-[13.5px] leading-snug font-medium group-hover:underline group-hover:underline-offset-4 sm:text-[14px]",
                          darkStage
                            ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]"
                            : "text-[#2a1a12]",
                        )}
                      >
                        {p.short}
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 text-[12.5px] font-medium tabular-nums sm:text-[13px]",
                          darkStage ? "text-white/80" : "text-[#5b4a3f]",
                        )}
                      >
                        {currency}
                        {p.price.toLocaleString('en-IN')}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </main>

        {/* Portal ProductPage to document.body while keeping LayoutGroup context intact so
            shared-element layoutId transitions never clip inside parent rounded containers */}
        {typeof document !== "undefined" &&
          createPortal(
            <AnimatePresence>
              {open && (
                <ProductPage
                  key={open.id}
                  p={open}
                  currency={currency}
                  brandName={resolvedBrand}
                  embedded={embedded}
                  displayBag={displayBag}
                  bump={bump}
                  saved={isSaved ? isSaved(open) : false}
                  onToggleSave={
                    onToggleSave
                      ? (size, unitPrice) => onToggleSave(open, size, unitPrice)
                      : undefined
                  }
                  onClose={() => setOpenId(null)}
                  onAdd={(qty, size, unitPrice) => handleAdd(open, qty, size, unitPrice)}
                  bagRef={embedded ? overlayBagRef : bagRef}
                  onBagClick={
                    onBagClick
                      ? () => {
                          setOpenId(null);
                          onBagClick();
                        }
                      : undefined
                  }
                />
              )}
            </AnimatePresence>,
            document.body,
          )}
      </LayoutGroup>
      {children}
    </div>
  );
}

function ProductPage({
  p,
  currency,
  brandName,
  embedded,
  displayBag,
  bump,
  saved,
  onToggleSave,
  onClose,
  onAdd,
  bagRef,
  onBagClick,
}: {
  p: Product;
  currency: string;
  brandName: string;
  embedded: boolean;
  displayBag: number;
  bump: number;
  saved?: boolean;
  onToggleSave?: (size: string, unitPrice: number) => void;
  onClose: () => void;
  onAdd: (qty: number, size: string, unitPrice: number) => void;
  bagRef: RefObject<HTMLButtonElement | null>;
  onBagClick?: () => void;
}) {
  const reduce = useReducedMotion();
  const spin = useMotionValue(0);
  const [size, setSize] = useState(p.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [section, setSection] = useState("Details" as string | null);
  const closeRef = useRef(null as HTMLButtonElement | null);
  const drag = useRef(null as { x: number; v: number; samples: { x: number; t: number }[] } | null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    if (reduce) return;
    // one turn as it arrives, the print wrapping right round
    const c = animate(spin, 1, { duration: 1.1, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 });
    return () => c.stop();
  }, [spin, reduce]);

  const price = p.price * (p.sizes.indexOf(size) > 0 ? 1.7 : 1);
  const add = () => {
    onAdd(qty, size, price);
    setAdded(true);
    bagRef.current?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }],
      { duration: 320, easing: "ease-out" },
    );
    setTimeout(() => setAdded(false), 1800);
  };

  const triggerSpin360 = () => {
    spin.stop();
    animate(spin, Math.round(spin.get()) + 1, {
      duration: 1.05,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  // drag to turn: 1:1 while held, then keep the release speed and settle facing front
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    spin.stop();
    drag.current = { x: e.clientX, v: spin.get(), samples: [{ x: e.clientX, t: e.timeStamp }] };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    spin.set(d.v - (e.clientX - d.x) / 380);
    d.samples.push({ x: e.clientX, t: e.timeStamp });
    if (d.samples.length > 5) d.samples.shift();
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const vx = last.t > first.t ? ((last.x - first.x) / (last.t - first.t)) * 1000 : 0; // px/s
    const velocity = -vx / 380; // turns/s
    const projected = spin.get() + ((velocity / 1000) * 0.998) / (1 - 0.998); // Apple's momentum projection
    animate(spin, Math.round(projected), { type: "spring", bounce: 0, duration: 0.9, velocity });
  };

  const sections: [string, ReactNode][] = [
    [
      "Details",
      <div key="d" className="space-y-3">
        <ul className="list-disc space-y-1.5 pl-5">
          {p.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        {p.studioImage && (
          <div className="mt-3.5 flex items-center gap-3.5 rounded-2xl border border-white/90 bg-white/80 p-3 shadow-[0_8px_20px_-12px_rgba(42,26,18,0.18)]">
            <img
              src={p.studioImage}
              alt={`${p.name} botanical atelier note`}
              loading="lazy"
              className="size-14 shrink-0 rounded-xl object-cover"
            />
            <div className="text-[13px] leading-snug text-[#5b4a3f]">
              <strong className="block font-semibold text-[#2a1a12]">Sera.ji Botanical Formulation</strong>
              Small-batch compounded in Italy and dermatologically verified for enduring skin poise.
            </div>
          </div>
        )}
      </div>,
    ],
    ["Ingredients", <p key="i">{p.ingredients}</p>],
    ["How to use", <p key="h">{p.howTo}</p>],
  ];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={p.name}
      data-lenis-prevent=""
      className="sera-shelf-scope fixed inset-0 z-[1500] overflow-y-auto overscroll-contain font-sans text-[#2a1a12] antialiased"
    >
      <motion.div
        className={cn(
          "fixed inset-0",
          embedded
            ? "bg-[linear-gradient(180deg,#f8f4ed_0%,#f3ece1_55%,#ede4d6_100%)]"
            : "bg-[#f3f1ed]",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Top Studio Navigation Bar */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22 }}
        className="sticky top-0 z-[1510] border-b border-black/[0.05] bg-[#f7f2ea]/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-[1160px] items-center justify-between px-5 sm:px-10">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/90 bg-white/80 px-4 py-2 text-[13px] font-medium text-[#2a1a12] shadow-[0_4px_14px_-6px_rgba(42,26,18,0.2)] transition-all duration-200 hover:-translate-x-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-[#2a1a12]"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
            <span>Back to Atelier Shelf</span>
          </button>

          <div className="hidden items-center gap-2 text-[12px] font-semibold tracking-[0.2em] text-[#2a1a12] uppercase sm:flex">
            <span>{brandName}</span>
            <span className="text-[#a49384]">·</span>
            <span className="font-normal tracking-[0.14em] text-[#6f6156]">Atelier Studio</span>
          </div>

          <button
            ref={bagRef}
            type="button"
            onClick={onBagClick}
            aria-label={`Bag, ${displayBag} ${displayBag === 1 ? "item" : "items"}`}
            className={cn(
              "relative grid size-10 place-items-center rounded-full border border-white/90 bg-white/85 text-[#2a1a12] shadow-[0_4px_14px_-4px_rgba(42,26,18,0.18)] transition-all duration-200 hover:bg-white active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-[#2a1a12]",
              onBagClick && "cursor-pointer",
            )}
          >
            <ShoppingBag className="size-[17px]" strokeWidth={1.65} />
            {displayBag > 0 && (
              <motion.span
                key={bump}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={SPRING}
                className="absolute -top-1 -right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#2a1a12] px-1 text-[10px] font-semibold text-[#fbf7f1] tabular-nums"
              >
                {displayBag}
              </motion.span>
            )}
          </button>
        </div>
      </motion.header>

      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1160px] grid-cols-1 items-center gap-10 px-5 py-10 sm:px-10 md:grid-cols-[1.05fr_1fr] md:gap-14 md:py-12">
        {/* Studio Pedestal & 360° Interactive Vessel */}
        <div className="relative flex flex-col items-center justify-center md:min-h-[560px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(255,252,246,0.92)_0%,transparent_70%)] blur-xl"
          />

          <motion.div
            layoutId={`product-${p.id}`}
            transition={SPRING}
            className="relative z-10 aspect-[2/3] h-[42vh] cursor-grab touch-none select-none active:cursor-grabbing md:h-[58vh]"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {/* small packs (lip tube, balm, jars) zoom up from where they stand to fill the frame */}
            <motion.div
              className="pointer-events-none size-full"
              style={{ transformOrigin: "50% 95.6%" }}
              initial={{ scale: 1 }}
              animate={{ scale: pageZoom(p.kind) }}
              exit={{ scale: 1 }}
              transition={SPRING}
            >
              <ProductArt p={p} spin={spin} brandName={brandName} className="size-full" />
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden
            className="relative -mt-[2.8%] h-[18px] w-[82%] rounded-[4px] bg-[linear-gradient(to_bottom,#ffffff,#e8dfd2)] shadow-[0_22px_44px_-12px_rgba(42,26,18,0.22)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/60 px-3.5 py-1.5 text-[12px] text-[#6f6156] backdrop-blur-md">
              <Rotate3d className="size-3.5 text-[#2a1a12]" />
              Drag vessel to rotate
            </span>
            <button
              type="button"
              onClick={triggerSpin360}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#2a1a12]/15 bg-white/85 px-3.5 py-1.5 text-[12px] font-medium text-[#2a1a12] transition-colors hover:bg-[#2a1a12] hover:text-[#fbf7f1]"
            >
              Spin 360° ↻
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ ...SPRING, delay: 0.05 }}
          className="relative z-20"
        >
          <span className="inline-block rounded-full border border-white/90 bg-white/75 px-3 py-1 text-[10.5px] font-medium tracking-[0.14em] text-[#5b4a3f] uppercase">
            {p.category} · Sera.ji Edition
          </span>

          <h2 className="mt-3 text-[clamp(30px,3.8vw,42px)] leading-[1.06] font-normal tracking-[-0.03em] text-[#2a1a12]">
            {p.name}
          </h2>
          <p className="mt-2 text-[17px] leading-snug text-[#6f6156]">{p.tagline}</p>

          <div className="mt-3.5 flex items-center gap-2 text-[13.5px] text-[#6f6156]">
            <span className="flex text-[#2a1a12]" aria-label={`Rated ${p.rating} out of 5`}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className="size-[14px]"
                  fill={i < Math.round(p.rating) ? "#2a1a12" : "transparent"}
                  strokeWidth={1.5}
                />
              ))}
            </span>
            <span>
              {p.rating.toFixed(1)} · {p.reviews.toLocaleString()} client reviews
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-2.5 tabular-nums">
            <span className="text-[26px] font-medium tracking-[-0.02em] text-[#2a1a12]">
              {currency}
              {Math.round(price).toLocaleString('en-IN')}
            </span>
            {p.compareAt && (
              <span className="text-[16px] text-[#8f8479] line-through">
                {currency}
                {Math.round(p.compareAt * (price / p.price)).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <p className="mt-4 max-w-[54ch] text-[15.5px] leading-[1.58] text-[#4b3a30]">{p.description}</p>

          <fieldset className="mt-7">
            <legend className="mb-2.5 text-[13px] font-medium tracking-[0.08em] text-[#6f6156] uppercase">
              Select Volume
            </legend>
            <div className="grid grid-cols-2 gap-2.5">
              {p.sizes.map((sz, i) => {
                const on = size === sz;
                return (
                  <label
                    key={sz}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3.5 text-[14.5px] transition-all duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#2a1a12]",
                      on
                        ? "border-[#2a1a12] bg-[#fdfbf8] shadow-[0_0_0_1px_#2a1a12]"
                        : "border-[#d8cfc4] bg-white/75 hover:border-[#8f8479] hover:bg-white",
                    )}
                  >
                    <input type="radio" name="size" value={sz} checked={on} onChange={() => setSize(sz)} className="sr-only" />
                    <span className="font-medium text-[#2a1a12]">{sz}</span>
                    <span className="text-[#6f6156] tabular-nums">
                      {currency}
                      {Math.round(p.price * (i > 0 ? 1.7 : 1)).toLocaleString('en-IN')}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7 flex items-stretch gap-2.5">
            <div className="flex items-center rounded-full border border-[#d8cfc4] bg-white/90 px-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-10 cursor-pointer place-items-center rounded-full bg-transparent text-[#2a1a12] transition-colors hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:text-[#cfc6bb]"
                disabled={qty === 1}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-7 text-center text-[15.5px] font-medium text-[#2a1a12] tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                className="grid size-10 cursor-pointer place-items-center rounded-full bg-transparent text-[#2a1a12] transition-colors hover:bg-black/[0.04]"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={add}
              className="h-12 flex-1 cursor-pointer rounded-full bg-[#3b2116] px-6 text-[13.5px] font-medium tracking-[0.06em] text-[#f6ede2] uppercase shadow-[0_14px_28px_-12px_rgba(59,33,22,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a1a12] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a1a12]"
            >
              <span aria-live="polite">{added ? "Added to Sera.ji Bag ✓" : "Add to Bag"}</span>
            </button>

            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(size, price)}
                aria-label={saved ? "Remove from Private Trunk Show" : "Save to Private Trunk Show"}
                title={saved ? "Saved in Trunk Show" : "Save to Private Trunk Show"}
                className={cn(
                  "grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border transition-all duration-200",
                  saved
                    ? "border-[#2a1a12] bg-[#2a1a12] text-[#fbf7f1]"
                    : "border-[#d8cfc4] bg-white/85 text-[#2a1a12] hover:border-[#2a1a12] hover:bg-white",
                )}
              >
                <Heart className="size-[18px]" fill={saved ? "currentColor" : "none"} strokeWidth={1.7} />
              </button>
            )}
          </div>

          <dl className="mt-6 grid gap-1.5 rounded-2xl border border-white/80 bg-white/55 px-4 py-3 text-[13px] leading-snug backdrop-blur-sm">
            <div className="flex gap-2">
              <dt className="font-semibold text-[#2a1a12]">Express Delivery:</dt>
              <dd className="text-[#5b4a3f]">Complimentary insured courier, arrives in 2–3 business days</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-[#2a1a12]">Salon Pickup:</dt>
              <dd className="text-[#5b4a3f]">Available today across Sera.ji Milan, Paris &amp; London studios</dd>
            </div>
          </dl>

          <div className="mt-7 border-t border-[#d8cfc4]">
            {sections.map(([title, body]) => {
              const isOpen = section === title;
              return (
                <div key={title} className="border-b border-[#d8cfc4]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setSection(isOpen ? null : title)}
                    className="flex w-full cursor-pointer items-center justify-between bg-transparent py-4 text-left text-[15.5px] font-medium tracking-[-0.01em] text-[#2a1a12] focus-visible:outline-2 focus-visible:outline-[#2a1a12]"
                  >
                    {title}
                    <ChevronDown
                      className={cn("size-[18px] text-[#6f6156] transition-transform duration-300", isOpen && "rotate-180")}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={SPRING}
                        className="overflow-hidden"
                      >
                        <div className="pb-5 text-[14.5px] leading-relaxed text-[#4b3a30]">{body}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
