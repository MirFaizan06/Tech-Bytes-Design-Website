import type { Metadata } from 'next';
import { PricingSection } from './PricingSection';
import { RequestForm } from './RequestForm';

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description:
    'Explore our web development packages and request a custom project. Transparent pricing, no hidden fees.',
};

export default function RequestDevelopmentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Services & <span className="gradient-text">Pricing</span>
        </h1>
        <p className="text-white/50 max-w-2xl mx-auto text-lg">
          Straightforward pricing for every stage of your digital journey. All plans include source code delivery, mobile responsiveness, and post-launch support.
        </p>
      </div>

      <PricingSection />

      <div className="mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Request a Project</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Tell us about your idea. We'll get back to you with a tailored proposal within 24 hours.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <RequestForm />
        </div>
      </div>
    </div>
  );
}
