import type { FormattingIssue } from '@/types';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface FormattingCheckProps {
  issues: FormattingIssue[];
}

export function FormattingCheck({ issues }: FormattingCheckProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">ATS Formatting Check</h3>

      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="mb-2 h-12 w-12 text-green-500" />
          <p className="text-sm font-medium text-slate-700">No formatting issues detected!</p>
          <p className="text-xs text-slate-400">Your resume is ATS-friendly.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue, i) => (
            <div
              key={i}
              className={`flex gap-3 rounded-lg border p-3 ${
                issue.type === 'error'
                  ? 'border-red-200 bg-red-50'
                  : issue.type === 'warning'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="shrink-0">
                {issue.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                {issue.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                {issue.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{issue.title}</p>
                <p className="text-xs text-slate-500">{issue.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
