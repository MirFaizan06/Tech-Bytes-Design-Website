import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  images: string[];
  completionDate: Timestamp | Date;
  featured: boolean;
  createdAt: Timestamp | Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface PricingPlan {
  id: string;
  serviceName: string;
  description: string;
  startingPrice: number;
  upToPrice: number;
  benefits: string[];
  order: number;
}

export interface Legal {
  id: string;
  type: string;
  content: string;
  pdfUrl?: string;
}

export interface Submission {
  id: string;
  type: 'contact' | 'request-development';
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
  ip: string;
  userAgent: string;
  createdAt: Timestamp | Date;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  aboutIntro: string;
  [key: string]: string;
}
