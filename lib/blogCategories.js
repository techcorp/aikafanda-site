/**
 * Blogger labels are per-post SEO keywords (almost every one is unique), so
 * they make poor categories. Instead each post is bucketed by keyword rules
 * run against its title. First matching rule wins; order matters.
 */
export const BLOG_CATEGORIES = [
  {
    slug: 'build',
    name: 'Build with AI',
    test: /\bbuild\b|from scratch|coding assistant|copilot|agents? vs|ai agent/,
  },
  {
    slug: 'creative',
    name: 'Creative AI',
    test: /\bart\b|image generator|image creator|video edit|voice|text to speech|\bmusic\b|song|photograph|presentation/,
  },
  {
    slug: 'business',
    name: 'Business & Marketing',
    test: /marketing|\bseo\b|business|side hustle|social media|customer service|make money|personal finance|budget/,
  },
  {
    slug: 'learn',
    name: 'Learn AI',
    test: /^what is|introduction|explanation|learn ai|research paper|vs traditional|chatgpt|ethics|hallucination|prompt|machine learning|deep learning|neural/,
  },
  {
    slug: 'tools',
    name: 'AI Tools & Apps',
    test: /^best |top 10|\bapps?\b|extension|plugin|translation|tools\b/,
  },
  {
    slug: 'industry',
    name: 'AI in Industry',
    test: /./,
  },
]

export function categorize(post) {
  const title = post.title.toLowerCase()
  return BLOG_CATEGORIES.find((c) => c.test.test(title)).slug
}

export const categoryName = (slug) => BLOG_CATEGORIES.find((c) => c.slug === slug)?.name || ''
