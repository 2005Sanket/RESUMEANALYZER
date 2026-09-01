import type { SectionAnalysis } from '@/types';
import { Check, X } from 'lucide-react';

interface SectionCheckProps {
  sections: SectionAnalysis[];
}

export function SectionCheck({ sections }: SectionCheckProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Resume Sections</h3>
      <div className="space-y-2">
        {sections.map((section) => (
          <div
            key={section.name}
            className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              {section.present ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-4 w-4 text-green-600" />
                </span>
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
                  <X className="h-4 w-4 text-red-500" />
                </span>
              )}
              <div>
                <p className="text-sm font-medium text-slate-800">{section.name}</p>
                <p className="text-xs text-slate-400">{section.description}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                section.quality === 'good'
                  ? 'bg-green-100 text-green-700'
                  : section.quality === 'fair'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {section.quality === 'good' ? 'Found' : section.quality === 'fair' ? 'Partial' : 'Missing'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
