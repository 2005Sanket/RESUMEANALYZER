import type { AnalysisResult } from '@/types';
import { ScoreGauge } from './ScoreGauge';
import { SkillBreakdown } from './SkillBreakdown';
import { KeywordChart } from './KeywordChart';
import { FormattingCheck } from './FormattingCheck';
import { SectionCheck } from './SectionCheck';
import { Recommendations } from './Recommendations';
import { TrendingUp, FileText, Zap, CheckSquare } from 'lucide-react';

interface DashboardProps {
  analysis: AnalysisResult;
}

export function Dashboard({ analysis }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Overall Score Hero */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
          <ScoreGauge score={analysis.matchScore} label="Overall Match" size={140} />
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <MiniScore
              icon={<TrendingUp className="h-4 w-4" />}
              label="Skill Match"
              score={analysis.skillMatchScore}
            />
            <MiniScore
              icon={<FileText className="h-4 w-4" />}
              label="Keyword Match"
              score={analysis.keywordMatchScore}
            />
            <MiniScore
              icon={<Zap className="h-4 w-4" />}
              label="Experience"
              score={analysis.experienceScore}
            />
            <MiniScore
              icon={<CheckSquare className="h-4 w-4" />}
              label="Formatting"
              score={analysis.formattingScore}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
          <span>{analysis.wordCount} words</span>
          <span className="text-slate-300">|</span>
          <span>{analysis.actionVerbs.length} action verbs</span>
          <span className="text-slate-300">|</span>
          <span>{analysis.quantifiableResults} quantified achievements</span>
        </div>
      </div>

      {/* Skills & Keywords */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SkillBreakdown
          matched={analysis.matchedSkills}
          missing={analysis.missingSkills}
          extra={analysis.extraSkills}
        />
        <KeywordChart
          matched={analysis.matchedKeywords}
          missing={analysis.missingKeywords}
          density={analysis.keywordDensity}
        />
      </div>

      {/* Formatting & Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FormattingCheck issues={analysis.formattingIssues} />
        <SectionCheck sections={analysis.sections} />
      </div>

      {/* Recommendations */}
      <Recommendations recommendations={analysis.recommendations} />
    </div>
  );
}

function MiniScore({
  icon,
  label,
  score,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
}) {
  const color =
    score >= 75 ? 'text-green-600 bg-green-50' : score >= 50 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';

  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{score}%</p>
      </div>
    </div>
  );
}
