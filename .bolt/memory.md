# Project memory

## Product intent & audience

- Resume/CV processing web app; users upload resumes for parsing/analysis.
- Supports multiple upload formats: PDF, DOCX, TXT.

## Brand personality & voice

- Not yet explicitly defined; user values "beautiful, not cookie cutter" production-quality designs (per `.bolt/prompt`).

## Visual design & UX direction

- Aesthetic direction not yet inferred from concrete design work.
- UI should feel production-grade and distinctive, not generic template styling.

## Decisions, constraints & rationale

- Stack: Vite + React + JSX, Tailwind CSS, React hooks, Lucide React icons.
- Use `@/` path alias (maps to `src/`) for project module imports.
- PDF parsing uses `pdfjs-dist` with Vite's native `?worker` import so the PDF worker is bundled as a real web worker module.
- `pdfjs-dist` is NOT excluded from Vite processing; earlier `?url` and other worker approaches failed in dev mode, causing silent upload failures.
- Build and typecheck must both pass before considering a fix done.

## Open questions & assumptions

- Current upload issue may still be unresolved; need user confirmation of file type and any on-screen error.
- Resume parsing behavior/output format not yet fully documented.
- DOCX and TXT parsing implementation details not yet explored.