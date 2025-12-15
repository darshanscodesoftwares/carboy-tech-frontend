## ✏️ Edit Mode Support for Technician Inspection Flow

The frontend must support an **Edit Report** mode so technicians can reopen a completed inspection, modify checkpoint answers, change uploaded images, and resubmit the report.

### 🔧 Required Behaviors

1. **Edit Mode Routing**
   - The “Edit Report” button on the Summary Page must route to:
     `/job/:jobId/inspection?edit=true`

2. **Skip Summary Override in Edit Mode**
   - In JobFlow.jsx, the summary auto-render logic must be bypassed when `edit=true`.
   - Replace the existing summary check with:
     ```js
     if (!isEditMode && (job?.status === JOB_STATUSES.COMPLETED || summary)) {
       return renderSummary();
     }
     ```

3. **Enable Editing of Existing Checkpoints**
   - ChecklistItem.jsx currently locks editing using:
     `disabled={isCompleted}`
   - Change this to:
     `disabled={isCompleted && !isEditMode}`

4. **Enable Resubmission**
   - The “Submit Report” button at the bottom of the Inspection page must work in edit mode as well and correctly call the `completeJob()` logic.

5. **Do NOT auto-submit after all checkpoints are completed.**
   - The inspection only completes when the technician presses **Submit Report**.

6. **All pages must support edit mode consistently.**

### 🔍 Summary

Claude must implement a persistent **edit mode system** based on the `?edit=true` query param, allowing the technician to re-open a completed inspection, adjust checkpoints, change photos, and resubmit the report.
