import { useEffect } from 'react';
import Lenis from 'lenis';

export function scrollToTarget(
  target: HTMLElement | string | number | null,
  options: { offset?: number; duration?: number; immediate?: boolean } = {}
) {
  if (!target && typeof target !== 'number') return;
  const { offset = -86, duration = 0.8, immediate = false } = options;

  if (typeof window === 'undefined') return;

  const lenis = (window as any).__lenis || (window as any).lenisInstance;
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(target, {
      offset,
      duration: immediate ? 0 : duration,
      force: true,
      immediate,
    });
    return;
  }

  let targetY = 0;
  if (typeof target === 'number') {
    targetY = target + offset;
  } else if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (el) {
      targetY = window.scrollY + el.getBoundingClientRect().top + offset;
    }
  } else if (target instanceof HTMLElement) {
    targetY = window.scrollY + target.getBoundingClientRect().top + offset;
  }
  window.scrollTo({
    top: Math.max(0, targetY),
    behavior: immediate ? 'auto' : 'smooth',
  });
}

export function useLenis() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const nav = document.getElementById('nav');
    const hand = document.getElementById('hand-img');
    const stage = document.getElementById('stage');

    const onScroll = () => {
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 20);
      }
      if (hand && stage) {
        const r = stage.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
        hand.style.transform = `translate3d(0, ${(-p * 12).toFixed(2)}%, 0)`;
      }
    };

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    (window as any).__lenis = lenis;
    (window as any).lenisInstance = lenis;

    lenis.on('scroll', onScroll);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      (window as any).__lenis = null;
      (window as any).lenisInstance = null;
    };
  }, []);
}
