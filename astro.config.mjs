import { defineConfig } from 'astro/config';

// Change `site` and `base` to match your GitHub Pages URL.
// - User page (repo named <username>.github.io): site: 'https://<username>.github.io', base: '/'
// - Project page (any other repo):       site: 'https://<username>.github.io', base: '/<repo-name>'
export default defineConfig({
  site: 'https://kristinayuan.github.io',
  base: '/kristina-treehouse',
  build: {
    assets: 'assets',  // avoid _astro folder — Jekyll ignores _underscore dirs on GitHub Pages
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
