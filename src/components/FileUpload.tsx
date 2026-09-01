import { useCallback, useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  parseStatus: 'idle' | 'parsing' | 'done' | 'error';
  error?: string;
}

export function FileUpload({ onFileSelected, selectedFile, onClear, parseStatus, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelected(file);
  }, [onFileSelected]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  if (selectedFile && parseStatus !== 'idle') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{selectedFile.name}</p>
            <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
          {parseStatus === 'parsing' && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          )}
          {parseStatus === 'done' && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
          {parseStatus === 'error' && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <button
          onClick={onClear}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50'
        }`}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Upload className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-sm font-medium text-slate-700">
          Drop your resume here, or click to browse
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Supports PDF, DOCX, and TXT files
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelected(file);
          }}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
