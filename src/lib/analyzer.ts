import type {
  AnalysisResult,
  FormattingIssue,
  SectionAnalysis,
} from '@/types';

// Common technical skills database
const SKILLS_DB = [
  // Programming languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Dart', 'Lua', 'Objective-C', 'Elixir', 'Clojure', 'Haskell',
  // Frontend
  'React', 'Angular', 'Vue', 'Svelte', 'Next.js', 'Nuxt', 'Redux', 'MobX', 'GraphQL', 'Apollo', 'HTML', 'CSS', 'SASS', 'SCSS', 'Tailwind', 'Bootstrap', 'Material UI', 'Styled Components', 'Webpack', 'Vite', 'Babel', 'jQuery', 'Ember', 'Backbone',
  // Backend
  'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring', 'Spring Boot', 'Rails', 'Laravel', 'ASP.NET', '.NET', 'Gin', 'Fiber', 'Actix', 'Symfony', 'Zend',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Cassandra', 'DynamoDB', 'Elasticsearch', 'Firebase', 'Supabase', 'Oracle', 'SQL Server', 'MariaDB', 'CouchDB', 'Neo4j', 'InfluxDB', 'Dgraph',
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'CI/CD', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Helm', 'Istio', 'Serverless', 'Lambda', 'EC2', 'S3', 'RDS', 'CloudFormation', 'Pulumi', 'Vagrant',
  // Data & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn', 'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'Plotly', 'Tableau', 'Power BI', 'Spark', 'Hadoop', 'Kafka', 'Airflow', 'dbt', 'Snowflake', 'Databricks', 'NLP', 'Computer Vision', 'OpenCV', 'Hugging Face', 'LangChain', 'OpenAI',
  // Mobile
  'React Native', 'Flutter', 'iOS', 'Android', 'Xcode', 'Android Studio',
  // Tools
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Slack', 'Figma', 'Sketch', 'Adobe XD', 'Postman', 'Swagger', 'JMeter', 'Selenium', 'Cypress', 'Playwright', 'Puppeteer', 'Jest', 'Vitest', 'Mocha', 'Chai', 'Testing Library', 'JUnit', 'pytest',
  // Methodologies
  'Agile', 'Scrum', 'Kanban', 'TDD', 'BDD', 'Microservices', 'REST', 'SOAP', 'gRPC', 'WebSockets', 'OAuth', 'JWT', 'SAML', 'SSO', 'MFA',
  // Other
  'Linux', 'Unix', 'Bash', 'PowerShell', 'Nginx', 'Apache', 'CDN', 'DNS', 'TCP/IP', 'HTTP', 'HTTPS', 'SSL', 'TLS', 'SEO', 'ORM', 'MVC', 'MVVM',
];

const ACTION_VERBS = [
  'achieved', 'built', 'created', 'designed', 'developed', 'implemented', 'launched', 'led', 'managed', 'optimized', 'improved', 'increased', 'reduced', 'delivered', 'architected', 'automated', 'streamlined', 'spearheaded', 'orchestrated', 'pioneered', 'transformed', 'accelerated', 'negotiated', 'analyzed', 'collaborated', 'coordinated', 'established', 'executed', 'facilitated', 'generated', 'initiated', 'introduced', 'maintained', 'operated', 'performed', 'planned', 'produced', 'provided', 'resolved', 'supervised', 'trained', 'upgraded', 'utilized', 'championed', 'consolidated', 'devised', 'engineered', 'formulated', 'maximized', 'minimized', 'overhauled', 'restructured', 'revamped', 'scaled', 'solved', 'standardized', 'synchronized', 'unified',
];

const COMMON_SECTIONS = [
  { name: 'Contact', patterns: [/email|@|phone|tel|linkedin|github/i, /address|city|state/i] },
  { name: 'Summary', patterns: [/summary|objective|profile|about\s+me/i] },
  { name: 'Experience', patterns: [/experience|employment|work\s+history|professional\s+experience/i] },
  { name: 'Education', patterns: [/education|degree|university|college|bachelor|master|ph\.?d/i] },
  { name: 'Skills', patterns: [/skills|technical\s+skills|core\s+competenc/i] },
  { name: 'Projects', patterns: [/projects|portfolio/i] },
  { name: 'Certifications', patterns: [/certification|certificate|licensed/i] },
];

export function analyzeResume(
  resumeText: string,
  jobDescription: string,
  fileName: string
): AnalysisResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // Extract skills
  const resumeSkills = extractSkills(resumeLower);
  const jdSkills = extractSkills(jdLower);
  const matchedSkills = resumeSkills.filter((s) => jdSkills.includes(s));
  const missingSkills = jdSkills.filter((s) => !resumeSkills.includes(s));
  const extraSkills = resumeSkills.filter((s) => !jdSkills.includes(s));

  // Extract keywords (important terms from JD)
  const jdKeywords = extractKeywords(jdLower);
  const resumeKeywords = extractKeywords(resumeLower);
  const matchedKeywords = jdKeywords.filter((k) => resumeLower.includes(k));
  const missingKeywords = jdKeywords.filter((k) => !resumeLower.includes(k));

  // Keyword density
  const keywordDensity = jdKeywords.slice(0, 15).map((kw) => {
    const resumeCount = countOccurrences(resumeLower, kw);
    const jdCount = countOccurrences(jdLower, kw);
    return { keyword: kw, resumeCount, jdCount };
  });

  // Scoring
  const skillMatchScore = jdSkills.length > 0
    ? Math.round((matchedSkills.length / jdSkills.length) * 100)
    : 50;

  const keywordMatchScore = jdKeywords.length > 0
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : 50;

  // Experience score based on action verbs and quantifiable results
  const foundActionVerbs = ACTION_VERBS.filter((v) => resumeLower.includes(v));
  const quantifiableResults = (resumeText.match(/\d+%|\$[\d,]+|\d{2,}\+?/g) || []).length;
  const experienceScore = Math.min(
    100,
    Math.round(
      (foundActionVerbs.length / 10) * 40 +
      (quantifiableResults / 5) * 40 +
      20
    )
  );

  // Formatting checks
  const formattingIssues = checkFormatting(resumeText, resumeLower);
  const formattingScore = Math.max(
    0,
    100 - formattingIssues.length * 15 -
    (formattingIssues.filter((i) => i.type === 'error').length) * 10
  );

  // Section analysis
  const sections = analyzeSections(resumeLower);

  // Overall match score (weighted)
  const matchScore = Math.round(
    skillMatchScore * 0.35 +
    keywordMatchScore * 0.25 +
    experienceScore * 0.25 +
    formattingScore * 0.15
  );

  // Recommendations
  const recommendations = generateRecommendations(
    missingSkills,
    missingKeywords,
    formattingIssues,
    sections,
    foundActionVerbs,
    quantifiableResults
  );

  return {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    resumeText,
    jobDescription,
    fileName,
    matchScore,
    keywordMatchScore,
    skillMatchScore,
    experienceScore,
    formattingScore,
    matchedSkills,
    missingSkills,
    extraSkills,
    matchedKeywords,
    missingKeywords,
    keywordDensity,
    formattingIssues,
    sections,
    actionVerbs: foundActionVerbs,
    quantifiableResults,
    wordCount: resumeText.split(/\s+/).filter(Boolean).length,
    recommendations,
  };
}

function extractSkills(text: string): string[] {
  const found: string[] = [];
  for (const skill of SKILLS_DB) {
    const skillLower = skill.toLowerCase();
    // Use word boundary for short skills, includes for longer ones
    if (skill.length <= 4) {
      const regex = new RegExp(`\\b${escapeRegex(skillLower)}\\b`, 'i');
      if (regex.test(text)) found.push(skill);
    } else {
      if (text.includes(skillLower)) found.push(skill);
    }
  }
  return [...new Set(found)];
}

function extractKeywords(text: string): string[] {
  // Remove common stop words and extract meaningful terms
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
    'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you',
    'your', 'it', 'its', 'they', 'them', 'their', 'he', 'she', 'his', 'her',
    'as', 'if', 'then', 'than', 'so', 'not', 'no', 'yes', 'all', 'any',
    'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
    'only', 'own', 'same', 'too', 'very', 'just', 'now', 'also', 'about',
    'into', 'over', 'under', 'again', 'further', 'once', 'here', 'there',
    'when', 'where', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose',
    'will', 'job', 'role', 'position', 'candidate', 'team', 'work', 'ability',
    'experience', 'year', 'years', 'must', 'plus', 'etc', 'e.g', 'i.e',
    'strong', 'excellent', 'good', 'great', 'looking', 'seeking', 'join',
    'company', 'us', 'we', 'our', 'you', 'your', 'preferred', 'required',
    'responsibilities', 'requirements', 'qualifications', 'what', 'will',
  ]);

  // Extract multi-word phrases (2-3 words) and single words
  const words = text.split(/[^a-zA-Z+#.\s-]+/).join(' ').split(/\s+/);
  const wordFreq = new Map<string, number>();

  // Single words
  for (const word of words) {
    const clean = word.toLowerCase().replace(/[^a-z+#.]/g, '');
    if (clean.length >= 3 && !stopWords.has(clean) && !/^\d+$/.test(clean)) {
      wordFreq.set(clean, (wordFreq.get(clean) || 0) + 1);
    }
  }

  // Bigrams
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i].toLowerCase().replace(/[^a-z+#.]/g, '');
    const w2 = words[i + 1].toLowerCase().replace(/[^a-z+#.]/g, '');
    if (w1.length >= 3 && w2.length >= 3 && !stopWords.has(w1) && !stopWords.has(w2)) {
      const bigram = `${w1} ${w2}`;
      wordFreq.set(bigram, (wordFreq.get(bigram) || 0) + 1);
    }
  }

  // Sort by frequency and return top keywords
  const sorted = [...wordFreq.entries()]
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([word]) => word);

  return sorted;
}

function countOccurrences(text: string, term: string): number {
  if (term.includes(' ')) {
    return text.split(term).length - 1;
  }
  const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi');
  return (text.match(regex) || []).length;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function checkFormatting(resumeText: string, resumeLower: string): FormattingIssue[] {
  const issues: FormattingIssue[] = [];

  // Check for tables (pipe-separated or tab-separated)
  if (/\|.*\|.*\n/.test(resumeText) || /\t.*\t.*\n/.test(resumeText)) {
    issues.push({
      type: 'error',
      title: 'Tables Detected',
      description: 'Tables can confuse ATS systems. Use simple text formatting instead.',
    });
  }

  // Check word count
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 200) {
    issues.push({
      type: 'warning',
      title: 'Resume Too Short',
      description: `Only ${wordCount} words detected. Aim for 300-800 words for a standard resume.`,
    });
  }
  if (wordCount > 1200) {
    issues.push({
      type: 'warning',
      title: 'Resume Too Long',
      description: `${wordCount} words detected. Consider condensing to 1-2 pages.`,
    });
  }

  // Check for contact info
  if (!/[\w.-]+@[\w.-]+\.\w+/.test(resumeText)) {
    issues.push({
      type: 'error',
      title: 'Missing Email Address',
      description: 'No email address detected. ATS systems use this to identify candidates.',
    });
  }
  if (!/(\+?\d[\d\s()-]{8,}\d)/.test(resumeText)) {
    issues.push({
      type: 'warning',
      title: 'Missing Phone Number',
      description: 'No phone number detected. Include a professional contact number.',
    });
  }

  // Check for LinkedIn
  if (!/linkedin/i.test(resumeLower)) {
    issues.push({
      type: 'info',
      title: 'No LinkedIn Profile',
      description: 'Adding your LinkedIn profile URL can improve visibility.',
    });
  }

  // Check for special characters that might confuse ATS
  if (/[★●◆▪►▶]/.test(resumeText)) {
    issues.push({
      type: 'warning',
      title: 'Special Characters Detected',
      description: 'Bullet point characters may not parse correctly. Use standard dashes or dots.',
    });
  }

  // Check for quantifiable results
  if ((resumeText.match(/\d+%|\$[\d,]+|\d{2,}\+?/g) || []).length < 3) {
    issues.push({
      type: 'info',
      title: 'Few Quantifiable Metrics',
      description: 'Add more numbers, percentages, and metrics to quantify your impact.',
    });
  }

  return issues;
}

function analyzeSections(resumeLower: string): SectionAnalysis[] {
  return COMMON_SECTIONS.map(({ name, patterns }) => {
    const present = patterns.some((p) => p.test(resumeLower));
    let quality: 'good' | 'fair' | 'missing' = 'missing';
    let description = 'Section not detected in your resume.';

    if (present) {
      quality = 'good';
      description = 'Section detected and appears well-structured.';
    }

    return { name, present, quality, description };
  });
}

function generateRecommendations(
  missingSkills: string[],
  missingKeywords: string[],
  formattingIssues: FormattingIssue[],
  sections: SectionAnalysis[],
  actionVerbs: string[],
  quantifiableResults: number
): string[] {
  const recs: string[] = [];

  if (missingSkills.length > 0) {
    recs.push(
      `Add these missing skills to your resume if you have them: ${missingSkills.slice(0, 5).join(', ')}${missingSkills.length > 5 ? '...' : ''}. Even mentioning them in context of related work can help.`
    );
  }

  if (missingKeywords.length > 0) {
    recs.push(
      `Incorporate these job-description keywords naturally: ${missingKeywords.slice(0, 5).join(', ')}${missingKeywords.length > 5 ? '...' : ''}. ATS systems scan for exact keyword matches.`
    );
  }

  const missingSections = sections.filter((s) => !s.present);
  if (missingSections.length > 0) {
    recs.push(
      `Add missing resume sections: ${missingSections.map((s) => s.name).join(', ')}. A complete resume structure improves ATS parsing.`
    );
  }

  if (actionVerbs.length < 5) {
    recs.push(
      'Use more strong action verbs (e.g., "achieved", "developed", "led") to start your bullet points.'
    );
  }

  if (quantifiableResults < 3) {
    recs.push(
      'Quantify your achievements with metrics — percentages, dollar amounts, team sizes, or time saved.'
    );
  }

  const errors = formattingIssues.filter((i) => i.type === 'error');
  if (errors.length > 0) {
    recs.push(
      `Fix formatting issues: ${errors.map((e) => e.title).join(', ')}. These can prevent ATS systems from parsing your resume correctly.`
    );
  }

  if (recs.length === 0) {
    recs.push('Your resume looks well-optimized for this job description. Focus on tailoring your experience bullet points to the specific role.');
  }

  return recs;
}
