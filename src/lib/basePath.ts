// The app is served under a sub-path (Vite `base`, e.g. "/regions/").
// Content (JSON files, database rows, components) refers to public files as
// root-relative paths like "/images/x.jpg". This shim prefixes those paths
// with the base at the browser level so every image, video, fetch and link resolves.
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // "/regions" or ""

export function withBase(url: string): string {
  if (!BASE || typeof url !== 'string') return url;
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  if (url === BASE || url.startsWith(BASE + '/') || url.startsWith('/@') || url.startsWith('/node_modules/') || url.startsWith('/src/')) return url;
  return BASE + url;
}

const fixCssUrls = (v: string) =>
  typeof v === 'string' ? v.replace(/url\((['"]?)(\/[^'")]+)\1\)/g, (_m, q, p) => `url(${q}${withBase(p)}${q})`) : v;

if (BASE && typeof window !== 'undefined') {
  // If someone lands on a path without the base, move them under it.
  if (window.location.pathname !== BASE && !window.location.pathname.startsWith(BASE + '/')) {
    window.location.replace(BASE + window.location.pathname + window.location.search + window.location.hash);
  }

  const origFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) =>
    origFetch(typeof input === 'string' ? withBase(input) : input, init);

  const URL_ATTRS = new Set(['src', 'href', 'poster', 'data']);
  const origSetAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name: string, value: string) {
    const n = name.toLowerCase();
    if (URL_ATTRS.has(n)) value = withBase(String(value));
    else if (n === 'srcset') value = String(value).split(',').map(s => { const t = s.trim(); const [u, ...r] = t.split(/\s+/); return [withBase(u), ...r].join(' '); }).join(', ');
    else if (n === 'style') value = fixCssUrls(String(value));
    return origSetAttr.call(this, name, value);
  };

  const patchProp = (proto: any, prop: string, fn: (v: any) => any) => {
    const d = Object.getOwnPropertyDescriptor(proto, prop);
    if (!d || !d.set) return;
    Object.defineProperty(proto, prop, { ...d, set(v) { d.set!.call(this, fn(v)); } });
  };
  patchProp(HTMLImageElement.prototype, 'src', withBase);
  patchProp(HTMLMediaElement.prototype, 'src', withBase);
  patchProp(HTMLSourceElement.prototype, 'src', withBase);
  patchProp(HTMLAnchorElement.prototype, 'href', withBase);
  for (const p of ['backgroundImage', 'background']) {
    let proto: any = Object.getPrototypeOf(document.documentElement.style);
    while (proto && !Object.getOwnPropertyDescriptor(proto, p)) proto = Object.getPrototypeOf(proto);
    if (proto) patchProp(proto, p, fixCssUrls);
  }
  const origSetProp = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function (p: string, v: string | null, pr?: string) {
    return origSetProp.call(this, p, v == null ? v : fixCssUrls(v), pr);
  };
}
