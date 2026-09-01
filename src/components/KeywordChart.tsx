import type { AnalysisResult } from '@/types';

interface KeywordChartProps {
  matched: string[];
  missing: string[];
  density: AnalysisResult['keywordDensity'];
}

export function KeywordChart({ matched, missing, density }: KeywordChartProps) {
  const maxCount = Math.max(...density.map((d) => Math.max(d.resumeCount, d.jdCount)), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Keyword Analysis</h3>

      {/* Match vs Missing counts */}
      <div className="mb-4 flex gap-3">
        <div className="flex-1 rounded-lg bg-green-50 p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{matched.length}</p>
          <p className="text-xs text-slate-600">Matched</p>
        </div>
        <div className="flex-1 rounded-lg bg-red-50 p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{missing.length}</p>
          <p className="text-xs text-slate-600">Missing</p>
        </div>
      </div>

      {/* Density bars */}
      <div className="space-y-2.5">
        <p className="text-xs font-medium text-slate-500">Keyword Density (Resume vs Job Description)</p>
        {density.slice(0, 10).map((item) => (
          <div key={item.keyword} className="flex items-center gap-2">
            <span className="w-28 shrink-0 truncate text-xs text-slate-600" title={item.keyword}>
              {item.keyword}
            </span>
            <div className="flex flex-1 items-center gap-1">
              <div className="relative h-5 flex-1 rounded bg-slate-100">
                <div
                  className="absolute left-0 top-0 h-5 rounded bg-blue-400"
                  style={{ width: `${(item.resumeCount / maxCount) * 100}%` }}
                />
                <span className="absolute right-1 top-0 flex h-5 items-center text-[10px] text-slate-600">
                  {item.resumeCount}
                </span>
              </div>
              <div className="relative h-5 w-24 rounded bg-slate-100">
                <div
                  className="absolute left-0 top-0 h-5 rounded bg-emerald-400"
                  style={{ width: `${(item.jdCount / maxCount) * 100}%` }}
                />
                <span className="absolute right-1 top-0 flex h-5 items-center text-[10px] text-slate-600">
                  {item.jdCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Missing keywords list */}
      {missing.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-slate-500">Missing Keywords:</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.slice(0, 12).map((kw) => (
              <span
                key={kw}
                className="rounded-md bg-red-50 px-2 py-0.5 text-xs text-red-600"
              >
                {kw}
              </span>
            ))}
            {missing.length > 12 && (
              <span className="text-xs text-slate-400">+{missing.length - 12} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
