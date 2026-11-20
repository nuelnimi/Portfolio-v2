/**
 * Runs after `react-scripts build`. Create React App ships one empty index.html,
 * so every URL would show the homepage's tags to crawlers and link previews.
 * This writes build/<route>/index.html for every route with that page's own
 * title, description, canonical, Open Graph / Twitter tags, JSON-LD and a block
 * of real text content, then generates sitemap.xml and robots.txt.
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const build = path.join(root, "build");

const load = (file) => {
  const src = fs.readFileSync(path.join(root, file), "utf8");
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
  }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", out)(require, mod, mod.exports);
  return mod.exports;
};

const site = load("src/seo/site.ts");
const { projects } = load("src/data/projects.ts");
const allProjects = projects.flatMap((c) => c.projects);

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const template = fs.readFileSync(path.join(build, "index.html"), "utf8");

// strip the homepage-specific tags from the template; we re-add them per route
const stripped = template
  .replace(/<title>[\s\S]*?<\/title>/i, "")
  .replace(/<meta\s+name="description"[^>]*>/gi, "")
  .replace(/<meta\s+name="robots"[^>]*>/gi, "")
  .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
  .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "")
  .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "")
  .replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "");

const jsonLd = (obj, page) =>
  `<script type="application/ld+json"${page ? ' data-seo="page"' : ""}>${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const headFor = (route, project) => {
  const meta = site.metaFor(route, project);
  const url = site.absoluteUrl(route);
  const t = esc(meta.title);
  const d = esc(meta.description);
  const img = esc(meta.image);
  const tags = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(site.SITE_NAME)}">`,
    `<meta property="og:locale" content="en_NG">`,
    `<meta property="og:title" content="${t}">`,
    `<meta property="og:description" content="${d}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:alt" content="${esc(project ? project.name + " by Emmanuel Oluwaferanmi Oladele" : "Emmanuel Oluwaferanmi Oladele, software and AI/ML engineer")}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${t}">`,
    `<meta name="twitter:description" content="${d}">`,
    `<meta name="twitter:image" content="${img}">`,
  ];
  if (!project) {
    tags.splice(
      11,
      0,
      `<meta property="og:image:width" content="${site.OG_IMAGE_WIDTH}">`,
      `<meta property="og:image:height" content="${site.OG_IMAGE_HEIGHT}">`
    );
  }
  // site-wide identity on every page, page-specific schema on top
  tags.push(jsonLd(site.personSchema), jsonLd(site.websiteSchema));
  site.schemasFor(route, project, allProjects).forEach((s) => tags.push(jsonLd(s, true)));
  return tags.join("");
};

const nav = `<nav aria-label="Main"><a href="/">Home</a> <a href="/about">About</a> <a href="/portfolio">Projects</a> <a href="/contact">Contact</a></nav>`;

const projectList = () =>
  `<ul>${allProjects
    .map(
      (p) =>
        `<li><a href="${site.projectPath(p)}">${esc(p.name)}</a>: ${esc(site.clip(p.desc, 140))}</li>`
    )
    .join("")}</ul>`;

// real text for crawlers; visually hidden (React replaces #root on load)
const bodyFor = (route, project) => {
  let inner;
  if (project) {
    inner = `<h1>${esc(project.name)}</h1><p>${esc(project.desc)}</p>${
      project.tools ? `<p>Tools: ${esc(project.tools.join(", "))}</p>` : ""
    }${project.role ? `<p>Role: ${esc(project.role)}</p>` : ""}<p><a href="/portfolio">All projects by Emmanuel Oluwaferanmi Oladele</a></p>`;
  } else if (route === "/") {
    inner = `<h1>Emmanuel Oluwaferanmi Oladele</h1><p>${esc(site.pageMeta["/"].description)}</p><h2>Selected projects</h2>${projectList()}`;
  } else if (route === "/about") {
    inner = `<h1>About Emmanuel Oluwaferanmi Oladele</h1><p>${esc(site.pageMeta["/about"].description)}</p><p>Also known as Oladele Emmanuel and Mannycodes. Software and AI/ML engineer. B.Sc. Computer Science, Federal University of Agriculture, Abeokuta. Currently at Hypa Intelligence.</p><p>Winner of the ZAP Africa Hackathon, Xerberus MCP Buildathon and OpenBuild AI3 Growth Hackathon Track 1; third place at the Vara Network and Wheelhouse hackathons.</p><p>Find me on <a href="${site.PROFILES[0]}">GitHub</a> and <a href="${site.PROFILES[1]}">LinkedIn</a>.</p>`;
  } else if (route === "/portfolio") {
    inner = `<h1>Projects by Emmanuel Oluwaferanmi Oladele</h1><p>${esc(site.pageMeta["/portfolio"].description)}</p>${projectList()}`;
  } else {
    inner = `<h1>Contact Emmanuel Oluwaferanmi Oladele</h1><p>${esc(site.pageMeta["/contact"].description)}</p><p><a href="${site.PROFILES[1]}">LinkedIn</a> · <a href="${site.PROFILES[0]}">GitHub</a></p>`;
  }
  return `<div class="seo-static" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">${nav}<main>${inner}</main></div>`;
};

const render = (route, project) => {
  let html = stripped.replace("</head>", `${headFor(route, project)}</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyFor(route, project)}</div>`);
  if (html === stripped) throw new Error(`failed to render ${route}`);
  return html;
};

const write = (route, html) => {
  const dir = route === "/" ? build : path.join(build, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
};

const routes = [
  ...Object.keys(site.pageMeta).map((r) => ({ route: r })),
  ...allProjects.map((p) => ({ route: site.projectPath(p), project: p })),
];
routes.forEach(({ route, project }) => write(route, render(route, project)));

// sitemap
const today = new Date().toISOString().slice(0, 10);
const prio = (r) => (r === "/" ? "1.0" : r === "/about" || r === "/portfolio" ? "0.9" : r === "/contact" ? "0.6" : "0.7");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes
  .map(({ route, project }) => {
    const img = project && project.image
      ? `\n    <image:image><image:loc>${esc(site.projectImage(project))}</image:loc><image:title>${esc(project.name)}</image:title></image:image>`
      : "";
    return `  <url>
    <loc>${site.absoluteUrl(route)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${prio(route)}</priority>${img}
  </url>`;
  })
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(build, "sitemap.xml"), sitemap);
fs.writeFileSync(
  path.join(build, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.SITE_URL}/sitemap.xml\n`
);

console.log(`SEO: prerendered ${routes.length} routes, sitemap + robots written.`);
