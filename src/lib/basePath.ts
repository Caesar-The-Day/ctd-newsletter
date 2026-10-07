// Built files (scripts, images, data) always live under the Vite base "/regions/".
// Page addresses depend on the host: italy.caesartheday.com serves pages at the
// root (/liguria); www.caesartheday.com proxies them under /regions/liguria.
// Content refers to public files as "/images/<file>"; this shim prefixes only
// file paths (never page links) with the asset base.
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // asset base, "/regions"

const onBasePath = typeof window !== 'undefined' && BASE &&
  (window.location.pathname === BASE || window.location.pathname.startsWith(BASE + '/'));
const isLocalDev = typeof window !== 'undefined' && import.meta.env.DEV;
// Router basename: "/regions" when the visitor is under it (or in local dev), otherwise "".
export const ROUTER_BASE = onBasePath || isLocalDev ? BASE : '';

const ASSET_RE = /^\/(images|data|newsletters|assets|audio|videos)\/|^\/[^?#]*\.[a-z0-9]{2,5}(?:[?#]|$)/i;

export function withBase(url: string): string {
  if (!BASE || typeof url !== 'string') return url;
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  if (url === BASE || url.startsWith(BASE + '/') || url.startsWith('/@') || url.startsWith('/node_modules/') || url.startsWith('/src/') || url.startsWith('/api/')) return url;
  if (!ASSET_RE.test(url)) return url;
  return BASE + url;
}

const fixCssUrls = (v: string) =>
  typeof v === 'string' ? v.replace(/url\((['"]?)(\/[^'")]+)\1\)/g, (_m, q, p) => `url(${q}${withBase(p)}${q})`) : v;

if (BASE && typeof window !== 'undefined') {
  // Local dev only: the dev server serves pages under the base, so move bare paths there.
  if (isLocalDev && !onBasePath) {
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
  // Inline background images set through style objects bypass setAttribute;
  // watch style changes and rewrite their url(...) paths.
  const fixEl = (el: Element) => {
    const st = (el as HTMLElement).style;
    const bg = st && st.backgroundImage;
    if (bg && bg.includes('url(')) {
      const fixed = fixCssUrls(bg.replace(/url\("([^"]+)"\)/g, 'url($1)'));
      if (fixed !== bg.replace(/url\("([^"]+)"\)/g, 'url($1)')) st.backgroundImage = fixed;
    }
  };
  new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'attributes') fixEl(m.target as Element);
      else m.addedNodes.forEach(n => {
        if (n.nodeType !== 1) return;
        fixEl(n as Element);
        (n as Element).querySelectorAll('[style]').forEach(fixEl);
      });
    }
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['style'] });
  const origSetProp = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function (p: string, v: string | null, pr?: string) {
    return origSetProp.call(this, p, v == null ? v : fixCssUrls(v), pr);
  };
}
