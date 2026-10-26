import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
export const collections={stays:defineCollection({loader:glob({pattern:'*.md',base:'./src/content/stays'})}),interviews:defineCollection({loader:glob({pattern:'*.md',base:'./src/content/interviews'})})};
