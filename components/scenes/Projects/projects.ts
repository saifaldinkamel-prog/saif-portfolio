export interface Project {
  slug: string;
  name: string;
  tagline: string;
  type: string;
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
    tagline: "Bank SMS messages, turned into a balance you can trust.",
    type: "Mobile app",
    year: "2026",
    tags: ["React Native", "TypeScript", "SQLite"],
    accent: "#7C3AED",
  },
];
