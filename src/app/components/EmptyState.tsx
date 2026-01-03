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
      <Icon className="w-12 h-12 text-[#3B82F6] mb-3 opacity-50" />
      <h3 className="text-base font-semibold text-[#1A1A1D] mb-2">{title}</h3>
      <p className="text-sm text-[#6B7280] max-w-md">{description}</p>
    </div>
  );
}