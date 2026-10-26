import { defineConfig } from 'astro/config';
export default defineConfig({site: process.env.SITE_URL || 'https://example.invalid', output:'static',outDir:process.env.PUBLICATION_MODE==='review'?'./dist-review':'./dist'});
