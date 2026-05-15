'use client';

import dynamic from 'next/dynamic';

const HeroAnimationInner = dynamic(
  () => import('./HeroAnimation').then((m) => m.HeroAnimation),
  { ssr: false }
);

export function HeroAnimationClient() {
  return <HeroAnimationInner />;
}
