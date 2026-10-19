# InnerBoard IOS (innerboardos.com)

The marketing site for InnerBoard IOS, the internal operating system for
organizations. One page, built to the InnerBoard IOS Logan Development Brief
(October 15, 2026, "D3" in the build tracker) in the approved section order:

Hero · Challenge · Solution (diagram 1) · How It Works (diagram 2) · The
Thinking Behind IOS (the book) · Outcome · Who It's For · Partners · Next Step ·
closing brand statement. Plus `/privacy` and `/terms`.

**Stack:** Astro 5 (static output), Tailwind 4, no framework runtime. Deploys on
Vercel as a static site; `vercel.json` carries the cache and security headers.

```bash
npm install
npm run dev        # localhost:4321
npm run build      # dist/
npm run sweep      # after a build: fails on any em/en dash or "iOS" in the output
```

## Where things are

| Path | What |
| --- | --- |
| `src/config/links.ts` | Every destination on the site, in one place. The pending ones from the tracker's "Links to Confirm" tab are marked. |
| `src/pages/index.astro` | The page and all of its copy. |
| `src/components/CircleDiagram.astro` | Diagram 1: five linked circles, Leadership, Culture, Behavior, Results, Valuation, with the brief's definitions. |
| `src/components/WorkflowDiagram.astro` | Diagram 2: Assess, Develop (Personal Power, Social Influence), Embed, Measure, Certify. Never merged with diagram 1. |
| `src/components/AssessmentPhone.astro` | The Company OS Score on a phone, with the book's own statements, labelled illustrative. |
| `brief/` | The development brief and the approved visual reference. |
| `src/components/BookCover.astro` | The book. Drop the approved cover at `public/images/replaceable-cover.jpg` and point the `img` at it. |
| `src/components/Mountains.astro` | The panoramic close, drawn. Swap for the approved photograph when it arrives. |
| `src/styles/global.css` | Tokens (navy, cream, muted gold), fonts, buttons, entrances. |
| `src/scripts/site.ts` | Entrances, the header, the mobile menu, analytics events, UTM passthrough. |

## Analytics events

Every call to action carries a `data-event`: `assessment_click`,
`consultation_click`, `book_click`, `partner_inquiry_click`, each with a
`location`. `track()` in `src/scripts/site.ts` pushes them to `dataLayer`,
`gtag` and `plausible` when any of those is on the page, and does nothing
otherwise. Add the analytics tag to `src/layouts/Base.astro` when the account
exists. No popups run before the assessment.

Links that carry `data-passthrough` (the Company OS Score, the app) get the
page's `utm_*` and `from` parameters appended, so a campaign's score is counted
under the campaign.

## Links still to confirm (from the tracker)

| Button | Today | Needs |
| --- | --- | --- |
| Get Your Company OS Score | `practiceinnerboard.com/book/upstream?from=os` | Confirm the results flow and email capture. |
| Talk to Our Team / Let's Talk About Your Organization | `mailto:info@innerboardsuite.com` | Booking or contact URL. |
| Buy the Book | The book inside Practice | The Replaceable purchase URL. |
| Explore a Partnership | `mailto:info@innerboardsuite.com` | Partner inquiry destination. |
| Privacy / Terms | `/privacy`, `/terms` on this site | Counsel review. |

## Open questions (from the tracker)

- The founder's title under the closing quote reads "Founder, InnerBoard" until confirmed (`SITE.founderTitle`).
- The real Replaceable cover file; the drawn one at `public/images/replaceable-cover.svg` is a placeholder.
- Whether the existing assessment collects email and sends a follow up. The site adds no gate of its own.
- The hero carries the drawn Company OS Score where the brief's executive photograph goes; the closing panorama is drawn too. Both accept an approved photograph without a layout change. By Leah's direction nothing of her appears on the sites; the closing quote keeps her name as the brief requires.

## Copy rules enforced

No em or en dashes anywhere in the output (`npm run sweep`). "InnerBoard IOS"
is spelled with a capital I and OS, never "iOS". No testimonials, metrics,
pricing, trial offers or client logos beyond what the documents approve.
