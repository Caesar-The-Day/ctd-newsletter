export interface ExportableRecipe {
  id: string;
  title: string;
  image?: string;
  story?: string;
  ingredients?: string[];
  steps?: string[];
  servingSuggestion?: string;
  winePairing?: string;
  links?: Array<{ label: string; href: string }>;
}

export function recipeAnchorId(recipe: ExportableRecipe): string {
  return `recipe-${recipe.id}`;
}

export function recipeUrl(recipe: ExportableRecipe): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}#${recipeAnchorId(recipe)}`;
}

function absoluteImage(image?: string): string | undefined {
  if (!image) return undefined;
  if (/^https?:\/\//i.test(image)) return image;
  if (typeof window === 'undefined') return image;
  return `${window.location.origin}${image.startsWith('/') ? '' : '/'}${image}`;
}

/** schema.org/Recipe — the shape recipe managers (Paprika, Mela, AnyList, Copy Me That) import. */
export function toSchemaRecipe(recipe: ExportableRecipe, regionName?: string) {
  const description = [recipe.story, recipe.servingSuggestion].filter(Boolean).join(' ');

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    ...(description ? { description } : {}),
    ...(absoluteImage(recipe.image) ? { image: [absoluteImage(recipe.image)] } : {}),
    ...(regionName
      ? { recipeCuisine: `Italian — ${regionName}`, keywords: `${regionName}, Italian, regional` }
      : { recipeCuisine: 'Italian' }),
    author: { '@type': 'Organization', name: 'CaesarTheDay' },
    ...(recipe.ingredients?.length ? { recipeIngredient: recipe.ingredients } : {}),
    ...(recipe.steps?.length
      ? {
          recipeInstructions: recipe.steps.map((text, idx) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            text,
          })),
        }
      : {}),
    ...(recipe.winePairing ? { suitableForDiet: undefined, recipeCategory: 'Main', comment: undefined } : {}),
    ...(recipe.winePairing ? { about: `Wine pairing: ${recipe.winePairing}` } : {}),
    ...(recipeUrl(recipe) ? { url: recipeUrl(recipe) } : {}),
  };
}

export function toPlainText(recipe: ExportableRecipe, regionName?: string): string {
  const lines: string[] = [];
  lines.push(recipe.title.toUpperCase());
  if (regionName) lines.push(`${regionName}, Italy — via CaesarTheDay`);
  lines.push('');
  if (recipe.story) lines.push(recipe.story, '');
  if (recipe.ingredients?.length) {
    lines.push('INGREDIENTS');
    recipe.ingredients.forEach((i) => lines.push(`- ${i}`));
    lines.push('');
  }
  if (recipe.steps?.length) {
    lines.push('INSTRUCTIONS');
    recipe.steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push('');
  }
  if (recipe.servingSuggestion) lines.push('SERVING', recipe.servingSuggestion, '');
  if (recipe.winePairing) lines.push('WINE PAIRING', recipe.winePairing, '');
  if (recipe.links?.length) {
    lines.push('SOURCES');
    recipe.links.forEach((l) => lines.push(`- ${l.label}: ${l.href}`));
    lines.push('');
  }
  const url = recipeUrl(recipe);
  if (url) lines.push(url);
  return lines.join('\n');
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function downloadFile(filename: string, contents: string, mimeType: string) {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadRecipeJson(recipe: ExportableRecipe, regionName?: string) {
  downloadFile(
    `${slugify(recipe.title)}.json`,
    JSON.stringify(toSchemaRecipe(recipe, regionName), null, 2),
    'application/ld+json',
  );
}

export function downloadRecipeText(recipe: ExportableRecipe, regionName?: string) {
  downloadFile(`${slugify(recipe.title)}.txt`, toPlainText(recipe, regionName), 'text/plain');
}

export interface ShareTarget {
  label: string;
  href: string;
}

export function shareTargets(recipe: ExportableRecipe, regionName?: string): ShareTarget[] {
  const url = recipeUrl(recipe);
  const text = `${recipe.title}${regionName ? ` — a ${regionName} recipe` : ''}`;
  const e = encodeURIComponent;
  return [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${e(url)}&text=${e(text)}` },
    { label: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${e(`${text} ${url}`)}` },
    {
      label: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${e(url)}&media=${e(
        absoluteImage(recipe.image) || '',
      )}&description=${e(text)}`,
    },
    { label: 'Email', href: `mailto:?subject=${e(text)}&body=${e(`${text}\n\n${url}`)}` },
  ];
}
