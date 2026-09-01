import { Check, X, Plus } from 'lucide-react';

interface SkillBreakdownProps {
  matched: string[];
  missing: string[];
  extra: string[];
}

export function SkillBreakdown({ matched, missing, extra }: SkillBreakdownProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
        Skill Analysis
      </h3>

      {/* Matched Skills */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <Check className="h-3.5 w-3.5 text-green-600" />
          </span>
          <span className="text-sm font-medium text-slate-700">
            Matched Skills ({matched.length})
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pl-8">
          {matched.length === 0 ? (
            <p className="text-sm text-slate-400">No matched skills found.</p>
          ) : (
            matched.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200"
              >
                {skill}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
            <X className="h-3.5 w-3.5 text-red-600" />
          </span>
          <span className="text-sm font-medium text-slate-700">
            Missing Skills ({missing.length})
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pl-8">
          {missing.length === 0 ? (
            <p className="text-sm text-slate-400">No missing skills - great match!</p>
          ) : (
            missing.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200"
              >
                {skill}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Extra Skills */}
      {extra.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <Plus className="h-3.5 w-3.5 text-blue-600" />
            </span>
            <span className="text-sm font-medium text-slate-700">
              Additional Skills ({extra.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pl-8">
            {extra.slice(0, 15).map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
              >
                {skill}
              </span>
            ))}
            {extra.length > 15 && (
              <span className="px-2.5 py-1 text-xs text-slate-400">
                +{extra.length - 15} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
