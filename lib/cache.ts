import { unstable_cache } from 'next/cache';
import type { Project } from '@/types';

const REVALIDATE = 300; // 5 minutes

/**
 * Cached server-side fetch of all projects.
 * Revalidates every 5 minutes; use `revalidateTag('projects')` to flush instantly.
 */
export const getCachedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) return [];
    const { db } = await import('@/lib/firebaseAdmin');
    const snap = await db.collection('projects').orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[];
  },
  ['projects'],
  { revalidate: REVALIDATE, tags: ['projects'] }
);

export const getCachedFeaturedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) return [];
    const { db } = await import('@/lib/firebaseAdmin');
    const snap = await db
      .collection('projects')
      .where('featured', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(3)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[];
  },
  ['featured-projects'],
  { revalidate: REVALIDATE, tags: ['projects'] }
);

export const getCachedProject = unstable_cache(
  async (slug: string): Promise<Project | null> => {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) return null;
    const { db } = await import('@/lib/firebaseAdmin');
    const snap = await db.collection('projects').where('slug', '==', slug).limit(1).get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Project;
  },
  ['project'],
  { revalidate: REVALIDATE, tags: ['projects'] }
);

export const getCachedLegal = unstable_cache(
  async (type: string) => {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) return null;
    const { db } = await import('@/lib/firebaseAdmin');
    const snap = await db.collection('legals').where('type', '==', type).limit(1).get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
  },
  ['legal'],
  { revalidate: 3600, tags: ['legals'] } // 1 hour — rarely changes
);
