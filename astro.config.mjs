import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://guindonville.pages.dev',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
