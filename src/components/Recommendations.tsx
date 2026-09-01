import { Lightbulb } from 'lucide-react';

interface RecommendationsProps {
  recommendations: string[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        Recommendations
      </h3>
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">
              {i + 1}
            </span>
            <p className="text-sm text-slate-700">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
