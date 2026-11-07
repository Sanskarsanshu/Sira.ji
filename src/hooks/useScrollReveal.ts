import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1) Split headings into words, keeping nested spans and <br>
    document.querySelectorAll('[data-split]').forEach((el) => {
      // Avoid re-splitting if already processed
      if (el.querySelector('.w')) return;

      let i = 0;
      const walk = (node: Node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent?.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                frag.appendChild(document.createTextNode(' '));
                return;
              }
              const w = document.createElement('span');
              w.className = 'w';
              const s = document.createElement('span');
              s.textContent = part;
              s.style.setProperty('--i', String(i++));
              w.appendChild(s);
              frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && (n as Element).tagName !== 'BR') {
            walk(n);
          }
        });
      };
      walk(el);
    });

    // 2) Count-up animation
    const countUp = (el: HTMLElement) => {
      const end = +(el.dataset.count || 0);
      const t0 = performance.now();
      const dur = reduce ? 1 : 2000;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    // 3) Reveal on scroll
    const reveal = (el: Element) => {
      if (el.classList.contains('in')) return;
      el.classList.add('in');
      el.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);

      if (el.id === 'gauge-card') {
        const gArc = document.getElementById('g-arc');
        if (gArc) gArc.style.strokeDashoffset = String(252 * (1 - 0.94));
      }
      if (el.id === 'match-card') {
        const ringArc = document.getElementById('ring-arc');
        if (ringArc) ringArc.style.strokeDashoffset = String(163.4 * (1 - 0.94));
      }
    };

    const targets = document.querySelectorAll('.rv, [data-split]');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    targets.forEach((el) => io.observe(el));

    // Safety net sweep: reveal anything already on screen
    const sweep = () => {
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.94 && r.bottom > 0) {
          reveal(el);
        }
      });
    };

    requestAnimationFrame(() => requestAnimationFrame(sweep));
    window.addEventListener('load', sweep);

    return () => {
      io.disconnect();
      window.removeEventListener('load', sweep);
    };
  }, []);
}
