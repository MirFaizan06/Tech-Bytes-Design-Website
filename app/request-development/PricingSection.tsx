'use client';

import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { PricingPlan } from '@/types';
import { orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { CardSkeleton } from '@/components/ui/PageSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export function PricingSection() {
  const { data: plans, loading } = useFirestoreCollection<PricingPlan>('pricing', [
    orderBy('order', 'asc'),
  ]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <EmptyState
        title="Pricing plans coming soon"
        description="We're putting together our service packages. Contact us for a custom quote."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan, i) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-2xl p-7 flex flex-col hover:border-violet-500/30 transition-colors"
        >
          <h3 className="text-lg font-bold text-white mb-1">{plan.serviceName}</h3>
          <p className="text-sm text-white/50 mb-5">{plan.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-black text-white">
              ₹{plan.startingPrice.toLocaleString('en-IN')}
            </span>
            {plan.upToPrice > plan.startingPrice && (
              <span className="text-white/40 text-sm ml-2">
                – ₹{plan.upToPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <ul className="space-y-2.5 mb-8 flex-1">
            {plan.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-white/60">
                <FiCheck className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <a
            href="#request-form"
            className="block text-center py-2.5 px-4 rounded-xl bg-violet-600/20 hover:bg-violet-600 border border-violet-500/30 text-violet-300 hover:text-white text-sm font-medium transition-all duration-200"
          >
            Get Started
          </a>
        </motion.div>
      ))}
    </div>
  );
}
