export interface Database {
  public: {
    Tables: {
      resume_analyses: {
        Row: {
          id: string;
          file_name: string;
          resume_text: string;
          job_description: string;
          match_score: number;
          skill_match_score: number;
          keyword_match_score: number;
          experience_score: number;
          formatting_score: number;
          matched_skills: string[] | null;
          missing_skills: string[] | null;
          extra_skills: string[] | null;
          matched_keywords: string[] | null;
          missing_keywords: string[] | null;
          keyword_density: unknown | null;
          formatting_issues: unknown | null;
          sections: unknown | null;
          action_verbs: string[] | null;
          quantifiable_results: number;
          word_count: number;
          recommendations: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          resume_text: string;
          job_description: string;
          match_score?: number;
          skill_match_score?: number;
          keyword_match_score?: number;
          experience_score?: number;
          formatting_score?: number;
          matched_skills?: string[];
          missing_skills?: string[];
          extra_skills?: string[];
          matched_keywords?: string[];
          missing_keywords?: string[];
          keyword_density?: unknown;
          formatting_issues?: unknown;
          sections?: unknown;
          action_verbs?: string[];
          quantifiable_results?: number;
          word_count?: number;
          recommendations?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          file_name?: string;
          resume_text?: string;
          job_description?: string;
          match_score?: number;
          skill_match_score?: number;
          keyword_match_score?: number;
          experience_score?: number;
          formatting_score?: number;
          matched_skills?: string[];
          missing_skills?: string[];
          extra_skills?: string[];
          matched_keywords?: string[];
          missing_keywords?: string[];
          keyword_density?: unknown;
          formatting_issues?: unknown;
          sections?: unknown;
          action_verbs?: string[];
          quantifiable_results?: number;
          word_count?: number;
          recommendations?: string[];
          created_at?: string;
        };
      };
    };
  };
}
