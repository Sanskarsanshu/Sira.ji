import { useEffect } from 'react';
import Lenis from 'lenis';

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
    };
  }, []);
}
