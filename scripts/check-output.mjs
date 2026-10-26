import fs from 'node:fs';import path from 'node:path';
const japaneseReview=JSON.parse(fs.readFileSync('data/japanese-review.json','utf8'));
const [directory='dist-review',mode='review']=process.argv.slice(2);
if(!['review','production','demo'].includes(mode))throw Error('Invalid output mode');
const root=path.resolve(directory),selection=JSON.parse(fs.readFileSync('data/selection.json','utf8'));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root);const htmls=files.filter(f=>f.endsWith('.html'));
for(const file of htmls){const html=fs.readFileSync(file,'utf8');
 const ja=path.relative(root,file).split(path.sep)[0]==='ja';
 if(!html.includes(`<html lang="${ja?'ja':'en'}">`)||!html.includes('rel="canonical"')||!html.includes('property="og:image"'))throw Error('Missing SEO metadata: '+file);
 if(mode==='production'&&ja&&japaneseReview.review_status!=='approved')throw Error('Unapproved Japanese draft in production');
 if(mode==='production'&&ja&&(html.includes('確認用ドラフト')||!html.includes('hreflang="ja"')))throw Error('Japanese draft label or missing language metadata');
 if(mode!=='demo'&&html.includes('Imaginary Stay'))throw Error('Demo leaked into live output');
 if(mode==='production'&&(html.includes('noindex')||html.includes('PRIVATE EDITORIAL REVIEW')))throw Error('Review artifact leaked into production');
 if(mode!=='production'&&!html.includes('noindex,nofollow'))throw Error('Draft output must be noindex');
}
for(const p of selection.selected){const id=mode==='demo'?'demo-'+p.id:p.id;const file=path.join(root,'stays',id,'index.html');if(!fs.existsSync(file))throw Error('Missing property page: '+id);const html=fs.readFileSync(file,'utf8');if(html.includes('id="owner-interview"'))throw Error('An interview appeared without a recorded interview in this release');}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
if(mode==='production'&&(!sitemap.includes('https://oyado-journal.pages.dev/stays/')||sitemap.includes('demo-')))throw Error('Invalid production sitemap');
if(mode!=='production'&&sitemap.includes('<loc>'))throw Error('Draft sitemap must not list pages');
console.log(`Checked ${htmls.length} HTML pages, five stay guides and ${mode} indexing rules.`);
