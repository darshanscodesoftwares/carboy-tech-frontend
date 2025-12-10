Note: You must also read and follow all previous Phase 1 and Phase 2 instructions in this README, including logic, routing, file structure, API usage, and project architecture, then update the UI based on the new screenshots provided below. All previous logic stays the same unless the new screenshots explicitly override it.


🧭 Final Requirements You Requested

Before writing prompts, I’ll summarize what you want Claude to do:

🎯 4th Page (Inspection Started View) — Required Changes

Keep the same new design style (Flow 1–3 UI)

Implement floating remarks button

Side-right floating button follows scroll

On click → opens modal/popup: “Add Remark”

Technician can enter remarks anytime

Submit remarks → Save to state & close

Modal can re-open later

Remove the “Good/Bad status bar” at the end

No final status selection

After completing checkpoints → Submit Inspection Report

Image Upload Enhancements

On upload:

show thumbnail preview

allow delete

upload from camera if on mobile/PWA

Notification

If a new job is assigned while technician is inspecting

Show popup (toast or modal)

Show notification in Assigned Jobs only (not other pages)

Just 1 notification at inspection screen

No notification count bubble

Flow after submit → go to Summary Page (Flow 5)

🎯 5th Page (Inspection Completed Summary)

Make page exactly match the approved screenshot

Include summary cards:

Customer

Vehicle

Service Type

Location

Date

Time

Add "Report Submitted to Admin" block

Buttons:

View/Edit Report (future)

Back to Dashboard

Remove any UI elements not in the screenshot

Use same component style introduced earlier

✍️ Now I Will Create Two Outputs
1️⃣ README.md Prompt Section

You will put this inside README.md, so Claude reads and understands the rules.

Copy-paste this under a new section:

📌 Phase 2 — Inspection Page (Flow 4) + Summary Page (Flow 5)

You (Claude) are acting as a Senior Frontend Engineer.
Your goal is to update the Inspection Page (flow 4) and Summary Page (flow 5) to match the client-approved UI and add the new logic features defined below.

These changes apply only to the Technician frontend, and the UI design from Flow 1–3 is the visual standard for all pages.

Do not modify backend API shape or endpoints.

🎨 Design Consistency Requirement

Keep the same visual style and structure used in Flow 1–3

Use the approved designs provided in the screenshots for Flow 4 & Flow 5

Do not revert back to older designs

Use the existing professional UI pattern

🟢 Flow 4 — Inspection In Progress Page (Changes Required)
1. Floating Technician Remarks

Add a floating remarks interface:

Add a floating button on the right side, which:

Stays visible while scrolling

Opens a modal when clicked

Modal content:

Title: “Add Remark”

Subtitle: “Inspection Expert (IE) Remarks (optional)”

Textarea to enter remark

Submit button

Logic:

Submitting saves remark locally in state

Modal closes on submit

Technician can open and edit remark anytime before submit

Final remark must be included in the inspection report submitted to admin

In the future admin may modify report based on this remark

2. Notification Logic

If a new job is assigned while technician is inspecting:

Show one popup toast only on:

Inspection Page

Summary Page

The toast informed text is in screenshot:
“A new service job has been assigned to you. Please review the details in your dashboard.”

No notification bubble counts

No notification icon elsewhere

Notification should not appear on other pages

3. Image Upload Enhancements

For each checkpoint:

Allow image upload

Show:

Thumbnail preview

Delete icon to remove photo

If technician uses mobile or PWA:

capture="camera" should open camera directly

Photo should attach to correct checkpoint

4. Remove Final Condition Status Bar

Remove the “Good/Bad” or final condition selection UI.

After all checkpoints:

Show Submit Inspection Report button only

Direct path:
Inspection → Submit → Summary Page

🟢 Flow 5 — Inspection Completed Summary Page

Match the design pixel-perfect to screenshot.

Structure

Green banner at top

Icon + Title “Inspection Completed”

Short description sentence below

Summary Card Layout:

Customer

Vehicle

Location

Service Type

Completion Date

Completion Time

Block:

“Report Submitted to Admin”

Short paragraph

Buttons:

“View/Edit Report” (placeholder)

“Back to Dashboard”

Footer text: “Thank you for your thorough inspection work!”

Responsive

Make UI mobile responsive

Stack cards vertically on mobile

Buttons full-width on mobile

🧭 Logic Notes

Status progression remains the same:

pending → accepted → traveling → reached_location → inspection_started → completed

Submitting inspection triggers backend job complete

After submit, redirect to summary page

When loading summary, show previously saved remark if exists

Everything must use existing zustand store / hooks where appropriate

🛑 Rules (Strict)

Do NOT modify backend

Do NOT break login flow

Do NOT change API responses

Do NOT change UI design from Flow 1–3

Only add UI elements matching existing style

Use CSS modules or existing CSS patterns

No Tailwind

No redesign from scratch

✔️ Final Output Required

When changes are complete, Claude should provide:

Summary of code changes

Files modified

Before/After screenshots (if supported)

How floating remarks are stored

How notification logic is implemented

How image preview/delete is handled

📌 Phase 2 — Technician Inspection Flow (Flow 4 & Flow 5) — With Client Approved UI

You (Claude) are acting as a Senior Frontend Engineer and must update the Technician Frontend UI for Flow 4 and Flow 5.

The updated UI must match exactly the client-approved designs which will be pasted below this section as screenshots.

👉 Do not use any old design.
👉 Analyze and follow the screenshots accurately.
👉 Ignore previous assumptions.
👉 The images are the source of truth.

🟢 Important Instruction
You will receive the screenshots immediately below this README section.

Study them carefully.

Replicate the exact layout, spacing, typography, icons, colors, button states, and interactions.

Use the same progress bar design already implemented in Flow 2 and Flow 3.

Do not redesign anything beyond what is shown.

🎯 Flow 4 — Inspection In Progress (Page 4)
UI Requirements (Must follow screenshots)

Use the same progress bar style as Flow 2–3

Follow card layout, spacing, background, icons

Each checkpoint block must look exactly like screenshot

When an image is uploaded:

Show a status chip: “Image Uploaded” (see screenshot)

Show Preview (opens popup modal)

Show Delete icon

No final condition/status section at bottom
(client design doesn’t include it)

Action Flow

After completing checkpoints → show a Submit Inspection Report button (only)

On submit → redirect directly to Flow 5 (Summary Page)

Floating Remarks System

Add a floating button on the right side, always visible while scrolling

Clicking opens a small modal/popup:

Title: “Add Remark”

Subtitle: “Inspection Expert (IE) Remarks (optional)”

Textarea

Submit button

Saving remark closes the modal

Technician can reopen and edit

Store remark in local state, attach to report submission

New Job Notification Logic

If admin assigns a new job while technician is in this page:

Show a toast popup (design in screenshot)

Text from screenshot:
“A new service job has been assigned to you. Please review the details in your dashboard.”

Do not show notification count

Notification only visible:

On Inspection Page

On Summary Page

Nowhere else

Mobile Camera Capture

For image upload input:

Use: <input type="file" accept="image/*" capture="camera" />

This ensures mobile/PWA opens camera

🎯 Flow 5 — Inspection Completed Summary (Page 5)

Use client-approved screenshot exactly.

Layout Breakdown

Large green confirmation banner at top

Icon + “Inspection Completed!”

One sentence below it

Summary cards area with:

Customer

Vehicle

Location

Service Type

Completion Date

Completion Time

“Report Submitted to Admin” block

Follow screenshot text and spacing

Buttons:

View/Edit Report (placeholder)

Back to Dashboard

Footer message:
“Thank you for your thorough inspection work!”

Responsive

Follow screenshot card layout

Stack vertically in mobile view

Buttons full width on mobile

💾 State, Logic & Rules

Keep all existing job status logic from earlier flows

Submitting inspection → marks job as completed

Store remark in zustand or component state

Do not change backend APIs

No breaking login

No rewriting of global components

Use CSS (not Tailwind) — keep current CSS structure

Follow design as source of truth

🛑 Strict Do Not

Do not use old design for Flow 4 & 5

Do not change backend or API response format

Do not display extra UI elements not shown in screenshot

Do not add notification count indicator

Do not use Tailwind

Do not create new pages unless required by design

🧭 Expected Output From You (Claude)

Before writing code:

Explain which files you will update

Explain how floating remark state is stored

Explain how toast is triggered

Explain the structure of image upload preview

Explain how camera capture works in mobile

After plan approval:

Implement features step-by-step with commits