# LINE Reports Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (native). Steps use checkbox syntax.

**Goal:** LINE group messages land in Supabase via the existing Cloudflare bot and show live on the FO5 web, readable only by logged-in users.

**Architecture:** Cloudflare Worker v5 (copy of v4) keeps forwarding to Discord and additionally inserts into Supabase through PostgREST with the service_role key. The web reads `line_reports` with supabase-js + Realtime, authenticated by Supabase Auth, protected by RLS.

**Tech Stack:** Supabase (Postgres, Auth, Storage, Realtime), Cloudflare Workers (plain JS), React 19 + Vite + `@supabase/supabase-js`, Node `node:test` for worker tests.

**Spec:** `docs/superpowers/specs/2026-11-18-line-reports-design.md` (section "ระยะที่ 2")

## Global Constraints
- Supabase project `fo5-command-center`, region `ap-southeast-1`, cost $0, org `vabgchuxzfhvhbsyjchu`
- `dept` ∈ `admin|relations|disaster|volunteer|unassigned`; `status` ∈ `new|acknowledged|in_progress|done` (match `src/data/lineReportsData.ts`)
- RLS on every table; `anon` has no access; inserts only by service_role; `line_message_id` unique
- Keyword head length 150 chars; keyword list identical to `LINE_ROUTES` in `src/data/lineReportsData.ts`
- Never edit `line-to-discord-worker-v4.js`; v5 is a new file; Discord forwarding must keep working if Supabase fails, and vice versa
- Secrets never committed or echoed; service_role key only in Cloudflare secrets
- All UI text Thai; deploy to Vercel only after local verification

## Review Focus
- LINE retries the same webhook event → no duplicate row (unique `line_message_id`)
- Message with no text (sticker/image only) → row saved with readable placeholder text, not an error
- Supabase down or key wrong → Discord post still succeeds; LINE still gets HTTP 200
- Logged-out visitor opens `/line-reports` → sees login, REST call with anon key returns no rows
- Sender edits `status`/`note`/`dept` only; cannot change `text`/`sender_name` from the web (column privileges)

---

### Task 1: Supabase project, schema, security
**Files:** Create `F5-/supabase/migrations/0001_line_reports.sql` (kept in repo as record)
**Interfaces:** Produces table `line_groups`, `line_reports`, bucket `line-media`, publication entry, project URL + anon key.
- [ ] Create project `fo5-command-center` (cost confirmed $0); wait until `ACTIVE_HEALTHY`.
- [ ] Apply migration: tables per spec, check constraints, `unique(line_message_id)`, RLS enabled, policy `select` for `authenticated`, `update` for `authenticated` with `revoke update` then `grant update (status, note, dept, matched_keyword, updated_at)` to `authenticated`, `updated_at` trigger, private bucket `line-media` + `select` policy on `storage.objects` for `authenticated`, `alter publication supabase_realtime add table line_reports`.
- [ ] Verify with SQL as anon role (`set role anon; select count(*) from line_reports;` → permission denied) and as authenticated (select ok, update of `text` denied).
- [ ] Run Supabase advisors (security + performance); fix any warning. Commit.

### Task 2: Worker v5 with tests
**Files:** Create `line-to-discord-worker-v5.js`, `line-worker/worker-logic.js`? — keep single file `line-to-discord-worker-v5.js` exporting pure helpers; Test `tests/worker-v5.test.mjs` (run with `node --test`).
**Interfaces:** Produces `classify(text, groupDept?) -> {dept, matchedKeyword?}`, `extractUnit(text) -> string|undefined`, `buildRow(event, name, groupName, groupDept) -> object`, default export `{ fetch }`.
- [ ] Tests (fail first): `classify` returns relations for "ตารางช่างภาพ ...", volunteer for "จอ.01", unassigned for "สวัสดี", group dept wins over keywords; `extractUnit("กก.ตชด.12 รายงาน")==="กก.ตชด.12"`, `extractUnit("บก.ตชด.ภาค 3 ...")==="บก.ตชด.ภาค 3"`, undefined when absent; `buildRow` for sticker gives `text` `"[ส่งสติกเกอร์]"`-style placeholder; fetch with bad signature → 401; with valid signature and failing Supabase mock → still posts Discord and returns 200; duplicate (409/ignored) is not an error.
- [ ] Implement v5 from v4: add Supabase insert (`POST {SUPABASE_URL}/rest/v1/line_reports`, headers `apikey`/`Authorization: Bearer service_role`, `Prefer: resolution=ignore-duplicates,return=minimal`), group lookup/auto-register in `line_groups` via LINE group summary API, image upload to Storage `line-media/<yyyy>/<messageId>.<ext>` (≤8 MB), `Promise.allSettled` for Discord and Supabase.
- [ ] `node --test tests/` passes. Commit.

### Task 3: Web service, Realtime, UI states
**Files:** Create `src/lib/supabase.ts`; Modify `src/services/lineReportService.ts`, `src/components/line/LineReportsView.tsx`, `src/data/lineReportsData.ts` (drop sample data); Add dep `@supabase/supabase-js`.
**Interfaces:** Produces `supabase` client; `lineReportService.{subscribe,getAll,setStatus,moveToDept,setNote,getState():'loading'|'ready'|'error'}`, `getMediaUrls(paths)->Promise<string[]>`. Consumes Task 1 schema.
- [ ] Rewrite service to fetch rows, subscribe to Realtime `postgres_changes`, optimistic updates, map snake_case↔camelCase to the existing `LineReport` type (`isSample` removed, `mediaPaths: string[]`).
- [ ] UI: loading skeleton, error banner with retry, empty state "ยังไม่มีรายงานจาก LINE", show images via signed URLs; remove sample banner/reset button.
- [ ] `npx tsc --noEmit` clean. Commit.

### Task 4: Supabase Auth replaces hash login
**Files:** Modify `src/contexts/AdminContext.tsx`, `src/data/usersData.ts`, `src/pages/LandingPage.tsx`, `src/vite-env.d.ts`.
**Interfaces:** `login(email, password) -> Promise<boolean>` unchanged signature; session from `supabase.auth`.
- [ ] Create the auth user `chairot.s@royalthaipolice.go.th` (temporary random password saved to ignored `F5-/ADMIN-PASSWORD.local.txt`), then disable public signups.
- [ ] Replace hash check with `signInWithPassword`; logout → `signOut`; restore session from `getSession`; keep `PRESET_USERS` profile data keyed by email; remove `VITE_FO5_ADMIN_PASSWORD_SHA256`.
- [ ] Set Vercel env `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (all envs), remove the old hash var.
- [ ] Local browser test: wrong password rejected, right password enters, logout, reload keeps session, anon REST read returns nothing. Commit.

### Task 5: End-to-end and deploy
- [ ] Simulate a signed LINE webhook locally against the real Supabase (HMAC with a test secret) and see the row appear live in the web.
- [ ] Deploy web: push `main`; verify production login and page.
- [ ] Deploy worker v5 to Cloudflare (keep v4 as rollback), set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`; send a real LINE message from the group and confirm Discord + web.
- [ ] Update design doc status. Commit and push.
