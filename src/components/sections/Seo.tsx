import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { projects } from "../../data/projects";
import {
  absoluteUrl,
  metaFor,
  normalizePath,
  schemasFor,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from "../../seo/site";

const upsert = (
  tag: "meta" | "link",
  attr: string,
  key: string,
  valueAttr: string,
  value: string
) => {
  let el = document.head.querySelector(`${tag}[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute(valueAttr, value);
};

const allProjects = projects.flatMap((category) => category.projects);

/** Keeps head tags + structured data in sync with the current route. */
const Seo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = normalizePath(pathname);
    const id = path.match(/^\/portfolio\/(\d+)$/)?.[1];
    const project = id
      ? allProjects.find((item) => item.id === Number(id))
      : undefined;
    const meta = metaFor(path, project);
    const known = meta.known;
    const url = absoluteUrl(path);

    document.title = meta.title;
    upsert("meta", "name", "description", "content", meta.description);
    upsert(
      "meta",
      "name",
      "robots",
      "content",
      known
        ? "index, follow, max-image-preview:large"
        : "noindex, nofollow"
    );
    upsert("link", "rel", "canonical", "href", url);

    upsert("meta", "property", "og:type", "content", "website");
    upsert("meta", "property", "og:site_name", "content", SITE_NAME);
    upsert("meta", "property", "og:title", "content", meta.title);
    upsert("meta", "property", "og:description", "content", meta.description);
    upsert("meta", "property", "og:url", "content", url);
    upsert("meta", "property", "og:image", "content", meta.image);
    upsert("meta", "name", "twitter:card", "content", "summary_large_image");
    upsert("meta", "name", "twitter:title", "content", meta.title);
    upsert("meta", "name", "twitter:description", "content", meta.description);
    upsert("meta", "name", "twitter:image", "content", meta.image);
    if (!project) {
      upsert("meta", "property", "og:image:width", "content", String(OG_IMAGE_WIDTH));
      upsert("meta", "property", "og:image:height", "content", String(OG_IMAGE_HEIGHT));
    }

    // replace this page's JSON-LD (keep the site-wide Person/WebSite in the static head)
    document.head
      .querySelectorAll('script[data-seo="page"]')
      .forEach((n) => n.remove());
    schemasFor(path, project, allProjects).forEach((schema) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.seo = "page";
      s.text = JSON.stringify(schema);
      document.head.appendChild(s);
    });
  }, [pathname]);

  return null;
};

export default Seo;
