import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AnalysisResult } from '@/types';
import type { Database } from '@/types/database';

type AnalysisRow = Database['public']['Tables']['resume_analyses']['Row'];

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    const { data, error } = await supabase
      .from('resume_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Failed to load history:', error);
      setLoading(false);
      return;
    }

    if (data) {
      setHistory(data.map(rowToAnalysis));
    }
    setLoading(false);
  }

  async function saveAnalysis(analysis: AnalysisResult): Promise<void> {
    const { error } = await supabase.from('resume_analyses').insert({
      id: analysis.id,
      file_name: analysis.fileName,
      resume_text: analysis.resumeText,
      job_description: analysis.jobDescription,
      match_score: analysis.matchScore,
      skill_match_score: analysis.skillMatchScore,
      keyword_match_score: analysis.keywordMatchScore,
      experience_score: analysis.experienceScore,
      formatting_score: analysis.formattingScore,
      matched_skills: analysis.matchedSkills,
      missing_skills: analysis.missingSkills,
      extra_skills: analysis.extraSkills,
      matched_keywords: analysis.matchedKeywords,
      missing_keywords: analysis.missingKeywords,
      keyword_density: analysis.keywordDensity,
      formatting_issues: analysis.formattingIssues,
      sections: analysis.sections,
      action_verbs: analysis.actionVerbs,
      quantifiable_results: analysis.quantifiableResults,
      word_count: analysis.wordCount,
      recommendations: analysis.recommendations,
    });

    if (error) {
      console.error('Failed to save analysis:', error);
    } else {
      await loadHistory();
    }
  }

  async function deleteAnalysis(id: string): Promise<void> {
    const { error } = await supabase.from('resume_analyses').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete analysis:', error);
    } else {
      setHistory((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return { history, loading, saveAnalysis, deleteAnalysis, refresh: loadHistory };
}

function rowToAnalysis(row: AnalysisRow): AnalysisResult {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).getTime(),
    resumeText: row.resume_text,
    jobDescription: row.job_description,
    fileName: row.file_name,
    matchScore: row.match_score,
    keywordMatchScore: row.keyword_match_score,
    skillMatchScore: row.skill_match_score,
    experienceScore: row.experience_score,
    formattingScore: row.formatting_score,
    matchedSkills: row.matched_skills ?? [],
    missingSkills: row.missing_skills ?? [],
    extraSkills: row.extra_skills ?? [],
    matchedKeywords: row.matched_keywords ?? [],
    missingKeywords: row.missing_keywords ?? [],
    keywordDensity: (row.keyword_density as AnalysisResult['keywordDensity']) ?? [],
    formattingIssues: (row.formatting_issues as AnalysisResult['formattingIssues']) ?? [],
    sections: (row.sections as AnalysisResult['sections']) ?? [],
    actionVerbs: row.action_verbs ?? [],
    quantifiableResults: row.quantifiable_results,
    wordCount: row.word_count,
    recommendations: row.recommendations ?? [],
  };
}
