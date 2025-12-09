🟢 Claude Instructions (Frontend UI Rebuild)

Project Goal
Redesign the Technician Frontend UI to match the provided client-approved screenshots exactly. Use the images and the flow descriptions below as the source of truth for design, layout, spacing, and UI components.

🚫 Important Rules

Do NOT modify the backend repo (carboy-tech-backend) in any way.
If any API structure changes are needed, work on carboy-tech-backend in a new branch, and document reasons.

Do all UI and logic work in carboy-tech-frontend repo only.

Preserve all API calls and lifecycle logic from:

Login

/technician/me

Job listing

Travel flow

Checklist

Completion

If refactoring is needed, do it cleanly without breaking functionality.

🎨 Design Requirements
Color Theme
--color-bg: #ffffff
--card-bg: #ecececa0
--color-text: #000000
--color-accent: #347b65
--status-accepted: #B2F3D8
--status-pending: #FFE7A1

Components to Create or Update

Navigation bar

Assigned Jobs table

Status count cards

Job Detail layout

Progress bar with 5 stages

Buttons

Google Maps preview block

Responsive layout for mobile/tablet

Technical Standards

Use normal CSS modules (no Tailwind).

Maintain responsive design:

Desktop (1440px)

Tablet (768px)

Mobile (375px)

Use CSS variables from src/styles/variables.css

Keep code clean, structured, and component-based.

🧭 Flow Requirements

Use the attached 3 Screenshots and Flow Descriptions as references:

Flow 1: Assigned Jobs Dashboard
(job table, counts, accept/view buttons)

Flow 2: Job Details
(customer info, vehicle info, booking info, Start Travel)

Flow 3: Travel Progress
(5-stage progress bar, map section, reached location button)

Your output should look identical to the reference, including:

spacing

font size

border radius

color application

icon placement

typography hierarchy

interaction states

🛠 Execution Plan

Analyze the entire repository and locate all components related to the 3 flows.

Create a new branch:

git checkout -b feature/ui-rebuild


Update components to match UI exactly.

Update CSS files with professional layouts similar to the reference designs.

Add responsive rules.

Test each flow against backend APIs using real token.

Commit code with meaningful messages.

Provide a visual diff comparison in output.

🧑‍💻 Output Expectations

Claude should:

Update JSX/CSS to match reference UI

Adjust component structure if needed

Add missing UI logic (button states, loading, disabled states)

Add map placeholder images until integrated

Keep mobile design clean and usable

Clean up unused code from Tailwind era

Ensure no design inconsistencies

When work is completed, Claude should provide:

Summary of what changed

Files modified

Screenshots comparison (if available)

Next suggested improvements

🦶 Footer Requirement (Apply to All Pages)

Add a global footer component that appears at the bottom of all pages in the technician frontend.

Footer Design Requirements

Full-width footer with clean, minimal layout

Background color: #ecececa0 (light grey box feel)

Text color: #000000

Use accent color #347b65 only for links/icons

Height: ~80px on desktop, auto on mobile

Rounded top corners: border-radius: 16px 16px 0 0

Apply soft shadow at the top edge: 0 -2px 6px rgba(0,0,0,0.05)

Footer Content

Include the following items, centered horizontally:

Company name: CarBoy Tech

Copyright text: © 2025 CarBoy

Links as inline buttons:

Privacy Policy

Terms

Help/Support

Small icon row on top (optional if matches design):

Email icon

Phone icon

Location pin icon

Placement & Behavior

Place the footer below the main content, not fixed on screen

Ensure footer stays at bottom even when content is short (sticky footer layout)

Use layout wrapper for consistent spacing across pages

Responsive:

On mobile: stack elements vertically

On tablet/desktop: inline horizontal layout

Component Structure

Create: src/components/Footer.jsx

Add styles: src/styles/Footer.css

Import Footer inside main layout wrapper (e.g., in App.jsx)

Do not duplicate code per page — use a single shared component

Notes

Follow the same typography (font sizes, weight) as the rest of the UI

Maintain clean spacing (use consistent padding)

No Tailwind — use CSS modules or standard CSS

Ensure footer visually matches the style and tone of the 3 reference screens