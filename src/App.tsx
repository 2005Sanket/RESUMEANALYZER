import { useState } from 'react';
import {
  FileSearch,
  Briefcase,
  Loader2,
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  Menu,
  X,
  RotateCcw,
} from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { Dashboard } from '@/components/Dashboard';
import { Chatbot } from '@/components/Chatbot';
import { HistorySidebar } from '@/components/HistorySidebar';
import { parseFile } from '@/lib/parser';
import { analyzeResume } from '@/lib/analyzer';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import type { AnalysisResult, AnalysisStage } from '@/types';

type View = 'upload' | 'results';
type Tab = 'dashboard' | 'chatbot';

export function App() {
  const [view, setView] = useState<View>('upload');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stage, setStage] = useState<AnalysisStage>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [parseError, setParseError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>();

  const { history, loading: historyLoading, saveAnalysis, deleteAnalysis } = useAnalysisHistory();

  async function handleFileSelected(file: File) {
    setSelectedFile(file);
    setParseError('');
    setStage('parsing');
    try {
      const text = await parseFile(file);
      if (!text || text.trim().length < 10) {
        setParseError('Could not extract enough text from this file. Try a different file.');
        setStage('error');
        return;
      }
      setResumeText(text);
      setStage('done');
    } catch (err) {
      setParseError(
        err instanceof Error
          ? `Failed to parse file: ${err.message}`
          : 'Failed to parse file. Please try a different format.'
      );
      setStage('error');
    }
  }

  function handleClearFile() {
    setSelectedFile(null);
    setResumeText('');
    setStage('idle');
    setParseError('');
  }

  async function handleAnalyze() {
    if (!resumeText || !jobDescription.trim()) return;
    setStage('analyzing');

    // Simulate analysis processing time for UX
    await new Promise((r) => setTimeout(r, 1200));

    const result = analyzeResume(resumeText, jobDescription, selectedFile?.name || 'resume.txt');
    setAnalysis(result);
    setActiveHistoryId(result.id);
    setStage('complete');
    setView('results');
    setTab('dashboard');

    await saveAnalysis(result);
  }

  function handleSelectHistory(item: AnalysisResult) {
    setAnalysis(item);
    setActiveHistoryId(item.id);
    setResumeText(item.resumeText);
    setJobDescription(item.jobDescription);
    setSelectedFile({ name: item.fileName } as File);
    setStage('complete');
    setView('results');
    setSidebarOpen(false);
  }

  function handleReset() {
    setView('upload');
    setStage('idle');
    setSelectedFile(null);
    setResumeText('');
    setJobDescription('');
    setAnalysis(null);
    setActiveHistoryId(undefined);
    setParseError('');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
              <FileSearch className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">Resume Analyzer</h1>
              <p className="hidden text-xs text-slate-500 sm:block">AI-powered ATS optimization & job matching</p>
            </div>
          </div>

          {view === 'results' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">New Analysis</span>
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* Sidebar - History */}
        {view === 'results' && (
          <>
            {/* Desktop sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <HistorySidebar
                history={history}
                loading={historyLoading}
                onSelect={handleSelectHistory}
                onDelete={deleteAnalysis}
                activeId={activeHistoryId}
              />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/30"
                  onClick={() => setSidebarOpen(false)}
                />
                <div className="absolute left-0 top-0 h-full w-72 bg-slate-50 p-4 shadow-xl">
                  <HistorySidebar
                    history={history}
                    loading={historyLoading}
                    onSelect={handleSelectHistory}
                    onDelete={deleteAnalysis}
                    activeId={activeHistoryId}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {view === 'upload' && (
            <UploadView
              selectedFile={selectedFile}
              stage={stage}
              parseError={parseError}
              jobDescription={jobDescription}
              onFileSelected={handleFileSelected}
              onClearFile={handleClearFile}
              onJobDescriptionChange={setJobDescription}
              onAnalyze={handleAnalyze}
            />
          )}

          {view === 'results' && analysis && (
            <ResultsView
              analysis={analysis}
              tab={tab}
              onTabChange={setTab}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// --- Upload View ---

interface UploadViewProps {
  selectedFile: File | null;
  stage: AnalysisStage;
  parseError: string;
  jobDescription: string;
  onFileSelected: (file: File) => void;
  onClearFile: () => void;
  onJobDescriptionChange: (text: string) => void;
  onAnalyze: () => void;
}

function UploadView({
  selectedFile,
  stage,
  parseError,
  jobDescription,
  onFileSelected,
  onClearFile,
  onJobDescriptionChange,
  onAnalyze,
}: UploadViewProps) {
  const canAnalyze = stage === 'done' && jobDescription.trim().length > 20;
  const isAnalyzing = stage === 'analyzing';

  return (
    <div className="mx-auto max-w-3xl">
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
          <FileSearch className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Optimize Your Resume for ATS
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
          Upload your resume and paste a job description to get an instant ATS compatibility score,
          skill gap analysis, and AI-powered career advice.
        </p>
      </div>

      {/* Upload Card */}
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Step 1: Resume Upload */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              1
            </span>
            <label className="text-sm font-semibold text-slate-700">Upload Your Resume</label>
          </div>
          <FileUpload
            onFileSelected={onFileSelected}
            selectedFile={selectedFile}
            onClear={onClearFile}
            parseStatus={stage === 'analyzing' ? 'idle' : stage === 'complete' ? 'done' : stage === 'parsing' ? 'parsing' : stage === 'error' ? 'error' : 'idle'}
            error={parseError}
          />
        </div>

        {/* Step 2: Job Description */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              2
            </span>
            <label className="text-sm font-semibold text-slate-700">Paste the Job Description</label>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the full job description here, including required skills, responsibilities, and qualifications..."
            className="h-40 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <p className="mt-1 text-xs text-slate-400">
            {jobDescription.trim().length} characters
          </p>
        </div>

        {/* Analyze Button */}
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your resume...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze Resume
            </>
          )}
        </button>
        {!canAnalyze && stage !== 'analyzing' && (
          <p className="text-center text-xs text-slate-400">
            {!selectedFile
              ? 'Upload a resume to get started'
              : stage === 'parsing'
              ? 'Parsing your resume...'
              : stage === 'error'
              ? 'Fix the file error to continue'
              : jobDescription.trim().length <= 20
              ? 'Paste a job description (at least 20 characters) to continue'
              : ''}
          </p>
        )}
      </div>

      {/* Feature highlights */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FeatureCard
          icon={<LayoutDashboard className="h-5 w-5" />}
          title="ATS Score Analysis"
          desc="Get a detailed match score with keyword and skill breakdown"
        />
        <FeatureCard
          icon={<MessageSquare className="h-5 w-5" />}
          title="AI Career Assistant"
          desc="Chat with AI for interview prep, resume tips, and salary insights"
        />
        <FeatureCard
          icon={<Briefcase className="h-5 w-5" />}
          title="Skill Gap Insights"
          desc="See exactly what skills and keywords you're missing"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="mt-1 text-xs text-slate-500">{desc}</p>
    </div>
  );
}

// --- Results View ---

interface ResultsViewProps {
  analysis: AnalysisResult;
  tab: Tab;
  onTabChange: (tab: Tab) => void;
}

function ResultsView({ analysis, tab, onTabChange }: ResultsViewProps) {
  return (
    <div className="flex h-[calc(100vh-100px)] flex-col">
      {/* Tab bar */}
      <div className="mb-4 flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </button>
        <button
          onClick={() => onTabChange('chatbot')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === 'chatbot'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Career Assistant
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {tab === 'dashboard' && <Dashboard analysis={analysis} />}
        {tab === 'chatbot' && (
          <div className="h-full">
            <Chatbot analysis={analysis} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
