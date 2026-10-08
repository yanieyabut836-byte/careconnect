# CareConnect — Final Implementation Plan

**Version:** Final (post-grilling, all gates resolved)
**Locked:** 2026-10-06
**Stack:** Next.js · Supabase (auth + database)
**Scope:** Employee side (9 screens) + Department Manager side (5+ screens)
**Visual source of truth:** Supplied Figma / screenshots (28–29 September 2026)

> [!IMPORTANT]
> This plan supersedes all prior working drafts. All decision gates (A–F, M1–M8) are now resolved and recorded below. Any future scope change requires an explicit plan revision — not a silent edit.

---

## Resolved Decision Gates

| Gate | Question | Decision |
|------|----------|----------|
| A | Employee activation flow | Manager creates account with a **default password**; employee is forced to **change it on first login** |
| B | Patient / Appointment dashboard tiles | **Real data** — employees have patient/appointment views (not yet scoped; tiles link to future pages) |
| C | Editable profile fields | Employee may update: **full name, position/job title, department, government IDs, emergency contact** |
| D | Task status vocabulary | **Pending = Not Started** (same status, different display label). Overdue is **auto-calculated** when the due date passes and the task is still incomplete |
| E | Announcement detail | Rows are **previews** — clicking opens a **detail modal / page** |
| F1 | Leave day calculation | **Calendar days** inclusive (e.g., Aug 1–Aug 3 = 3 days) |
| F2 | Leave types | Sick Leave · Vacation Leave · Emergency Leave · Maternity/Paternity Leave · Unpaid Leave · *(other types write-in accepted)* |
| F3 | Leave contact number | **Pre-filled from employee profile; employee may edit** before submitting |
| F4 | Leave statuses | Pending · Approved · Rejected/Denied · Cancelled (by employee before review) |
| M1 | Manager leave review UX | Dedicated **review form** with leave details, approve/deny buttons, and optional remarks |
| M2 | Manager vs. employee profile | **Shared global profile screen** — same page, same fields, same Change Password flow for all roles |
| M3 | Task detail mockup error | Task Details shows **task fields** (title, description, priority, assignee, due date, status) — the supplied mockup was mislabeled |
| M4 | Task state transitions | Pending/Not Started → In Progress → Completed; **employee Mark As Done** sets Completed; **manager Mark as Complete** also sets Completed; Overdue is computed, not a manual status |
| M5 | Task filters / destructive actions | Two priority dropdowns = assignee filter + priority filter; Duplicate and Delete require **confirmation dialog** |
| M6 | Announcement category source | **Priority maps to Category** on the employee side (e.g., High Priority shown as category label); send targets: All Employees · Specific Department · Specific Individual · Multiple Departments |
| M7 | "Upcoming Announcements" on Dashboard | **Sorted by posted date descending** (most recently posted first) |
| M8 | Attendance source | Pulled from a **biometric / time-clock system via API** — read-only in CareConnect **except** employees also have a **self-service Clock In / Clock Out button** (new scope addition) |
| — | Department scope | Manager sees and acts on **all employees company-wide** (role = employee, regardless of department) |
| — | Backend | **Supabase** (auth + database, already connected) |
| — | Framework | **Next.js** (already set up) |

---

## Delivery Boundaries

### Employee can
- Authenticate (login, activate account, change password on first login, forgot password)
- View and update their own profile (approved fields only)
- Clock in and clock out via the app (new scope addition)
- View their own attendance history and filter it
- View and complete their own assigned tasks
- View announcements and open announcement details
- Submit, view, and cancel (pre-review) their own leave requests

### Employee cannot
- Create, edit, or delete attendance records (except clock-in/out)
- Create, assign, or delete tasks
- Post or edit announcements
- Review another employee's leave request
- Access any other employee's data by altering URLs or request IDs

### Manager can
- View all employees company-wide and their attendance histories
- Create, edit, duplicate, complete, and delete tasks for any employee
- Post announcements (broadcast, by department, individual, or multi-department)
- Edit, duplicate, and delete announcements
- Review leave requests via a dedicated form (approve/deny + remarks)
- View leave request history for all employees

### Manager cannot
- Manually edit attendance records (source of truth is the biometric API)
- Create or delete employee accounts (account creation is separate HR/admin function)

---

## 1. Shared Foundation

### 1.1 Supabase Setup

- Tables: `employees`, `accounts`, `attendance`, `tasks`, `announcements`, `leave_requests`, `leave_reviews`, `departments`
- Row Level Security (RLS) enforced on all tables
- Employee RLS: read/write own records only (with specific column-level policies for profile updates)
- Manager RLS: read all employee records company-wide; write tasks, announcements, leave reviews
- Auth: Supabase Auth with email + password; `user_metadata` stores `role` (`employee` | `manager`)

### 1.2 Design System (Next.js)

- Reuse existing project tokens (colors, typography, spacing, sidebar, cards, tables, inputs) from Figma
- Shared components: Sidebar, TopBar, DataTable, StatusBadge, FilterBar, EmptyState, LoadingSpinner, ErrorCard, ConfirmDialog, Modal
- Responsive at Figma desktop breakpoint and project-supported viewports

---

## 2. Build Order

### Phase 0 — Project Contract *(prerequisite)*

1. Inspect existing repo: routes, Supabase schema, existing components, auth setup.
2. Map all 14+ supplied screenshots to routes/states. Establish shared design tokens.
3. Define Supabase table schema and RLS policies per the data contract (§3).
4. Record biometric API contract: endpoint, payload shape, polling/webhook strategy, error handling.

**Exit check:** Schema is migrated; RLS is testable; screen-to-route map is reviewed.

---

### Phase 1 — Auth & Shared Shell

1. **Login page** — email + password, Supabase Auth sign-in, role-based redirect after success (`/employee/dashboard` or `/manager/dashboard`).
2. **Activate Account** — first-login detection; force Change Password form before proceeding. Redirect to role dashboard after password set.
3. **Forgot Password** — Supabase email reset flow.
4. **Shared layout** — Sidebar (role-aware nav links), TopBar (signed-in identity from Supabase profile), loading/empty/error UI.
5. **Route protection** — middleware rejects unauthenticated requests; role mismatch redirects; unactivated account cannot reach protected routes.

> [!NOTE]
> Bell icon and global search are **not yet defined** — render as visible but inert; do not fabricate results.

**Exit check:** Employee and manager can log in to their respective shells. Unauthenticated and wrong-role requests are rejected.

---

### Phase 2 — Employee Read-Only Records

#### 2a. Profile
- Render: employment info, personal info, contact info, emergency contact, account info (last login, email).
- Government IDs and sensitive fields are displayed but protected (no inline edit; only via Update Profile form).
- **Update Profile form**: editable fields = full name, position/job title, department, government IDs, emergency contact. All other fields are read-only.
- **Change Password** — available from Profile; enforces current password + new password + confirm.

#### 2b. Attendance (read-only view)
- Today's Status, this-month summary cards (Late, Absent, Total Working Days).
- Dated rows: date, day, time-in, time-out, break, status, remarks.
- Date-range and status filters; Reset restores default view.
- Empty, loading, and error states.
- *(Clock In / Clock Out action is scoped to Phase 3a — employee actions)*

#### 2c. Announcements
- List: title/preview, priority (displayed as category label per Gate M6), publisher, posted time, category filter, pagination.
- **Detail modal/page**: full message, priority/category, audience, publisher, posted time, attachment download if present.
- Read-only; no employee write action.

**Exit check:** Pages load authorized records; filters/pagination work; no employee write endpoint for attendance or announcements.

---

### Phase 3 — Employee Actions & Workflows

#### 3a. Clock In / Clock Out *(new scope addition — Gate M8)*
- Button appears on Dashboard and/or Attendance page.
- State: `Clocked Out` → tap Clock In → record timestamp to Supabase → state becomes `Clocked In`; tap Clock Out → record out-timestamp.
- Prevent duplicate clock-in (disable button if already clocked in today).
- Attendance row for today is created/updated on clock-in/out; biometric API rows remain read-only and separate.

#### 3b. Tasks
- Summary cards: Total, Completed, Pending/Not Started, Overdue (auto-calculated).
- Tabs: All · Completed · Pending · Overdue.
- Filter by priority; Sort by Due Date; paginated rows.
- Upcoming Tasks widget; Progress by Status chart.
- **Mark As Done**: available only on incomplete, assigned tasks. Sends update to Supabase; refreshes list and counts; prevents duplicate submission; shows success/failure feedback.
- Employee cannot edit task title, description, assignee, priority, or due date.

#### 3c. Leave — Submit
- Create Leave Request form: leave type (Sick · Vacation · Emergency · Maternity/Paternity · Unpaid), start date, end date, Total Days (auto-calculated as inclusive calendar days), reason (required), contact number (pre-filled from profile, editable).
- Client-side and server-side validation: required fields, end date ≥ start date.
- Cancel: clears unsubmitted form (not a withdrawal of a submitted request).
- Submit: creates record in `leave_requests` with status = `Pending`; system generates request ID.

#### 3d. Leave — History & Details
- List: request ID, type, filed date, start/end dates, total days, status badge, View Details link.
- **View Details modal**: status, reason, contact, reviewer name, review date, remarks (where applicable).
- Cancel action: only for `Pending` requests; updates status to `Cancelled`.
- Pagination; empty/loading/error states.
- Rejected status shown when confirmed by manager review data.

**Exit check:** Employee cannot mark another person's task done, edit task definitions, review leave requests, or read another person's leave details.

---

### Phase 4 — Manager Shell & Employee Management

#### 4a. Manager Shell *(builds on Phase 1 shared layout)*
- Protected manager routes; backend enforces manager role on every read/write.
- Sidebar: Dashboard · Manage Employees · Tasks · Leave Requests · Announcements · Profile.

#### 4b. Manage Employees
- Summary bar: total employees, present today, late today, absent today (from biometric API via Supabase sync).
- Employee table: ID, name, position, today time-in/out, status. Search by name/ID; status filter; pagination.
- **View Attendance panel**: selected employee's identity, date-range picker, attendance summary (Late, Absent, Working Days), dated rows. Read-only; no attendance editing.
- Missing attendance, no-match, loading, and error states.

**Exit check:** Manager can search, filter, page, and view any employee's attendance. No attendance editing is possible.

---

### Phase 5 — Manager Tasks

1. Summary cards: Total, Pending/Not Started, In Progress, Completed (auto-calculated Overdue shown inline).
2. Task list: title, assignee, due date, priority, status, progress %. Search; two filter dropdowns (assignee + priority); Sort by Due Date; pagination.
3. **Create New Task**: title (required), description, priority, assignee (any employee in Supabase), due date, status, estimated progress %. Validate required fields and 0–100% bounds.
4. Row actions (each with confirmation dialog where destructive):
   - **View Details** — reads correct task fields (title, description, priority, assignee, due date, status, progress, completion info).
   - **Edit Task** — same fields as Create form; pre-populated.
   - **Duplicate Task** — creates a copy with "Copy of…" prefix; confirmation dialog.
   - **Mark as Complete** — sets status to Completed; confirmation dialog.
   - **Delete Task** — confirmation dialog; hard delete or soft delete per backend policy.
5. After any mutation: refresh list, summary cards, progress, and the assigned employee's task view.

**Exit check:** Task actions affect the correct records; employee task page reflects manager changes; manager cannot assign to a non-existent employee.

---

### Phase 6 — Manager Announcements

1. Create Announcement form: title (required), message (required), priority (maps to category on employee side), Send To (All Employees · Specific Department · Specific Individual · Multiple Departments — multi-select), optional attachment upload, optional schedule date (for future-dated publish).
2. Recent Announcements list: title, priority/category, posted timestamp, publisher, pagination.
3. Row actions:
   - **View** — detail view with message, priority, audience, attachment download.
   - **Edit** — same fields as create form.
   - **Duplicate** — copies with "Copy of…" prefix; confirmation.
   - **Delete** — confirmation dialog.
4. Employee visibility is determined by the stored Send To audience. Announcements appear on employee side with Priority shown as Category label.
5. "Upcoming Announcements" on Dashboard = sorted by posted date descending (most recent first).

**Exit check:** An announcement is visible only to its specified audience. Manager edits/deletes are reflected immediately on the employee side.

---

### Phase 7 — Manager Leave Requests

1. Leave list: request ID, employee name, leave type, filed date, start/end dates, total days, status badge.
2. Filter by status (Pending · Approved · Rejected · Cancelled); search by employee name; pagination.
3. **Review form** (modal or page): full leave details (type, dates, total days, reason, contact), status history, and:
   - Approve button + optional remarks → sets status to `Approved`.
   - Deny button + required remarks → sets status to `Rejected/Denied`.
4. Reviewed result is immediately reflected in the employee's leave history/details (status badge + reviewer name, review date, remarks).
5. Manager cannot alter status of `Cancelled` leaves or re-review already reviewed leaves (unless explicitly added later).

**Exit check:** Approve/deny updates are consistent between manager list and employee detail view. No unauthorized review is possible.

---

### Phase 8 — Dashboard (Employee & Manager)

#### Employee Dashboard
- Attendance summary (Today's Status, monthly counts) — same data as Attendance page.
- Tasks summary (Total, Completed, Pending, Overdue) — same data as Tasks page.
- Leave summary (pending, approved counts) — same data as Leave History.
- Recent Announcements preview (3–5 rows) — same source as Announcements page.
- Quick actions: Profile, Attendance Record, Tasks, Announcements, Submit Leave, Clock In/Out.
- Patient / Appointment tiles: real data cards with counts; link placeholder until patient/appointment pages are scoped.
- Calendar: informational only (no click interaction yet).
- One failed widget shows its own error without hiding other widgets.

#### Manager Dashboard
- Attendance summary: present, late, absent today (from biometric API sync); matches Manage Employees counts.
- Task status cards: Total, Pending, In Progress, Completed — matches Tasks page.
- Leave Requests preview: most recent requests with status; Review (Pending) and View (reviewed) actions link to Phase 7 review form.
- Upcoming Announcements: most recently posted, sorted descending — matches Announcements page.
- One failed widget shows its own error independently.

**Exit check:** All Dashboard figures reconcile with their source module for the same user/date range. View All links lead to implemented destinations.

---

### Phase 9 — Shared Profile (All Roles)

- Single `/profile` route shared by employee and manager.
- Sections: employment info, personal info, contact info, emergency contact, account info.
- **Update Profile**: editable fields = full name, position/job title, department, government IDs, emergency contact. Managed by Supabase update with server validation.
- **Change Password**: current password → new password → confirm. Uses Supabase Auth `updateUser`.
- Last login displayed (from Supabase Auth metadata).

---

### Phase 10 — Integration, Polish & Handoff

1. Visual QA against Figma at desktop breakpoint and supported viewports: spacing, typography, sidebar active states, table layouts, modal/form states.
2. End-to-end journeys:
   - Activate → forced change password → login → Dashboard
   - Employee: view profile → update profile → change password
   - Employee: clock in → view attendance → clock out
   - Employee: filter/sort/page tasks → mark task done
   - Employee: filter/page announcements → open announcement detail
   - Employee: submit leave → view leave history → view leave detail → cancel pending leave
   - Manager: search employee → view attendance panel
   - Manager: create task → edit task → mark complete → delete task
   - Manager: create announcement → view on employee side
   - Manager: review leave (approve) → verify employee sees updated status
3. Negative cases: invalid credentials, unactivated account, malformed form data, backend unavailable, expired session, unauthorized ID in URL, duplicate clock-in, invalid leave date range, no data states, cross-role route access, concurrent task mutation.
4. Document: environment setup, required Supabase secrets, biometric API integration contract, any remaining deferred scope, and the biometric Clock-In/Clock-Out data ownership model.

**Exit check:** All confirmed interactions work with real authorized data; no unresolved gate is presented as shipped behavior.

---

## 3. Data Contract (Supabase)

| Table | Key columns | Employee RLS | Manager RLS |
|-------|-------------|-------------|-------------|
| `employees` | id, account_id, name, position, department_id, gov_ids, emergency_contact, … | Read/write own row (approved columns only) | Read all |
| `accounts` | id, email, role, last_login, is_activated | Read own | Read all |
| `attendance` | id, employee_id, date, time_in, time_out, break_minutes, status, remarks, source | Read own; insert/update own app-source rows | Read all; no write |
| `tasks` | id, assignee_id, title, description, priority, due_date, status, progress, completed_at | Read own; update status/completed_at on own eligible tasks | Full CRUD |
| `announcements` | id, title, message, priority, send_to (jsonb), publisher_id, posted_at, attachment_url | Read where authorized by send_to | Full CRUD |
| `leave_requests` | id, employee_id, type, start_date, end_date, total_days, reason, contact_number, status, created_at | Read/insert/cancel own | Read all |
| `leave_reviews` | id, request_id, reviewer_id, decision, remarks, reviewed_at | Read own (via request_id) | Insert/read all |
| `departments` | id, name | Read | Read |

**Security rules:**
- RLS enabled on all tables; no `service_role` bypass in client code.
- Supabase Auth `user_metadata.role` is set server-side only (never from the client).
- Attachment files stored in Supabase Storage with RLS bucket policies.
- Biometric attendance rows (source = 'biometric') are insert-only from the integration service; employees and managers cannot modify them.

---

## 4. Definition of Done

### Employee Side
- [ ] Every confirmed control in the 9 supplied screens has a working destination/action.
- [ ] Employee data is read/written only within the signed-in employee's authorization scope.
- [ ] Lists support all visible filters, sort, and pagination; summaries use the same rules as underlying records.
- [ ] Forms provide required-field, invalid-value, pending, success, and failure feedback.
- [ ] Read-only pages handle empty, loading, and failed data states.
- [ ] Clock In / Clock Out correctly creates attendance rows and prevents duplicate entries.
- [ ] UI matches Figma; core flows pass end-to-end checks.

### Manager Side
- [ ] Every confirmed button, filter, search, and menu action behaves as established by the screens and resolved gates.
- [ ] No cross-employee data leaks through direct URL/request manipulation.
- [ ] Manager summaries and employee-facing records use the same definitions and update after successful changes.
- [ ] Leave review (approve/deny) updates are reflected immediately on the employee side.
- [ ] Announcement audience targeting is enforced at the database (RLS) level.
- [ ] All M1–M8 gates are reflected in the shipped implementation.
- [ ] Screens have loading, empty, validation, success, and failure feedback and match Figma.

### Full System
- [ ] Biometric API integration is documented and tested with the external provider.
- [ ] Supabase RLS policies are reviewed and penetration-tested for role escalation.
- [ ] All confirmed employee interactions work with real authorized data.
- [ ] Dashboard figures reconcile with source records for the same user/date range.
- [ ] Patient/Appointment tiles are data-connected but navigation is explicitly deferred to a future scope.

---

*Plan locked after grilling session on 2026-10-06. Any scope addition requires a revision with a new version date.*
