# Site content

Everything shown on the site lives in these YAML files. Edit them and the site updates; no code changes needed.

| File | What it controls |
| --- | --- |
| `profile.yaml` | Name versions, rotating titles, bio, resume download, contact links |
| `experience.yaml` | Work and education: the timeline chart and cards |
| `projects.yaml` | Project cards, images, trailer, links |
| `skills.yaml` | Skill groups and chips |
| `places.yaml` | Places on the travel globe |
| `trips.yaml` | Trips: name, months, and the places visited in order |
| `locales/zh.yaml`, `locales/ja.yaml` | Chinese (/zh) and Japanese (/ja) translations of the files above |

## Updating from the browser

1. Open the file on GitHub and click the pencil icon.
2. Make the change and choose **Create a new branch and start a pull request**.
3. The CI check validates the content and builds the site. Vercel posts a preview link on the pull request.
4. Merge the pull request; Vercel deploys it to www.majingze.com.

If something is wrong (a date like `2024-8`, an unknown icon, a place id that does not exist), the check fails with a message that names the file and the field.

## Common edits

- **New job:** add an entry to the top of `experience.yaml` and set `end: null`. Set `end` on the previous role.
- **New trip:** add the places you visited to `places.yaml` (`id`, `name`, `country`, and optionally `region`), run `npm run places:geocode` to fill in coordinates and country codes, then add the trip to `trips.yaml` with its months and place ids in order. Places on a trip show as Visited automatically, unless they already have another tag (a home or school stays Lived or Studied).
- **New place outside a trip:** add it to `places.yaml` with `tags` (lived, studied, worked, visited), then geocode it the same way.
- **Link a role to the map:** give the experience entry `place: <place id>`. The map then shows it as Worked or Studied.
- **New project image:** put the file in `public/projects/` and reference it as `/projects/<file>`. Its size is read automatically.
- **New icon:** icons come from `lib/icons.ts`; add one there if the name you want is missing.
- **New resume:** replace `public/CV.pdf`.

## Translations

The English files are the source of truth. `locales/zh.yaml` and `locales/ja.yaml` hold only the translated text, keyed by the English id (projects and skill groups by their English title). Anything without a translation shows in English.

- **When you add or change English text,** add or update the same entry in both locale files: experience titles and descriptions, project descriptions and link labels, skill group titles, place names and notes, new regions or countries, and trip names.
- **When you rename or remove an id,** rename or remove it in the locale files too. The build fails on translations for ids that no longer exist.
- Keep each translated text on one line; YAML's folded `>-` blocks add spaces between lines, which reads wrong in Chinese and Japanese.
- Interface text (buttons, headings, hints) lives in `lib/i18n/messages.ts`; TypeScript fails the build if a language is missing a string.
