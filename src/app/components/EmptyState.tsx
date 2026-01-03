import React from 'react';
import { CheckCheck, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-due-backs' | 'cleaning-empty';
  title: string;
  description: string;
}

export function EmptyState({ type, title, description }: EmptyStateProps) {
  const icons = {
    'no-due-backs': CheckCheck,
    'cleaning-empty': Sparkles
  };
  
  const Icon = icons[type];
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <Icon className="w-16 h-16 text-[#3B82F6] mb-4 opacity-50" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#A1A1AA] max-w-md">{description}</p>
    </div>
  );
}