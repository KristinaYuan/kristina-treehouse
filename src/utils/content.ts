// Content utilities — section metadata, content loading, sorting.

export interface SectionMeta {
  slug: string;
  label: string;
  description: string;
}

/** All 8 sections. First letters spell K-R-I-S-T-I-N-A. */
export const SECTIONS: SectionMeta[] = [
  { slug: 'knowledge', label: 'Knowledge', description: 'Structured learning and notes.' },
  { slug: 'reading',   label: 'Reading',   description: 'Books, papers, films, and reviews.' },
  { slug: 'ideas',     label: 'Ideas',     description: 'Projects, experiments, and concepts.' },
  { slug: 'stories',   label: 'Stories',   description: 'Creative writing and dream journals.' },
  { slug: 'thoughts',  label: 'Thoughts',  description: 'Reflections on life and philosophy.' },
  { slug: 'interlude', label: 'Interlude', description: 'Small moments between stories.' },
  { slug: 'notes',     label: 'Notes',     description: 'Development logs and work journals.' },
  { slug: 'archive',   label: 'Archive',   description: 'Everything, organized by time.' },
];

const SECTION_SLUGS = SECTIONS.map((s) => s.slug);
export const VALID_SECTIONS = new Set(SECTION_SLUGS);

export function getSectionMeta(slug: string): SectionMeta | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}

export interface ArticleFrontmatter {
  title: string;
  date: string;
  updated?: string;
  tags?: string[];
  description?: string;
}

export interface Article {
  slug: string;
  section: string;
  frontmatter: ArticleFrontmatter;
  /** The rendered Astro component for the markdown body. */
  Content: ReturnType<typeof import('*.md')>['default'];
}

// Load all markdown files from all sections.
// Glob paths are relative to the project root.
const mdModules = import.meta.glob<{
  frontmatter: ArticleFrontmatter;
  default: ReturnType<typeof import('*.md')>['default'];
}>('/content/**/*.md', { eager: true });

/** All articles loaded from /content/, parsed and sorted by date (newest first). */
export function getAllArticles(): Article[] {
  const articles: Article[] = [];

  for (const [path, mod] of Object.entries(mdModules)) {
    // Path format: /content/<section>/<slug>.md
    const match = path.match(/^\/content\/([^/]+)\/([^/]+)\.md$/);
    if (!match) continue;

    const section = match[1];
    const slug = match[2];

    if (!VALID_SECTIONS.has(section)) continue;

    articles.push({
      slug,
      section,
      frontmatter: mod.frontmatter,
      Content: mod.default,
    });
  }

  articles.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return articles;
}

/** Get articles for a specific section, sorted by date (newest first). */
export function getSectionArticles(section: string): Article[] {
  return getAllArticles().filter((a) => a.section === section);
}

/** Get a single article by section + slug. */
export function getArticle(section: string, slug: string): Article | undefined {
  return getAllArticles().find((a) => a.section === section && a.slug === slug);
}

/** Archive structure: year → month → articles */
export interface ArchiveMonth {
  month: number;
  monthName: string;
  articles: Article[];
}

export interface ArchiveYear {
  year: number;
  months: ArchiveMonth[];
}

export function getArchive(): ArchiveYear[] {
  const articles = getAllArticles();
  const yearMap = new Map<number, Map<number, Article[]>>();

  for (const article of articles) {
    const d = new Date(article.frontmatter.date);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-indexed

    if (!yearMap.has(year)) yearMap.set(year, new Map());
    const monthMap = yearMap.get(year)!;
    if (!monthMap.has(month)) monthMap.set(month, []);
    monthMap.get(month)!.push(article);
  }

  const result: ArchiveYear[] = [];
  const sortedYears = [...yearMap.keys()].sort((a, b) => b - a);

  for (const year of sortedYears) {
    const monthMap = yearMap.get(year)!;
    const sortedMonths = [...monthMap.keys()].sort((a, b) => b - a);

    const months: ArchiveMonth[] = sortedMonths.map((m) => ({
      month: m,
      monthName: new Date(year, m).toLocaleDateString('en-US', {
        month: 'long',
      }),
      articles: monthMap.get(m)!,
    }));

    result.push({ year, months });
  }

  return result;
}

/** Format a date string to a readable format, e.g. "July 3, 2026" */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
