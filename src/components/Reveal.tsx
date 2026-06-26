import { useRef, useLayoutEffect, type ReactNode, type ElementType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** stagger reveal of direct children instead of the element itself */
  stagger?: boolean;
  y?: number;
  delay?: number;
}

/**
 * Fades + lifts content as it drifts into view, like ink settling onto the
 * page. With `stagger`, each direct child rises in sequence.
 */
export function Reveal({
  children,
  className,
  as: Tag = 'div',
  stagger = false,
  y = 40,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null!);

  useLayoutEffect(() => {
    const el = ref.current;
    const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y, filter: 'blur(6px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          delay,
          ease: 'power3.out',
          stagger: stagger ? 0.14 : 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, y, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
