/*
# Create resume_analyses table (single-tenant, no auth)

1. Purpose
   Stores resume analysis results so users can revisit past analyses without re-uploading.

2. New Tables
   - `resume_analyses`
     - `id` (uuid, primary key)
     - `file_name` (text, name of the uploaded resume file)
     - `resume_text` (text, extracted resume content)
     - `job_description` (text, the target job description text)
     - `match_score` (integer, overall ATS match percentage 0-100)
     - `skill_match_score` (integer)
     - `keyword_match_score` (integer)
     - `experience_score` (integer)
     - `formatting_score` (integer)
     - `matched_skills` (text[], skills found in both resume and JD)
     - `missing_skills` (text[], skills in JD but not resume)
     - `extra_skills` (text[], skills in resume but not JD)
     - `matched_keywords` (text[])
     - `missing_keywords` (text[])
     - `keyword_density` (jsonb, keyword frequency data)
     - `formatting_issues` (jsonb, array of formatting issue objects)
     - `sections` (jsonb, section analysis data)
     - `action_verbs` (text[], action verbs found in resume)
     - `quantifiable_results` (integer, count of quantified achievements)
     - `word_count` (integer)
     - `recommendations` (text[], list of improvement suggestions)
     - `created_at` (timestamptz, default now)

3. Security
   - Enable RLS on `resume_analyses`.
   - Allow anon + authenticated full CRUD because this is a single-tenant app with no sign-in.
   - USING (true) is acceptable here because the data is intentionally public/shared.
*/

CREATE TABLE IF NOT EXISTS resume_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  resume_text text NOT NULL,
  job_description text NOT NULL,
  match_score integer NOT NULL DEFAULT 0,
  skill_match_score integer NOT NULL DEFAULT 0,
  keyword_match_score integer NOT NULL DEFAULT 0,
  experience_score integer NOT NULL DEFAULT 0,
  formatting_score integer NOT NULL DEFAULT 0,
  matched_skills text[] NOT NULL DEFAULT '{}',
  missing_skills text[] NOT NULL DEFAULT '{}',
  extra_skills text[] NOT NULL DEFAULT '{}',
  matched_keywords text[] NOT NULL DEFAULT '{}',
  missing_keywords text[] NOT NULL DEFAULT '{}',
  keyword_density jsonb NOT NULL DEFAULT '[]',
  formatting_issues jsonb NOT NULL DEFAULT '[]',
  sections jsonb NOT NULL DEFAULT '[]',
  action_verbs text[] NOT NULL DEFAULT '{}',
  quantifiable_results integer NOT NULL DEFAULT 0,
  word_count integer NOT NULL DEFAULT 0,
  recommendations text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_analyses" ON resume_analyses;
CREATE POLICY "anon_select_analyses" ON resume_analyses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_analyses" ON resume_analyses;
CREATE POLICY "anon_insert_analyses" ON resume_analyses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_analyses" ON resume_analyses;
CREATE POLICY "anon_update_analyses" ON resume_analyses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_analyses" ON resume_analyses;
CREATE POLICY "anon_delete_analyses" ON resume_analyses FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_resume_analyses_created_at ON resume_analyses(created_at DESC);
