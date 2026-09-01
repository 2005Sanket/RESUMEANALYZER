export interface AnalysisResult {
  id: string;
  createdAt: number;
  resumeText: string;
  jobDescription: string;
  fileName: string;
  matchScore: number;
  keywordMatchScore: number;
  skillMatchScore: number;
  experienceScore: number;
  formattingScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordDensity: { keyword: string; resumeCount: number; jdCount: number }[];
  formattingIssues: FormattingIssue[];
  sections: SectionAnalysis[];
  actionVerbs: string[];
  quantifiableResults: number;
  wordCount: number;
  recommendations: string[];
}

export interface FormattingIssue {
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface SectionAnalysis {
  name: string;
  present: boolean;
  quality: 'good' | 'fair' | 'missing';
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type AnalysisStage = 'idle' | 'parsing' | 'done' | 'analyzing' | 'complete' | 'error';
