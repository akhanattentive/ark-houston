import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scroll, stormCurve } from './scrollState';

gsap.registerPlugin(ScrollTrigger);

const EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Boots Lenis and turns the page into a snap deck: each wheel / key / swipe
 * gesture animates directly to the next or previous full-height section, so a
 * panel is never left half-scrolled. Lenis still provides the buttery
 * animated `scrollTo`; we just drive the navigation instead of free-scrolling.
 */
export function useLenis(): void {
  useEffect(() => {
    // Reduced motion: leave plain native scrolling in place, no deck behaviour.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: EASE,
      smoothWheel: false, // we handle wheel ourselves for paging
    });

    lenis.on('scroll', (e: { progress: number; velocity: number }) => {
      scroll.progress = e.progress;
      scroll.velocity = e.velocity;
      scroll.storm = stormCurve(e.progress);
      ScrollTrigger.update();
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const getSections = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>('.content section, .content footer.act'),
      );

    let index = 0;
    let locked = false;

    const indexFromScroll = () => {
      const ss = getSections();
      const y = window.scrollY;
      let best = 0;
      let bestDist = Infinity;
      ss.forEach((s, i) => {
        const d = Math.abs(s.offsetTop - y);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    };
    index = indexFromScroll();

    const goTo = (target: number) => {
      const ss = getSections();
      const clamped = Math.max(0, Math.min(ss.length - 1, target));
      index = clamped;
      locked = true;
      lenis.scrollTo(ss[clamped], {
        offset: 0,
        duration: 1.0,
        easing: EASE,
        lock: true, // ignore user input mid-animation
        onComplete: () => {
          // brief cooldown so trailing trackpad inertia doesn't over-shoot
          window.setTimeout(() => {
            locked = false;
          }, 140);
        },
      });
    };

    const page = (dir: number) => {
      if (locked) return;
      const next = index + dir;
      if (next < 0 || next > getSections().length - 1) return;
      goTo(next);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // let pinch-zoom pass through
      e.preventDefault();
      if (locked || Math.abs(e.deltaY) < 6) return;
      page(e.deltaY > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        page(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        page(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(getSections().length - 1);
      }
    };

    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY == null) return;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 40) page(dy > 0 ? 1 : -1);
      touchY = null;
    };

    // In-page anchor links (top nav) become deck jumps.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const i = getSections().indexOf(el as HTMLElement);
      if (i >= 0) goTo(i);
    };

    const onResize = () => {
      index = indexFromScroll();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
