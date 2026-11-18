# FO5 Smart Operations – Implementation Notes

This update adds an operational AI/workflow layer without changing the existing Landing Page or the main Dashboard implementation.

## What was added

### Shared FO5 Smart Operations Workspace
- AI Assistant with real Gemini support through a server-side Vite middleware endpoint when `GEMINI_API_KEY`/`GOOGLE_API_KEY` is configured.
- Safe local/offline fallback when no AI key is available.
- Human-in-the-loop wording and confirmation expectations.
- Persistent task board using browser localStorage.
- Task status flow: pending → doing → done.
- Priority tracking and quick insight cards.
- Workflow automation presets that create real local task records.
- Daily Executive Brief generated from the current task state.
- JSON export of departmental task data.

## Department integration

### งานอำนวยการ
- New `AI & Workflow` tab inside the existing department navigation.
- Suggested AI flows for document triage, memo drafting, deadline review, and executive summaries.
- Existing Dashboard and all existing administration modules remain available.

### งานมวลชนสัมพันธ์และประชาสัมพันธ์
- New `AI & Workflow Center` item in the existing PR Operations sidebar.
- Existing PR monitoring, news CMS, media library, analytics, and public portal remain available.
- AI prompts focus on monitoring, news drafting, content planning, and executive summaries.

### งานสาธารณภัย
- New `AI & Workflow` tab in the existing disaster operation header.
- AI prompts focus on incident triage, emergency communication drafts, operational summaries, and after-action reporting.
- Existing map, flood monitoring, incident management, alerts, and exports remain available.

### งานจิตอาสาพระราชทาน
- Replaced the previous placeholder with a working operational module.
- Added AI & Workflow Center.
- Added overview, volunteer registry, missions, inventory, and impact reporting views.
- Uses the same task/AI workflow core so the department can be expanded without redesigning the rest of the application.

## AI architecture

The browser calls `/api/ai` with a department-scoped prompt and limited context. The Vite development server handles the request and calls Gemini using a server-side environment variable. The API key is not placed in frontend code.

If no key is configured, the UI automatically falls back to safe local responses so the workflow features remain testable.

## Important operational rule

AI output is assistance only. Staff must verify factual content, recipients, deadlines, and official wording before external publication, submission, or command-level use.
