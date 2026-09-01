import type { AnalysisResult } from '@/types';

export function generateChatResponse(
  message: string,
  analysis: AnalysisResult
): string {
  const lower = message.toLowerCase();

  // Interview questions
  if (lower.includes('interview') || lower.includes('mock') || lower.includes('question')) {
    return generateInterviewQuestions(analysis);
  }

  // Resume rewrite suggestions
  if (lower.includes('rewrite') || lower.includes('improve') || lower.includes('bullet') || lower.includes('fix my resume')) {
    return generateRewriteSuggestions(analysis);
  }

  // Salary
  if (lower.includes('salary') || lower.includes('compensation') || lower.includes('pay') || lower.includes('money')) {
    return generateSalaryInsights(analysis);
  }

  // Skill gap
  if (lower.includes('skill') || lower.includes('gap') || lower.includes('missing') || lower.includes('lack')) {
    return generateSkillGapAnalysis(analysis);
  }

  // Match score
  if (lower.includes('match') || lower.includes('score') || lower.includes('how do i') || lower.includes('fit')) {
    return generateMatchSummary(analysis);
  }

  // Keywords
  if (lower.includes('keyword') || lower.includes('ats')) {
    return generateKeywordAdvice(analysis);
  }

  // Career path
  if (lower.includes('career') || lower.includes('path') || lower.includes('growth') || lower.includes('future')) {
    return generateCareerAdvice(analysis);
  }

  // Formatting
  if (lower.includes('format') || lower.includes('template') || lower.includes('layout') || lower.includes('structure')) {
    return generateFormattingAdvice(analysis);
  }

  // Cover letter
  if (lower.includes('cover letter') || lower.includes('cover')) {
    return generateCoverLetterTips(analysis);
  }

  // Default
  return `I can help you with several things based on your resume analysis:

1. **Interview Prep** — Ask me to generate mock interview questions tailored to this role.
2. **Resume Rewriting** — I can suggest STAR-method improvements for your bullet points.
3. **Skill Gap Analysis** — I'll break down what skills you're missing vs. the job description.
4. **Salary Insights** — Get compensation benchmarks for this type of role.
5. **Keyword Strategy** — Learn which keywords to add for better ATS performance.
6. **Career Path Advice** — Get guidance on career growth based on your current skills.

Your current match score is **${analysis.matchScore}%**. Just ask me about any of the topics above!`;
}

function generateInterviewQuestions(analysis: AnalysisResult): string {
  const questions: string[] = [];

  // Technical questions based on matched skills
  const techSkills = analysis.matchedSkills.slice(0, 3);
  if (techSkills.length > 0) {
    questions.push(
      `**Technical Questions:**`,
      ...techSkills.map(
        (skill) => `• Can you describe a challenging project where you used ${skill}? What was the architecture and how did you make key design decisions?`
      ),
      `• Walk me through how you would design a scalable system using ${techSkills[0] || 'your core technology'}. What trade-offs would you consider?`
    );
  }

  // Questions about missing skills
  if (analysis.missingSkills.length > 0) {
    questions.push(
      `\n**Skill Gap Questions (prepare for these!):**`,
      ...analysis.missingSkills.slice(0, 2).map(
        (skill) => `• The job requires ${skill}, which isn't on your resume. How would you approach learning this, and do you have transferable experience?`
      )
    );
  }

  // Behavioral questions
  questions.push(
    `\n**Behavioral Questions:**`,
    `• Tell me about a time you faced a significant technical challenge. What was the situation, what did you do, and what was the outcome? (STAR method)`,
    `• Describe a situation where you had to work with a difficult team member. How did you handle it?`,
    `• Tell me about a time you failed. What did you learn and how did you apply that learning?`
  );

  // Based on experience score
  if (analysis.quantifiableResults > 0) {
    questions.push(
      `\n**Results-Focused Questions:**`,
      `• You mention quantifiable achievements in your resume. Walk me through how you measured that impact and what steps led to those results.`
    );
  }

  return `Here are tailored interview questions based on your resume and the target job:\n\n${questions.join('\n')}\n\n**Tip:** Use the STAR method (Situation, Task, Action, Result) for behavioral questions. Practice your answers out loud and keep them to 90 seconds each.`;
}

function generateRewriteSuggestions(analysis: AnalysisResult): string {
  const suggestions: string[] = [];

  suggestions.push('Here are STAR-method rewrite suggestions for your resume:\n');

  // General suggestions based on missing keywords
  if (analysis.missingKeywords.length > 0) {
    suggestions.push(
      `**Add keywords naturally:**\n`,
      `Instead of generic descriptions, weave in keywords like "${analysis.missingKeywords.slice(0, 3).join('", "')}" into your experience bullets. For example:`,
      `\n  ❌ "Worked on backend systems"`,
      `  ✅ "Architected and deployed scalable backend systems using ${analysis.missingKeywords[0] || 'modern frameworks'}, reducing latency by 40%"\n`
    );
  }

  // Action verb suggestions
  if (analysis.actionVerbs.length < 8) {
    suggestions.push(
      `**Use stronger action verbs:**\n`,
      `Replace weak phrases with impactful verbs:`,
      `  ❌ "Was responsible for managing..." → ✅ "Managed..."`,
      `  ❌ "Helped with..." → ✅ "Spearheaded..."`,
      `  ❌ "Worked on..." → ✅ "Engineered..." or "Developed..."\n`
    );
  }

  // Quantification suggestions
  if (analysis.quantifiableResults < 5) {
    suggestions.push(
      `**Quantify your impact:**\n`,
      `Add numbers to your achievements:`,
      `  ❌ "Improved system performance"`,
      `  ✅ "Improved API response time by 60%, serving 10K+ daily requests"`,
      `  ❌ "Led a team"`,
      `  ✅ "Led a cross-functional team of 6 engineers, delivering 3 major features ahead of schedule"\n`
    );
  }

  // Skill integration
  if (analysis.missingSkills.length > 0) {
    suggestions.push(
      `**Integrate missing skills:**\n`,
      `If you have experience with ${analysis.missingSkills.slice(0, 2).join(' or ')}, create a bullet that explicitly mentions it. Even personal projects count if they demonstrate competency.\n`
    );
  }

  return suggestions.join('\n');
}

function generateSalaryInsights(analysis: AnalysisResult): string {
  const skills = [...analysis.matchedSkills, ...analysis.extraSkills];
  const seniority = analysis.quantifiableResults > 10 && analysis.actionVerbs.length > 10
    ? 'senior'
    : analysis.quantifiableResults > 5
    ? 'mid-level'
    : 'entry to mid-level';

  return `**Salary & Compensation Insights**\n
Based on your skill profile (${skills.slice(0, 5).join(', ')}...) and experience level (${seniority}):\n
• **Entry-level** (0-2 years): $60K - $85K base
• **Mid-level** (3-5 years): $85K - $130K base
• **Senior** (5+ years): $130K - $200K+ base
• **Staff/Principal**: $180K - $300K+ base\n
**Factors that increase your range:**
• Cloud certifications (AWS, Azure, GCP) can add 10-15%
• Leadership/management experience adds 15-20%
• Specialized skills (ML, distributed systems) add 10-25%
• Location: Major tech hubs (SF, NYC, Seattle) pay 20-40% more\n
**Negotiation tips:**
• Research the company's compensation bands on Glassdoor/Levels.fyi
• Highlight your quantifiable achievements (${analysis.quantifiableResults} found in your resume)
• Don't disclose your current salary — anchor on market data instead
• Total compensation includes base + equity + bonus + benefits\n
*Note: These are general benchmarks. Actual ranges vary by location, company size, and industry.*`;
}

function generateSkillGapAnalysis(analysis: AnalysisResult): string {
  const lines: string[] = [];

  lines.push(`**Skill Gap Analysis**\n`);
  lines.push(`Your resume matches **${analysis.matchedSkills.length}** of the **${analysis.matchedSkills.length + analysis.missingSkills.length}** skills found in the job description.\n`);

  if (analysis.missingSkills.length > 0) {
    lines.push(`**Missing Skills (priority order):**\n`);
    analysis.missingSkills.forEach((skill, i) => {
      lines.push(`${i + 1}. **${skill}** — This appears in the job description but not your resume. ${getSkillAdvice(skill)}`);
    });
  }

  if (analysis.matchedSkills.length > 0) {
    lines.push(`\n**Your Strong Matches:**\n`);
    lines.push(analysis.matchedSkills.map((s) => `✓ ${s}`).join('\n'));
  }

  if (analysis.extraSkills.length > 0) {
    lines.push(`\n**Additional Skills You Have (not required but valuable):**\n`);
    lines.push(analysis.extraSkills.slice(0, 8).join(', '));
  }

  return lines.join('\n');
}

function getSkillAdvice(skill: string): string {
  const adviceMap: Record<string, string> = {
    aws: 'Consider getting an AWS certification (Solutions Architect or Developer) to demonstrate competency.',
    azure: 'Microsoft Azure certifications are highly valued. Start with AZ-900 fundamentals.',
    docker: 'Practice containerizing applications. Docker is foundational for modern DevOps.',
    kubernetes: 'Set up a local cluster with minikube and deploy a sample application.',
    react: 'Build a portfolio project showcasing component architecture and state management.',
    python: 'Contribute to open-source Python projects or build a data analysis portfolio.',
    tensorflow: 'Complete a TensorFlow certification or build an ML model end-to-end.',
  };
  const key = skill.toLowerCase();
  return adviceMap[key] || 'Consider taking an online course, building a side project, or highlighting transferable experience.';
}

function generateMatchSummary(analysis: AnalysisResult): string {
  return `**Your Match Analysis**\n
Overall match score: **${analysis.matchScore}%**\n
Here's the breakdown:
• **Skill Match**: ${analysis.skillMatchScore}% — ${analysis.matchedSkills.length} of ${analysis.matchedSkills.length + analysis.missingSkills.length} required skills found
• **Keyword Match**: ${analysis.keywordMatchScore}% — ${analysis.matchedKeywords.length} of ${analysis.matchedKeywords.length + analysis.missingKeywords.length} keywords found
• **Experience Quality**: ${analysis.experienceScore}% — Based on action verbs (${analysis.actionVerbs.length} found) and quantifiable results (${analysis.quantifiableResults} found)
• **Formatting**: ${analysis.formattingScore}% — ${analysis.formattingIssues.length} formatting issues detected\n
${analysis.matchScore >= 75
  ? 'You\'re a strong match! Focus on tailoring your bullet points and preparing for the interview.'
  : analysis.matchScore >= 50
  ? 'You\'re a moderate match. Address the missing skills and keywords to improve your chances.'
  : 'There\'s a significant gap. Consider adding missing keywords, improving your formatting, and highlighting transferable skills.'}`;
}

function generateKeywordAdvice(analysis: AnalysisResult): string {
  const lines: string[] = [];
  lines.push(`**ATS Keyword Strategy**\n`);
  lines.push(`ATS systems scan for exact keyword matches from the job description. Here's your status:\n`);

  if (analysis.missingKeywords.length > 0) {
    lines.push(`**Keywords you're missing:**\n`);
    lines.push(analysis.missingKeywords.map((k) => `• ${k}`).join('\n'));
    lines.push('\n');
  }

  if (analysis.matchedKeywords.length > 0) {
    lines.push(`**Keywords you already have:**\n`);
    lines.push(analysis.matchedKeywords.map((k) => `✓ ${k}`).join(', '));
    lines.push('\n');
  }

  lines.push(`\n**How to add missing keywords naturally:**`);
  lines.push(`• Use them in your summary/profile section`);
  lines.push(`• Integrate them into experience bullet points`);
  lines.push(`• Add them to a "Technical Skills" section`);
  lines.push(`• Mention them in project descriptions`);
  lines.push(`\n**Warning:** Don't keyword-stuff. Use keywords in context — ATS systems and recruiters both check for meaningful usage.`);

  return lines.join('\n');
}

function generateCareerAdvice(analysis: AnalysisResult): string {
  const skills = [...analysis.matchedSkills, ...analysis.extraSkills];
  const lines: string[] = [];

  lines.push(`**Career Path Guidance**\n`);
  lines.push(`Based on your current skill set (${skills.slice(0, 5).join(', ')}...), here are growth paths:\n`);

  lines.push(`**Short-term (3-6 months):**`);
  if (analysis.missingSkills.length > 0) {
    lines.push(`• Learn ${analysis.missingSkills[0]} — it's required for this role and will open more opportunities`);
  }
  lines.push(`• Strengthen your existing skills with portfolio projects`);
  lines.push(`• Contribute to open-source projects for visibility\n`);

  lines.push(`**Medium-term (6-12 months):**`);
  lines.push(`• Get a relevant certification to validate your skills`);
  lines.push(`• Take on leadership responsibilities at work`);
  lines.push(`• Build a public portfolio (GitHub, personal site)\n`);

  lines.push(`**Long-term (1-3 years):**`);
  lines.push(`• Specialize in a high-demand area (cloud architecture, ML, security)`);
  lines.push(`• Develop soft skills: communication, mentoring, project management`);
  lines.push(`• Network at conferences and meetups`);
  lines.push(`• Consider mentoring juniors to build leadership credibility\n`);

  lines.push(`**Your transferable strengths:**`);
  lines.push(`• ${analysis.actionVerbs.length} strong action verbs in your resume show initiative`);
  lines.push(`• ${analysis.quantifiableResults} quantifiable achievements show results-oriented thinking`);

  return lines.join('\n');
}

function generateFormattingAdvice(analysis: AnalysisResult): string {
  const lines: string[] = [];
  lines.push(`**Formatting Recommendations**\n`);

  if (analysis.formattingIssues.length === 0) {
    lines.push('Your resume formatting looks ATS-friendly. No major issues detected.');
    return lines.join('\n');
  }

  lines.push(`I found ${analysis.formattingIssues.length} formatting ${analysis.formattingIssues.length === 1 ? 'issue' : 'issues'}:\n`);

  analysis.formattingIssues.forEach((issue) => {
    const icon = issue.type === 'error' ? '🔴' : issue.type === 'warning' ? '🟡' : '🔵';
    lines.push(`${icon} **${issue.title}**`);
    lines.push(`   ${issue.description}\n`);
  });

  lines.push(`**Best practices for ATS-friendly resumes:**`);
  lines.push(`• Use standard fonts (Arial, Calibri, Times New Roman)`);
  lines.push(`• Avoid columns, text boxes, and graphics`);
  lines.push(`• Use standard section headers (Experience, Education, Skills)`);
  lines.push(`• Save as PDF or DOCX (PDF preserves formatting best)`);
  lines.push(`• Keep to 1-2 pages maximum`);
  lines.push(`• Use standard bullet points (• or -)`);

  return lines.join('\n');
}

function generateCoverLetterTips(analysis: AnalysisResult): string {
  const lines: string[] = [];
  lines.push(`**Cover Letter Tips**\n`);
  lines.push(`Use your match analysis to craft a targeted cover letter:\n`);

  lines.push(`**Opening:** Reference the specific role and company. Mention 1-2 of your strongest matched skills: ${analysis.matchedSkills.slice(0, 2).join(' and ') || 'your core competencies'}.\n`);

  lines.push(`**Body:**`);
  lines.push(`• Pick 2-3 achievements from your resume that align with the job requirements`);
  lines.push(`• Address any skill gaps honestly — show enthusiasm for learning ${analysis.missingSkills[0] || 'new technologies'}`);
  lines.push(`• Reference specific keywords from the job description`);
  lines.push(`• Quantify your impact (you have ${analysis.quantifiableResults} quantifiable achievements to draw from)\n`);

  lines.push(`**Closing:** Reiterate your enthusiasm, mention your match strengths, and include a call to action for an interview.\n`);

  lines.push(`**Keep it to:** 250-400 words, 3-4 paragraphs, single page.`);

  return lines.join('\n');
}
