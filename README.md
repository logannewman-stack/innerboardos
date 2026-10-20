# InnerBoard IOS (innerboardos.com)

The marketing site for InnerBoard IOS, the people operating system for
high-performing organizations. One page, built to the InnerBoard IOS Logan
Development Brief (October 15, 2026, "D3" in the build tracker) in the approved
section order:

Hero · Challenge · Solution (diagram 1) · How It Works (diagram 2) · The
Thinking Behind IOS (the book) · Outcome · Who It's For · Partners · Next Step ·
closing brand statement. Plus `/privacy` and `/terms`.

**Stack:** Astro 5 (static output), no framework runtime. The design system is
the one built for innerboardsuite.com (hand CSS tokens, a vanilla TypeScript
motion library, the phone and window frames), ported here and remapped to navy,
cream and muted gold. Tailwind 4 stays installed (its preflight and the
wordmark's few utilities); no layout number on any page is a Tailwind utility. Deploys on
Vercel as a static site; `vercel.json` carries the cache and security headers.

```bash
npm install
npm run dev        # localhost:4321
npm run build      # dist/
npm run sweep      # after a build: fails on any em/en dash or "iOS" in the output
npm run desk2x     # once, by hand: the four 2x window captures from the raw 2880 PNGs (needs sharp)
npm run small      # by hand after adding a phone capture: its 390 px variant (needs sharp)
```

## Where things are

| Path | What |
| --- | --- |
| `src/pages/index.astro` | The page and all of its copy, in the brief's order, with its layout CSS (every class prefixed `io-`). Nine sections, each with a `data-tone` (navy or cream) that the page cross fades between. |
| `src/components/IosHeroPlate.astro` | The hero's object and the device of the hero's scroll story (SCROLL_SPEC S9): the real Company OS Score in a phone in a warm halo. As the reader scrolls the hero's three beats, the later statements come in scored, the ring presses the app's own "See what ... means" bar, and the result scrolls to the three lowest. No camera move. |
| `src/components/IosPhilosophy.astro` | Diagram 1: five linked hairline rings (Leadership, Culture, Behavior, Results, Valuation) around IOS, an orbit drawn as the reader scrolls, and the legend with the brief's five definitions. |
| `src/components/IosWorkflow.astro` | Diagram 2 as a scroll story (SCROLL_SPEC S10): Assess, Develop (Personal Power, Social Influence), Embed, Measure, Certify are the story's steps; a browser window on laptops (a phone on tablets and phones) does each step while the stage stays pinned; the "Assess → Develop → ..." line is the progress marks. Static (reduced motion, no script, short screens): the five steps stacked, each with its screen. Never merged with diagram 1. |
| `src/components/IosBookStill.astro` | The book on the site's one linen mat. Drop the approved cover at `public/images/replaceable-cover.jpg` and change the `src`; nothing else moves. |
| `src/components/Header.astro`, `Footer.astro` | The fixed header (five anchors, the gold Company OS Score pill, the mobile sheet) and the linen footer. |
| `src/components/PhoneFrame.astro`, `WindowFrame.astro`, `StoryMarks.astro`, `Geo.astro`, `Arrow.astro`, `Mark.astro` | The shared system's components, copied verbatim from the Suite (WindowFrame's `sizes` adds the tablet width, audit 2 finding 22). |
| `src/components/Wordmark.astro`, `Icon.astro` | The IOS wordmark and the hairline icons. |
| `src/layouts/Base.astro` | The shell: `theme` (`navy` on the homepage, `cream` on the legal pages) is written on `<html>` so the first paint is right; fonts, meta, structured data, `site.ts`. |
| `src/styles/global.css` | The system's tokens (grid, type, spacing, shadows, easings), the two themes, surfaces, frames, header, footer; the IOS additions at the end under `/* IOS */`. |
| `src/styles/motion.css` | The system's motion CSS, verbatim from the Suite: reveals, line rise, lit words, the tone cross fade, drawn lines, and the scroll stories' pinned layout. Reduced motion, high contrast and no JS are handled here. |
| `src/scripts/site.ts` | The system's motion library, the Suite's file with three IOS edits (the menu closes at 1069, where this header's burger goes; a lit statement lights earlier on a phone; the header's tone sample always runs once more when a scroll settles): reveals, page tone, header tone and hide, the passive scene, the scroll story engine (1.7.19), drawn lines, parallax, tilt, the mobile menu, analytics events, UTM passthrough. |
| `src/config/links.ts` | Every destination on the site, in one place. The pending ones from the tracker's "Links to Confirm" tab are marked. |
| `public/app/` | The real Practice captures the stories use: the Company OS Score scored (two screens) and its result (two screens, stitched into one scroll strip) on a phone, the Track and the Role Blueprint on a phone, their four desk twins with the `-2x` files, and the `-390` phone variants (`npm run small`). Nothing else. |
| `scripts/desk2x.mjs` | Writes the `-2x` window files from the raw captures (run by hand; skips any raw that does not match the shipped 1600 file). |
| `scripts/sweep.mjs` | The copy check run by `npm run sweep`. |
| `public/og-image.png` | The share card: the hero's line and the brief's closing line on navy, the linen plate with the mark geometry. |
| `brief/` | The development brief and the approved visual reference. |

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
- The brief's executive photograph for the hero: the hero carries the real Company OS Score on a linen stage instead, and there is no slot for a photograph there.
- Whether the existing assessment collects email and sends a follow up. The site adds no gate of its own.
- The closing section has an empty `.io-panorama` slot (with an HTML comment in `index.astro`) for the brief's mountain photograph: when a licensed image is approved it becomes that element's `background-image` and nothing else changes. Until then the close is flat navy with a horizon lamp. By Leah's direction nothing of her appears on the sites; her name appears only on the book's author line, under the closing quote and in the footer credit.

## Decisions made here

- **Copy is the brief's, word for word**, in the brief's section order. Where the visual reference and the brief differ, the brief wins. The rebuild removed only text that was not the brief's: three eyebrows now take the brief's own words ("The InnerBoard IOS workflow", "Built for organizations ready to grow", "Let's build what's next"), the invented paragraph above diagram 1 and the five short labels inside its circles are gone (the brief's "Leadership → Culture → Behavior → Results → Valuation" line stands in their place), the "From insight to execution" eyebrow is gone, the footer's blurb is the brief's closing line, and the drawn Company OS Score mock and its invented statements are gone. The Measure paragraph's last sentence is a builder instruction and stays off the page.
- **The live site's rhythm on the Suite's system**: numbered section eyebrows, one large serif statement per section, the stacked one line argument, navy and cream alternating. The page itself paints nothing: each section carries `data-tone` and the body cross fades between navy and cream as the reader arrives (navy, cream, navy, cream, cream, navy, cream, cream, navy, then the linen footer). Each navy section has one lamp, its light from a different corner.
- **Real product, never a drawn mock.** The hero and the workflow show the actual Company OS Score captures from Practice, in the system's phone and window frames. Nothing plays on a timer: both are scroll stories, so the scroll position alone decides the screen, the ring, the cursor, the camera and the scroll inside the phone, and scrolling back plays it backwards. No camera move ever lands on the sample score; the site never writes it in text, captions, alts or labels; the captures may show it.
- **Diagram 1 and diagram 2 stay separate**, as the brief requires: the philosophy is five interlocking rings on navy with an orbit and the brief's definitions in the legend; the workflow is a pinned scroll story on cream, step by step in the app, with Personal Power and Social Influence lighting in turn under Develop.
- **Navy, cream and muted gold only.** Gold `#b3934f` for filled buttons and lamps; gold-2 `#c9ab66` for eyebrows, italics and hairlines on navy; gold-ink `#6e5724` for italics and links on cream. One linen mat (the book), one linen plate (the hero), pill buttons.
- **Without JavaScript** the page rests on cream and the four navy sections paint themselves (the cross fade needs the script); everything is visible, frames show their first screen.
- **The book is one flat plane turned in perspective**, its binding drawn along the left edge, and the mat clips its shadows. A `preserve-3d` spine (the spec's first version) lost the book's lower half in Chromium whenever the top of the book was scrolled out of view.
- **The window serves the 1600 px captures on 1x screens** and the `-2x` files on 2x screens. The window is 792 px wide, so the 1600 file is already twice its width; the system's `WindowFrame` (kept verbatim) picks the 2880 file only on high density screens. The spec's wish for the `-2x` file at 1x would add about 50 KB per frame for no visible gain.
- **No founder in the structured data.** The JSON-LD names the organization only, so her name appears nowhere but the three places the brief puts it (as on the Suite).
- **`site.ts`, `motion.css` and the frames are the Suite's files** (ported October 20, 2026, with the scroll stories), plus the three IOS edits in `site.ts` noted above. `global.css` keeps its IOS palette and the `/* IOS */` block; the story, frame and audit rules were merged into it.

## Copy rules enforced

No em or en dashes anywhere in the output (`npm run sweep`). "InnerBoard IOS"
is spelled with a capital I and OS, never "iOS". No testimonials, metrics,
pricing, trial offers or client logos beyond what the documents approve. No
sample score in any text, caption, alt or label. The only text the rebuild adds
is the window captions and image descriptions, each naming a screen.
