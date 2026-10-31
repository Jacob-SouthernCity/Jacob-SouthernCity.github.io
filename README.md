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

All content lives in YAML files under [`content/`](content/): profile, experience, projects, skills and places. See [content/README.md](content/README.md) for how to edit them, including from the GitHub website. The build validates every file and fails with a clear message if something is wrong.

To add a place to the travel globe without looking up coordinates, add its name and country to `content/places.yaml` and run:

```bash
npm run places:geocode
```

## GitHub Pages

This repository is also served at jacob-southerncity.github.io. The `docs/` folder holds a redirect page to www.majingze.com; GitHub Pages should be set to deploy from the `main` branch, `/docs` folder.
