Role:
You are a Senior Frontend Architect with expertise in high-quality production UI.
Your task is to fully remove TailwindCSS from this project and replace it with modular CSS and a professional UI design system, without changing any functional logic.

🎯 Goal

Convert existing carboy-tech-frontend from:

Tailwind utility classes

Ad-hoc styling

Into:

Modern component-based CSS (CSS Modules)

Scalable, professional UI architecture

Fully responsive layout (mobile first)

Clean design structure with a defined design system

Same color tokens preserved

🛑 Important Rules

Do not change any backend API behavior

Do not change any business logic

Do not remove any components

Only replace styling and rewrite layout structure

Maintain all existing UI flows

Preserve color theme

Preserve progress bar logic

Preserve React Router structure

Preserve Zustand store

🎨 Design System
Color Tokens

Create src/styles/variables.css:

:root {
  --color-bg: #ffffff;
  --color-box-bg: #ecececa0;
  --color-text: #000000;
  --color-accent: #347b65;

  --color-border: rgba(0,0,0,0.1);
  --color-muted: rgba(0,0,0,0.6);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  --font-xs: .825rem;
  --font-sm: .9rem;
  --font-md: 1rem;
  --font-lg: 1.25rem;
  --font-xl: 1.5rem;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 2px 4px rgba(0,0,0,0.1);

  --container-width: 900px;
}


All components should only use these tokens.

📐 Architecture Updates

App.jsx is responsible for layout scaffolding

Every component must have its own Component.module.css

No global styling except:

variables

reset

typography

🖼️ Layout System
Container

Use a centered container:

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: var(--space-md);
}

📱 Responsive Behavior

Mobile-first:

Breakpoints:

@media (min-width: 480px)
@media (min-width: 768px)
@media (min-width: 1024px)


On mobile → vertical stacked

On tablet → two-column layout when possible

On desktop → wide layout

📊 Progress Bar UI

Create ProgressBar.module.css:

Horizontal step bar

Each step has:

small circle (radius-lg)

label

connecting line

Completed: --color-accent

Pending: --color-box-bg

Interaction:

Steps are visually progressing

Not clickable

Always visible at the top of JobFlow

🧩 Component Style Structure Example

Example for JobCard.jsx:

Create JobCard.module.css with:

.card {
  background: var(--color-box-bg);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  box-shadow: var(--shadow-sm);
}

.header {
  font-size: var(--font-lg);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}
...

🔧 What Claude Must Do
Remove all Tailwind dependencies:

Delete:

tailwind.config.js

/src/index.css tailwind imports

Remove Tailwind from:

package.json

vite.config.js plugin list

Remove Tailwind directives from css:

@tailwind base;

@tailwind components;

@tailwind utilities;

Convert JSX classes

Every component:

Remove Tailwind className strings

Create a matching CSS Module file with semantic classes

Import styles:

import styles from './Component.module.css'


Replace className usage:

<div className={styles.card}>

Ensure the result is professional:

Consistent padding

Standard spacing

Nicely balanced typography

Good contrast rules

Correct font sizes for mobile

Clean CTA buttons

🧠 Success Criteria

Claude should ensure the final UI:

Looks modern and clean

Uses consistent spacing scale

Uses the same brand accent color

Has defined visual hierarchy

No inline styling

No utility classes

All CSS in modules

Fully responsive

Production quality

🧪 Testing

After conversion:

Run app

Test login flow

Test job flow

Ensure dynamic progress bar works

Test mobile viewport in browser dev tools

🧭 Suggested Work Plan for Claude

Claude should work in this sequence:

Identify all Tailwind usage

Create variables.css

Create CSS reset

Remove Tailwind package + config

Update Vite config

Modify index.css to use reset + variables

Convert each component:

ProgressBar

Navbar

JobCard

ChecklistItem

etc.

Test UI

Fix any responsive layout issues

Polish design

🛑 VERY IMPORTANT

Do not modify any TypeScript/JS logic
Do not change API calls
Do not delete functional parts
Only change styling