import { MetadataRoute } from 'next';
import { db } from '@/lib/firebaseAdmin';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.techbytesdesign.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/request-development`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  try {
    const snap = await db.collection('projects').get();
    const projectPages: MetadataRoute.Sitemap = snap.docs.map((doc) => ({
      url: `${BASE}/projects/${doc.data().slug}`,
      lastModified: doc.data().createdAt?.toDate() ?? new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
    return [...staticPages, ...projectPages];
  } catch {
    return staticPages;
  }
}
