import { History, Trash2, FileText, ChevronRight } from 'lucide-react';
import type { AnalysisResult } from '@/types';

interface HistorySidebarProps {
  history: AnalysisResult[];
  loading: boolean;
  onSelect: (analysis: AnalysisResult) => void;
  onDelete: (id: string) => void;
  activeId?: string;
}

export function HistorySidebar({ history, loading, onSelect, onDelete, activeId }: HistorySidebarProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <History className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900">Analysis History</h3>
        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {history.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="mb-2 h-8 w-8 text-slate-300" />
            <p className="text-xs text-slate-400">No saved analyses yet</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {history.map((item) => (
              <div
                key={item.id}
                className={`group flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                  activeId === item.id
                    ? 'bg-blue-50 ring-1 ring-blue-200'
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => onSelect(item)}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <FileText className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-700">
                    {item.fileName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        item.matchScore >= 75
                          ? 'text-green-600'
                          : item.matchScore >= 50
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}
                    >
                      {item.matchScore}% match
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="rounded p-1 text-slate-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
