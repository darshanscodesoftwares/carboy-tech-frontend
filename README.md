## Phase 3 — Final UI Implementation (Flows 1-5)

This phase replaces older UI on Flow 4 (“Inspection Started”) and Flow 5 (“Inspection Completed”) with the client-approved designs shown in the screenshots below.

### 🚨 UI Source of Truth
The screenshots provided in this section are the **ONLY** source of truth for UI design. **Do not reuse previous UI layouts or patterns if they conflict with the screenshot design.** The design shown in the screenshots overrides any previous UI code, including the layout from Flow-1/2/3.

### 🎯 Required UI Rules

Important: The following rules are **absolute** and must be followed exactly:

1. **Unified Progress Bar (All Pages)**
   - Every flow page (Accept → Traveling → Reached Location → Inspection Started → Inspection Completed) must show **the same progress bar design** as shown in screenshot flows 2 and 3.
   - Style, icons, spacing, alignment, colors, active state, completed state must match the screenshots.
   - Keep the progress bar at the **top of the page**, always visible on load.

2. **Remove Final Condition Dropdown**
   - In the checkpoint inspection page, **remove any final “Overall Condition” / Good-Bad dropdown**.
   - The client-approved design does not include this element.
   - The inspection ends directly after all checkpoints and pressing `Submit Inspection Report`.

3. **Client-Approved Summary Page**
   - The summary page (Flow-5) must use the **exact layout shown in the screenshot**:
     - Big green confirmation section
     - Two-column card grid for summary data
     - Report submitted section
     - Buttons: `View/Edit Report` and `Back to Dashboard`
   - **Do not reuse older “final report UI”**, this design replaces it completely.

4. **Floating Remarks Feature**
   - The floating remark button shown in the screenshot must exist **on all inspection pages**.
   - The floating remark panel opens **on click**, allowing the technician to submit remarks.
   - “Submit Remark” closes the panel and saves the text.
   - This remark is sent with the inspection report.
   - The floating UI must **follow the scroll** (sticky on right side), as shown.

5. **Image Upload UI**
   - Each checkpoint must display:
     - `Upload Image` button
     - When image is uploaded → show `Image Uploaded` UI state (refer to screenshot)
     - A `Preview` button opens an image popup modal
     - A `Delete` button removes the image
   - The UI must match screenshot visuals (pill button, icon, text style).

6. **Mobile Camera Support**
   - Clicking `Upload Image` must trigger file input (web) AND camera capture (when installed as PWA/mobile).
   - No backend change required now; the UI must be ready for mobile usage.

7. **New Job Notification**
   - Notification UI must appear **only inside the Inspection Flow pages** (not on login or dashboard).
   - When admin assigns a new job, show:
       1. A small card notification (as shown in screenshot)
       2. A popup/toast message once
   - Do not add a notification center or badges.
   - The only location that shows notification is:
       - During inspection page, and summary page.

8. **Back to Dashboard**
   - Every page must include a **Back to Dashboard** button at the bottom.
   - It must return to the Assigned Jobs page.
   - Style must match the screenshot in Flow-5.

9. **No Redesign**
   - **Do not alter** spacing, typography, container widths, paddings beyond what the screenshot shows.
   - **The screenshot is the UI contract**.

### 🧠 Logic Preservation Rules
Even though the UI is changing, **all technician logic must stay exactly the same**:

- Status flow:
  `pending → accepted → traveling → reached_location → inspection_started → completed`
- API calls and endpoints remain unchanged.
- Zustand state usage remains unchanged.
- Routing stays the same.
- Auth flow stays the same.

The UI is updated, but **the backend flow, state machine, and navigation logic does not change** unless screenshots require it.

### 📌 Screenshots
(Paste all client-approved images here in order: Flow-1 → Flow-2 → Flow-3 → Flow-4 → Flow-5)

### 🔗 Integration Rule
When implementing this phase, **read and follow all instructions from Phase-1 and Phase-2 above**, including:
- routing behavior
- Accept → Travel direct navigation
- pagination
- status chip styling
- layout structure
- dashboard logic

If there is a conflict: **the screenshot wins**, not the old UI.

