'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      gsap.from('.hero-tag', { opacity: 0, y: 20, duration: 0.6, delay: 0.1 });
      gsap.from('.hero-title', { opacity: 0, y: 40, duration: 0.8, delay: 0.3, ease: 'power3.out' });
      gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.7, delay: 0.6 });
      gsap.from('.hero-cta', { opacity: 0, y: 20, duration: 0.6, delay: 0.9 });
      gsap.from('.hero-stats', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        delay: 1.1,
      });

      // Floating orbs
      gsap.to('.orb-1', {
        y: -30,
        x: 15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.orb-2', {
        y: 20,
        x: -20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });
    },
    { scope: containerRef }
  );

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
}
