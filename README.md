# InnerBoard IOS (innerboardos.com)

The marketing site for InnerBoard IOS, the people operating system for high-performing organizations, built to the
InnerBoard IOS Logan Development Brief (October 15, 2026; `brief/`) in the brief's section order and copy, on the
design system built for innerboardsuite.com. Astro 5, static output, no framework runtime, deployed on Vercel.

```bash
npm install
npm run dev        # localhost:4321
npm run build      # dist/
npm run sweep      # after a build: fails on any em or en dash, or "iOS", in the output
```

## Pages

`/` (the page below), `/privacy`, `/terms`, and the not found page (`src/pages/404.astro`, served by Vercel for any
missing path). Each has its own title and meta description made of its own sentences, a canonical URL on
`https://innerboardos.com`, Open Graph and Twitter card tags with `public/og-image.png`, and the theme colour of its
first paint (navy on `/` and the 404, cream on the legal pages). The 404 is `noindex`, has no canonical URL and is left
out of the sitemap; `robots.txt` allows everything and names `sitemap-index.xml`, which lists `/`, `/privacy` and
`/terms` only.

### The homepage, section by section

Every section carries `data-tone` (navy or cream); the page itself paints nothing, and the body cross fades between
the two as each section's top passes the middle of the screen. Each navy section has one soft steel lamp from a
different corner.

| # | Section (`id`, tone) | What is on it |
| --- | --- | --- |
| 1 | Hero (`#ios`, navy) | "Growth doesn't have to depend on you." with the Company OS Score on a phone in a soft steel halo. From 1069 x 600 the hero is a pinned scroll story in three steps (the rail and "01 / 03" beside the phone, both buttons pinned under the copy): the scored statements, then the later ones; the ring presses the app's own "See what ... means" bar, the result wipes up and at once scrolls past the score to rest on its reading and the three lowest statements; then the Assessments page of InnerBoard OS. Below that width, and in every static case, the hero is static on the scored statements. |
| 2 | The challenge (`#challenge`, cream) | The heading and three paragraphs, three ruled columns, and the stacked one line argument ("What it costs") lighting line by line. |
| 3 | The solution (`#solution`, navy) | The statement, two columns, and diagram 1: five linked rings (Leadership, Culture, Behavior, Results, Valuation) around IOS, an orbit the reader draws by scrolling, the brief's five definitions beside it. |
| 4 | How it works (`#how-it-works`, cream) | Diagram 2 as a pinned scroll story in five steps (Assess, Develop with Personal Power and Social Influence, Embed, Measure, Certify), each with its own screen: a browser window on laptops with a drawn cursor, a phone on tablets and phones. Then "One connected system..." and the locked line "Assess → Develop → Embed → Measure → Certify". Never merged with diagram 1. |
| 5 | The book (`#book`, cream) | Replaceable on a linen mat (the cover is a placeholder, below), the brief's copy, Buy the Book. |
| 6 | The outcome (`#impact`, navy) | The lit statement and the six outcomes. |
| 7 | Who it's for (`#who-its-for`, cream) | The four audiences as a ruled ledger. |
| 8 | Partners (`#partners`, cream) | The statement, the margin rule, Explore a Partnership. |
| 9 | Next step (`#next-step`, navy) | The close, the founder's quote, the brand line and the mark. Then the linen footer. |

Without JavaScript, and with reduced motion, nothing is pinned or hidden: both stories show every step stacked, each
with its own still screen, and the page rests on cream with its navy sections painting themselves.

## The system and the story engine

The same system runs innerboardsuite.com; these are this site's copies, with the IOS palette.

- `src/styles/global.css`: tokens (12 column grid, type scale, spacing, radii, shadows, easings), the navy and cream
  themes, surfaces, the phone and window frames, header, footer, the static layout of the stories; IOS rules at the
  end under `/* IOS */`.
- `src/styles/motion.css`: reveals, line rise, lit words, the tone cross fade, drawn lines, the pinned step layout of
  the stories. Reduced motion, high contrast and no script are handled here.
- `src/scripts/site.ts`: the motion library (reveals, page and header tone, header hide, the scroll story engine,
  drawn lines, tilt, the mobile menu, analytics events, UTM passthrough). A story is a tall track whose stage sticks
  under the header (native `position: sticky`); the scroll position alone decides the step, the frame each device
  shows, the ring, the cursor and how far a stitched capture has scrolled, so scrolling back plays it backwards and
  nothing moves on a timer. The rail's segments are buttons (Enter goes to a step, the arrows move between steps).
  `window.__ib.stories` exposes each story's state for QA. IOS edits to the Suite's engine: the menu closes at 1069
  (where this header's burger goes), a tall lit statement lights earlier on a phone, the header's tone sample runs
  once more when a scroll settles, the fallback dark paint is `#0d3054`, and a story warms (fetches and decodes) its
  frames only once it is within two screens, so the first screen never pays for them.
- Components: `PhoneFrame`, `WindowFrame`, `StoryMarks`, `Geo`, `Arrow`, `Mark` are the system's; `Header`,
  `Footer`, `Wordmark`, `Icon` and the four page parts `IosHeroPlate` (the hero's phone), `IosPhilosophy`
  (diagram 1), `IosWorkflow` (diagram 2 and its screens), `IosBookStill` are this site's. `src/pages/index.astro`
  holds the copy and the page's layout CSS (classes prefixed `io-`). `src/config/links.ts` holds every destination.

## Brand decisions

- **The InnerBoard OS brand book's blues, cream, and nothing else** (the client, October 21: "IOS is the blue
  color"). Navy `#0d3054` (the book's navy and the "OS" in the logo; also the share card), cream `#f4efe4`, linen
  `#ebe4d5` for the footer and the book's mat. Soft steel `#8aa3bf` on navy (buttons with an ink label, italics,
  eyebrows, rails, lamps, the diagram's lines); steel `#486786` on cream (buttons with a `#fbf8f1` label, italics,
  eyebrows, links; the app's AA cut of the book's `#4f6d8c`). No gold, green or teal anywhere. The class names
  that still say gold (`btn-gold`, `--line-gold`) are the shared system's.
- **The logo** is the client's OS roundel (`public/brand/`), in the header, the footer, the 404, the favicons and
  the share card.
- **Type from the InnerBoard OS brand book:** Fraunces Light (h1 300, every other display role 360, the lit lead
  phrases 460), Instrument Sans body at 400 and eyebrows at 600, never under 12 px. The app's own font files.
- **"InnerBoard IOS"**, never "iOS"; no em or en dashes anywhere (`npm run sweep`).
- **Real product, never a drawn mock.** Every screen is a capture of Practice. No camera move lands on the app's
  sample score, which no text, caption, alt or label ever quotes; no capture shows one of the app's availability notes.
  No camera or crop cuts a word at a screen's edge: a stitched capture rests where no line meets the app's header
  or the screen's foot, and three captures whose foot cuts a line fade to the app's ivory just above it (`index.astro`).
- **Nothing of Leah in imagery**; her name appears only on the book's author line, under the closing quote and in the
  footer's founder credit. The structured data names the organization only.

## App screenshots

Every screen was captured with Playwright from Practice, the app at practiceinnerboard.com, as a first time visitor
sees it in the light theme: phones at 390 x 844 and the desk at 1440 x 900, both at twice the pixels. The Company OS
Score is scored 8, 6, 7, 5, 8, 6, 7, 5, 6, 7 on the device and a Role Blueprint is filled in for one role (a
visitor's answers stay in the browser; nothing is submitted). The site serves them from `public/app/`: each phone
capture at 780 x 1688 with a 390 px variant for small 1x phones, each desk capture at 1600 x 1000 for 1x screens and
2880 x 1800 (`-2x`) for 2x screens. The result (`score-upstream-result` + `-2`) and the Curriculum (`os-curriculum` +
`-2`) are two captures each, stitched under the app's header (PhoneFrame `strip`).

To recapture (both scripts are run by hand; `astro build` never runs them):

```bash
npm i --no-save playwright && npx playwright install chromium   # or set CHROME=/path/to/chrome
npm run capture -- /tmp/ios-captures     # raw PNGs from the live app; reports any availability note in view
npm run encode -- /tmp/ios-captures      # writes public/app (phone .webp and -390, desk .webp and -2x)
```

`encode` fades the desk Get Certified frame to the app's ivory above its cards' availability notes, the one edit
made to any capture. The Company OS Score screens were captured from the live app with these scripts on October 21,
2026 (the result reads "Scored Oct 21, 2026"), with the app's frosted header rendered as a browser draws it; the
Role Blueprint, Curriculum, Get Certified and Assessments files match what the scripts take from the live app that day
within encoding noise. The Track (Develop's screen) was captured on October 20, 2026; the live app has since folded
it into The Book (`/track` opens `/book`), so `capture` skips it and the shipped `track-home` files stay.
`scripts/desk2x.mjs` and `scripts/small.mjs` (`npm run desk2x`, `npm run small`) are the earlier single purpose
tools: the `-2x` desk files from raw 2880 captures, and the 390 px phone variants from the shipped files.

## Analytics and links

Every call to action carries `data-event` (`assessment_click`, `consultation_click`, `book_click`,
`partner_inquiry_click`) and `data-event-location`; `track()` pushes them to `dataLayer`, `gtag` or `plausible` when
one is on the page (add the tag to `src/layouts/Base.astro` once the account exists). Every Company OS Score link
carries `data-passthrough`: the page's `utm_*` and `from` parameters travel with it into the app.

## What still needs the client

- **The Replaceable cover** is the published cover (ISBN 0998174475, 1000 x 1499, from the book's retail listing) at
  `public/images/replaceable-cover.jpg` and `.webp`. Swap in the print file if the client wants it sharper.
- **The founder's title under the closing quote** reads "Founder, InnerBoard" until confirmed (`SITE.founderTitle` in
  `src/config/links.ts`).
- **The booking and partner destinations.** Talk to Our Team, Let's Talk About Your Organization and Explore a
  Partnership open an email to info@innerboardsuite.com for now (`LINKS.talk`, `LINKS.partner`). Buy the Book opens
  the book inside Practice (`LINKS.book`); the live app's own Buy the book now links to `https://a.co/d/0eoti7Jg`,
  which the client can confirm as the purchase URL. The Company OS Score's results flow and any email capture are
  the app's (`LINKS.score`).
- **The hero's result screen shows the app's sample score** (65 out of 100) for a moment as it comes in, before it
  scrolls to the reading and the three lowest (the phone in How it works does the same; the window there goes from
  the scored statements straight to the reading). The app's own bar on the scored screens also reads "See what 65
  means". Confirm the client is happy for the sample score to appear in the captures.
- **Develop's screen.** The Track (How it works, step 2) is no longer in the live app (see above); keep it, or capture
  another screen for that step.
- Counsel review of `/privacy` and `/terms`; the analytics account.

## Deploy

The site deploys on Vercel (today at https://innerboardos.vercel.app/), which builds the repository with the Astro
preset (`npm run build`, output `dist/`). `vercel.json` sets clean URLs without trailing slashes, cache headers for
`/fonts`, `/app`, `/images` and `/_astro`, and the security headers, and adds no rewrite, so a missing path gets
`dist/404.html` with a 404 status. To launch, attach innerboardos.com in the Vercel project's Domains settings and
point the domain's DNS at Vercel; the canonical URLs, the sitemap, `robots.txt` and the share card's URL already
name https://innerboardos.com. Before a release: `npm run build && npm run sweep`, then check the deployment at 390
and 1440 wide, and that a made up path shows the not found page.
