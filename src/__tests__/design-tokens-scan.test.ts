/**
 * Every colour a component draws comes from the theme: a semantic token class
 * (`bg-primary`, `text-muted-foreground`, `border-border`) or a design-system
 * helper read at render time. This scans the source for the things that do
 * not follow a theme — Tailwind palette classes (`text-gray-600`,
 * `bg-white`), hex literals, `colors.raw`, classes assembled at run time
 * (`bg-${color}-500`, `.replace('bg-', 'text-')`, which a consuming app's
 * Tailwind scan never generates) and the `theme-*` aliases nothing defines.
 *
 * What is left is listed below with a reason per entry: brand marks, chrome
 * drawn over photographs and video, modal scrims, a QR code, and variants
 * literally named `white`. An entry that no longer matches anything fails, so
 * the list cannot outlive what it excuses.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = join(__dirname, '..');
// Folded-in vendored vertical modules are exempt from the core design-token
// discipline (they carry their own brand/gradient palettes).
const VENDORED_MODULES = new Set<string>([
  'agriculture',
  'analytics',
  'auth',
  'automotive',
  'collaboration',
  'communication',
  'construction',
  'design',
  'devops',
  'documents',
  'ecommerce',
  'education',
  'email',
  'energy',
  'entertainment',
  'entity',
  'events',
  'finance',
  'fitness',
  'food',
  'gaming',
  'government',
  'healthcare',
  'hr',
  'insurance',
  'interaction',
  'iot',
  'legal',
  'logistics',
  'manufacturing',
  'marketing',
  'media-components',
  'monitoring',
  'nonprofit',
  'project-management',
  'ratelimit',
  'realestate',
  'retail',
  'scheduling',
  'scientific',
  'search',
  'security',
  'social',
  'subscription',
  'travel',
  'visualization',
  'web3',
  'workflow',
]);

/** Whole files left out: not component markup. */
const SKIPPED_FILES: Record<string, string> = {
  'platforms/web.ts':
    'WebStyleGenerator: turns arbitrary design data into classes for callers',
  'lib/theme.ts': 'the theme helpers; its fallbacks are HSL triples by design',
};

const PALETTE =
  /(?<![\w-])(?:[a-z-]+:)*(?:bg|text|border(?:-[trblxy])?|ring|ring-offset|from|to|via|fill|stroke|divide|outline|placeholder|decoration|shadow|accent|caret|scrollbar-thumb|scrollbar-track)-(?:white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|gold)(?:-\d{2,3})?(?:\/\d+)?(?![\w-])/g;

const CHECKS: Array<[string, RegExp]> = [
  ['palette class', PALETTE],
  ['hex colour', /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?\b/g],
  ['colors.raw', /\bcolors\.raw\b/g],
  [
    'class assembled at run time',
    /\b(?:bg|text|border|from|to|via|ring)-\$\{/g,
  ],
  ['class rewritten at run time', /\.replace\(\s*['"](?:bg|text|border)-/g],
  ['undefined theme- alias', /\b(?:bg|text|border)-theme-[\w-]+/g],
];

/** Each entry excuses the matches of `match` in `file`. */
const ALLOWED: Array<{ file: string; match: RegExp; reason: string }> = [
  // Brand colours.
  {
    file: 'core/auth/login-view.tsx',
    match: /^#(4285F4|34A853|FBBC05|EA4335)$/,
    reason: "Google's G is drawn in Google's colours",
  },
  {
    file: 'core/Breadcrumb.tsx',
    match: /^text-(blue|orange|green|indigo)-\d+$/,
    reason: 'share-platform brand colours (Twitter, Facebook, LinkedIn, …)',
  },
  {
    file: 'forms/advanced/credit-card-input.tsx',
    match: /^#[0-9A-F]{6}$/,
    reason: 'card-network brand marks',
  },
  // Colour data, not chrome.
  {
    file: 'forms/advanced/color-picker.tsx',
    match: /^#[0-9A-F]{6}$/i,
    reason: 'colour presets offered to the user',
  },
  {
    file: 'forms/advanced/color-picker-advanced.tsx',
    match: /^#[0-9a-f]{6}$/i,
    reason: 'colour presets offered to the user',
  },
  {
    file: 'media/qr-code-display.tsx',
    match: /^colors\.raw$/,
    reason: 'a QR code must stay dark-on-light to scan, whatever the theme',
  },
  // Chrome over photographs, video and arbitrary colours.
  {
    file: 'media/lightbox.tsx',
    match: /^(hover:)?(bg|text|border)-(black|white)(\/\d+)?$/,
    reason: 'viewer chrome over a photograph',
  },
  {
    file: 'media/image-gallery.tsx',
    match: /^(hover:)?(bg|text)-(black|white)(\/\d+)?$/,
    reason: 'gallery chrome over a photograph',
  },
  {
    file: 'media/video-player.tsx',
    match: /^(hover:)?(bg|text|from|to|via|accent)-(black|white)(\/\d+)?$/,
    reason: 'player controls over video',
  },
  {
    file: 'media/media-uploader.tsx',
    match: /^(bg|text)-(black|white)(\/\d+)?$/,
    reason: 'caption over an image thumbnail',
  },
  {
    file: 'forms/advanced/color-swatch.tsx',
    match: /^(bg|text)-(black|white)(\/\d+)?$/,
    reason: 'tick drawn over a swatch of any colour',
  },
  {
    file: 'ui/section-badge.tsx',
    match: /^(bg|border|text)-white(\/\d+)?$/,
    reason: "the 'light' variant, for a photographic or coloured backdrop",
  },
  {
    file: 'ui/gradient-icon-container.tsx',
    match: /^text-white$/,
    reason: "a caller's own gradient: its colours are unknown",
  },
  // Modal scrims.
  {
    file: 'ui/overlay.tsx',
    match: /^(dark:)?bg-black\/\d+$/,
    reason: 'modal scrim',
  },
  {
    file: 'ui/backdrop.tsx',
    match: /^(dark:)?bg-black\/\d+$/,
    reason: 'modal scrim',
  },
  { file: 'ui/sheet-selector.tsx', match: /^bg-black\/50$/, reason: 'scrim' },
  { file: 'ui/form-modal.tsx', match: /^bg-black\/50$/, reason: 'scrim' },
  // Variants literally named `white`, kept for compatibility: for use over
  // imagery or a dark fill, where the caller asked for white by name.
  {
    file: 'ui/spinner.tsx',
    match: /^border(-t)?-white(\/\d+)?$/,
    reason: "the 'white' variant",
  },
  {
    file: 'ui/loading-dots.tsx',
    match: /^bg-white$/,
    reason: "the 'white' variant",
  },
  {
    file: 'data-display/stat-display.tsx',
    match: /^text-white(\/\d+)?$/,
    reason: "the 'white' variant",
  },
];

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (
        name !== '__tests__' &&
        name !== 'test' &&
        !VENDORED_MODULES.has(relative(SRC, path))
      )
        sourceFiles(path, out);
    } else if (
      /\.tsx?$/.test(name) &&
      !/\.(test|spec|example)\.tsx?$/.test(name) &&
      !name.endsWith('.d.ts')
    ) {
      out.push(path);
    }
  }
  return out;
}

/** Comments hold usage examples (`color="#10b981"`); only code counts. */
function withoutComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, block => block.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
}

describe('component colours come from the design system', () => {
  const files = sourceFiles(SRC)
    .map(path => relative(SRC, path).split('\\').join('/'))
    .filter(file => !(file in SKIPPED_FILES));
  const used = new Set<number>();
  const violations: string[] = [];

  for (const file of files) {
    const code = withoutComments(readFileSync(join(SRC, file), 'utf8'));
    for (const [what, pattern] of CHECKS) {
      for (const match of code.matchAll(pattern)) {
        const text = match[0];
        const index = ALLOWED.findIndex(
          entry => entry.file === file && entry.match.test(text)
        );
        if (index >= 0) {
          used.add(index);
          continue;
        }
        const line = code.slice(0, match.index).split('\n').length;
        violations.push(`${file}:${line}  ${what}: ${text}`);
      }
    }
  }

  it('uses no palette classes, hex, colors.raw or assembled classes', () => {
    expect(violations).toEqual([]);
  });

  it('has no stale allow-list entries', () => {
    const stale = ALLOWED.filter((_, i) => !used.has(i)).map(
      entry => `${entry.file} ${entry.match} (${entry.reason})`
    );
    expect(stale).toEqual([]);
  });
});
