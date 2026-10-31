# majingze.com

Personal website of Jingze (Jacob) Ma, live at [www.majingze.com](https://www.majingze.com).

Built with Next.js (App Router), React, TypeScript, Tailwind CSS and Motion, and deployed on Vercel from `main`.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Editing content

All site content lives in [`lib/data.ts`](lib/data.ts):

- `experiencesData` drives the experience chart and timeline. Dates are `"YYYY-MM"`; use `end: null` for a current role.
- `projectsData` drives the project cards. Images go in `public/` and are imported at the top of the file.
- `skillGroupsData` drives the skills section.
- `contactLinks` holds the email, LinkedIn and GitHub links used across the page.

The downloadable resume is `public/CV.pdf`.
