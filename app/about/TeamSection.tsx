'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { TeamMember } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/PageSkeleton';
import { FiUsers } from 'react-icons/fi';

export function TeamSection() {
  const { data: team, loading } = useFirestoreCollection<TeamMember>('team');

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (team.length === 0) {
    return <EmptyState title="Team info coming soon" icon={<FiUsers className="w-8 h-8" />} />;
  }

  const socialIcons = { linkedin: FiLinkedin, twitter: FiTwitter, github: FiGithub };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {team.map((member, i) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -4 }}
          className="glass rounded-2xl overflow-hidden group"
        >
          <div className="relative h-48 bg-gradient-to-br from-violet-900/30 to-blue-900/20 overflow-hidden">
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/20">
                {member.name[0]}
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-white">{member.name}</h3>
            <p className="text-sm text-violet-400 mb-2">{member.role}</p>
            <p className="text-sm text-white/50 line-clamp-3 mb-4">{member.bio}</p>
            <div className="flex gap-2">
              {Object.entries(member.socialLinks ?? {}).map(([key, url]) => {
                if (!url) return null;
                const Icon = socialIcons[key as keyof typeof socialIcons];
                if (!Icon) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-violet-500/20 flex items-center justify-center text-white/40 hover:text-violet-300 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
