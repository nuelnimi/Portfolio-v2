/**
 * Single source of truth for SEO. Imported by the runtime <Seo/> component and
 * by scripts/seo-postbuild.js (which prerenders per-route HTML), so keep this
 * file dependency-free.
 */

export const SITE_URL = "https://mannycodes.vercel.app";
export const SITE_NAME = "Emmanuel Oluwaferanmi Oladele Portfolio";
export const PERSON_NAME = "Emmanuel Oluwaferanmi Oladele";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const OG_IMAGE = `${SITE_URL}/images/oladele-emmanuel-social.png`;
export const OG_IMAGE_WIDTH = 1733;
export const OG_IMAGE_HEIGHT = 908;
export const PROFILE_IMAGE = `${SITE_URL}/images/oladele-emmanuel-profile.png`;

export const PROFILES = [
  "https://github.com/mannycodes-j",
  "https://www.linkedin.com/in/mannycodes-j/",
];

export type PageMeta = { title: string; description: string };

export const pageMeta: Record<string, PageMeta> = {
  "/": {
    title: "Emmanuel Oluwaferanmi Oladele | Software & AI/ML Engineer",
    description:
      "Emmanuel Oluwaferanmi Oladele (Oladele Emmanuel, Mannycodes) is a software and AI/ML engineer building web, mobile, multilingual AI and Web3 products.",
  },
  "/about": {
    title: "About Emmanuel Oluwaferanmi Oladele | AI/ML Engineer",
    description:
      "Emmanuel Oluwaferanmi Oladele (Oladele Emmanuel): AI/ML engineer at Hypa Intelligence with React, React Native, AI and Web3 experience and several hackathon wins.",
  },
  "/portfolio": {
    title: "Projects | Emmanuel Oluwaferanmi Oladele",
    description:
      "Projects by Emmanuel Oluwaferanmi Oladele: AI platforms, mobile and web apps, VR and Web3 products, including Hypa Intelligence, Verith and Vectra.",
  },
  "/contact": {
    title: "Contact Emmanuel Oluwaferanmi Oladele | Software Engineer",
    description:
      "Contact Emmanuel Oluwaferanmi Oladele (Oladele Emmanuel) for software engineering, frontend, mobile, AI/ML, Web3 integration and product collaboration.",
  },
};

export const normalizePath = (pathname: string): string => {
  const p = pathname.replace(/\/+$/, "");
  return p === "" ? "/" : p;
};

export const absoluteUrl = (path: string): string =>
  path === "/" ? SITE_URL : `${SITE_URL}${path}`;

/** Trim to a search-snippet length on a word boundary. */
export const clip = (text: string, max = 155): string => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\-–]$/, "") + "…";
};

type ProjectLike = {
  id: number;
  name: string;
  desc: string;
  image?: string;
  year?: string;
  role?: string;
  tools?: string[];
  confidential?: boolean;
  links?: { live?: string };
};

export const projectPath = (p: { id: number }) => `/portfolio/${p.id}`;

export const projectImage = (p: ProjectLike): string =>
  p.image ? `${SITE_URL}/images/projects/${p.image}` : OG_IMAGE;

export const metaFor = (
  path: string,
  project?: ProjectLike
): PageMeta & { image: string; known: boolean } => {
  if (project) {
    return {
      title: `${project.name} | Emmanuel Oluwaferanmi Oladele`,
      description: clip(
        `${project.name} by Emmanuel Oluwaferanmi Oladele${
          project.role ? ` (${project.role})` : ""
        }. ${project.desc}`
      ),
      image: projectImage(project),
      known: true,
    };
  }
  const page = pageMeta[path];
  return {
    ...(page || pageMeta["/"]),
    image: OG_IMAGE,
    known: !!page,
  };
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON_NAME,
  givenName: "Emmanuel",
  additionalName: "Oluwaferanmi",
  familyName: "Oladele",
  alternateName: [
    "Oladele Emmanuel",
    "Emmanuel Oladele",
    "Emmanuel Oluwaferanmi",
    "Oladele Emmanuel Oluwaferanmi",
    "Mannycodes",
    "mannycodes-j",
  ],
  url: SITE_URL,
  image: PROFILE_IMAGE,
  description:
    "Software and AI/ML engineer building accessible web, mobile, desktop, multilingual AI and Web3 products.",
  jobTitle: "Software and AI/ML Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Hypa Intelligence",
    url: "https://hypaintelligence.com/",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Federal University of Agriculture, Abeokuta",
  },
  sameAs: PROFILES,
  knowsAbout: [
    "Software Engineering",
    "Artificial Intelligence",
    "Machine Learning",
    "Large Language Models",
    "Multilingual AI",
    "React",
    "Next.js",
    "React Native",
    "TypeScript",
    "Web3",
    "Blockchain Integration",
    "DeFi",
  ],
  award: [
    "Winner, ZAP Africa Hackathon",
    "Winner, Xerberus MCP Buildathon",
    "Track 1 Winner, OpenBuild AI3 Growth Hackathon",
    "3rd Place (DeFi), Vara Network Hackathon",
    "3rd Place and People's Choice, Wheelhouse Hackathon",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
};

const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

/** Page-specific structured data (the Person/WebSite live in the static head). */
export const schemasFor = (
  path: string,
  project?: ProjectLike,
  allProjects: ProjectLike[] = []
): object[] => {
  const url = absoluteUrl(path);
  const home = { name: "Home", path: "/" };

  if (project) {
    const creative: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${url}#project`,
      name: project.name,
      description: clip(project.desc, 300),
      url,
      image: projectImage(project),
      author: { "@id": PERSON_ID },
      creator: { "@id": PERSON_ID },
      inLanguage: "en",
    };
    if (project.year) creative.datePublished = project.year;
    if (project.tools && project.tools.length)
      creative.keywords = project.tools.join(", ");
    if (!project.confidential && project.links && project.links.live)
      creative.sameAs = [project.links.live];
    return [
      creative,
      breadcrumb([
        home,
        { name: "Projects", path: "/portfolio" },
        { name: project.name, path },
      ]),
    ];
  }

  if (path === "/") return [];

  if (path === "/about")
    return [
      {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        url,
        name: pageMeta["/about"].title,
        mainEntity: { "@id": PERSON_ID },
      },
      breadcrumb([home, { name: "About", path }]),
    ];

  if (path === "/portfolio")
    return [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        url,
        name: pageMeta["/portfolio"].title,
        about: { "@id": PERSON_ID },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: allProjects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            url: absoluteUrl(projectPath(p)),
          })),
        },
      },
      breadcrumb([home, { name: "Projects", path }]),
    ];

  if (path === "/contact")
    return [
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url,
        name: pageMeta["/contact"].title,
        about: { "@id": PERSON_ID },
      },
      breadcrumb([home, { name: "Contact", path }]),
    ];

  return [];
};
