export interface Project {
  slug: string;
  name: string;
  tagline: string;
  type: string;
  /** Where the real project stands, e.g. "In development" or "Live". */
  status: string;
  year: string;
  tags: string[];
  /** Brand color used for the project's hover preview and glow. */
  accent: string;
}

/**
 * Every project on the site, in display order. Adding one here puts it
 * on /projects automatically; give it a case-study page at
 * app/projects/<slug>/page.tsx. Only real, built work goes here.
 */
export const projects: Project[] = [
  {
    slug: "pocketbalance",
    name: "PocketBalance",
    tagline: "A real Android app that turns your bank's SMS messages into a balance you can trust.",
    type: "Android app",
    status: "In development",
    year: "2026",
    tags: ["React Native", "TypeScript", "SQLite"],
    accent: "#7C3AED",
  },
];

/**
 * Where "Work" leads. With a single project there's no index to show,
 * so links go straight to its page; add a second project and every
 * "Work" link (and /projects itself) switches to the index automatically.
 */
export const hasProjectIndex = projects.length > 1;
export const workHref = hasProjectIndex ? "/projects" : `/projects/${projects[0].slug}`;
