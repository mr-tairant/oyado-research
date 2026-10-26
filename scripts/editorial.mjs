import crypto from 'node:crypto';
export const normalizeMarkdown=text=>text.replace(/\r\n/g,'\n');
export const contentDigest=(property,article)=>crypto.createHash('sha256').update(normalizeMarkdown(article)).update(JSON.stringify(property)).digest('hex');
export function metadata(article){
 const match=normalizeMarkdown(article).match(/^---\n([\s\S]*?)\n---(?:\n|$)/);if(!match)throw Error('Missing article frontmatter');
 const result={};for(const line of match[1].split('\n')){if(!line.trim()||line.trim().startsWith('#'))continue;const m=line.match(/^([a-z_]+):\s*(.*?)\s*$/);if(!m)throw Error('Invalid frontmatter line');if(Object.hasOwn(result,m[1]))throw Error('Duplicate frontmatter key');result[m[1]]=m[2];}return result;
}
