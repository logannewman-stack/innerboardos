/**
 * Every destination on the site, in one place.
 *
 * The build tracker's "Links to Confirm" tab lists the ones still pending.
 * Each pending entry below carries the best real destination available
 * today so no button on the site goes nowhere; swap the value when the final
 * URL is approved. Nothing else on the site hard-codes a destination.
 */
export const APP = "https://practiceinnerboard.com";

export const LINKS = {
  /** Get Your Company OS Score: the existing assessment in Practice. Pending: confirm results flow and email capture. */
  score: `${APP}/book/upstream?from=os`,
  /** Talk to Our Team / Let's Talk About Your Organization. Pending: booking or contact URL. */
  talk: "mailto:info@innerboardsuite.com?subject=InnerBoard%20IOS%3A%20a%20conversation%20about%20our%20organization",
  /** Buy the Book. Pending: the Replaceable purchase URL. Interim: the book inside Practice. */
  book: `${APP}/book?from=os`,
  /** Explore a Partnership. Pending: partner inquiry destination. */
  partner: "mailto:info@innerboardsuite.com?subject=InnerBoard%20IOS%20partnership%20inquiry",
  /** The app itself, with where they came from. */
  app: `${APP}/?from=os`,
  suite: "https://innerboardsuite.com",
  academy: "https://innerboardsuite.com/academy",
  inq: "https://innerboardsuite.com/inq-certification",
  practice: "https://innerboardsuite.com/practice",
  contactEmail: "info@innerboardsuite.com",
  privacy: "/privacy",
  terms: "/terms"
} as const;

export const SITE = {
  name: "InnerBoard IOS",
  url: "https://innerboardos.com",
  description:
    "InnerBoard IOS is the internal operating system for organizations: measure self-leadership across your company, install it one module at a time, and keep it running after the launch.",
  founder: "Leah Roling",
  /** The founder's title under the closing quote is still to be confirmed. */
  founderTitle: "Founder, InnerBoard"
} as const;
