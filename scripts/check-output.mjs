import fs from 'node:fs';import path from 'node:path';
import {translationApproved} from './international-review.mjs';
const japaneseReview=JSON.parse(fs.readFileSync('data/japanese-review.json','utf8'));
const [directory='dist-review',mode='review']=process.argv.slice(2);
if(!['review','production','demo'].includes(mode))throw Error('Invalid output mode');
const root=path.resolve(directory),selection=JSON.parse(fs.readFileSync('data/selection.json','utf8'));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root);const htmls=files.filter(f=>f.endsWith('.html'));
for(const file of htmls){const html=fs.readFileSync(file,'utf8');
 const relative=path.relative(root,file).split(path.sep).join('/');
 const sample=/^(?:(?:ja|ko|zh-cn)\/)?samples\/interviews\//.test(relative);
 if(sample){
  if(mode==='demo')throw Error('Sales interview sample in fictional stay demo: '+file);
  const locale=relative.startsWith('samples/')?'en':relative.split('/')[0];
  const slug=path.basename(path.dirname(file));
  if(slug==='mountain-inn')throw Error('Deleted interview sample remains: '+file);
  if(!['interviews','townhouse-stay','riverside-retreat'].includes(slug))throw Error('Unknown interview sample: '+file);
  const language={ja:'ja',en:'en',ko:'ko','zh-cn':'zh-Hans'}[locale];
  const disclosure={ja:'本文の宿名・人物・発言は架空',en:'The stories, characters and quotations are fictional','zh-cn':'正文中的旅馆名称、人物与发言均为虚构',ko:'본문의 숙소명·인물·발언은 가상'}[locale];
  if(!disclosure||!html.includes(disclosure)||!html.includes('noindex,nofollow')||!new RegExp(`<html\\b[^>]*\\blang="${language}"(?:\\s|>)`).test(html))throw Error('Missing fictional sample disclosure: '+file);
  const expectedImages=slug==='interviews'?2:slug==='riverside-retreat'?2:3;
  if((html.match(/<img\s/g)||[]).length!==expectedImages||!html.includes('srcset='))throw Error('Missing sample imagery: '+file);
  if(/AI生成|AI-generated|AI 생성|AI로 생성|AIで生成/.test(html))throw Error('Unwanted customer-facing wording: '+file);
  if(slug==='riverside-retreat'||slug==='interviews'){
   for(const value of ['Hoshino Resorts','https://commons.wikimedia.org/wiki/File:Hoshinoya_Kyoto.jpg','https://creativecommons.org/licenses/by-sa/3.0','2011'])if(!html.includes(value))throw Error('Missing reference photo attribution: '+file);
  }
  if(slug==='riverside-retreat'&&html.includes('class="profile-photo"'))throw Error('Face portrait in property-led sample: '+file);
  if(slug!=='interviews'&&(html.match(/class="qa"/g)||[]).length!==5)throw Error('Incomplete sample interview: '+file);
  if(slug==='interviews'&&!html.match(/class="card-art"[^>]*href="[^"]*\/riverside-retreat\/"/))throw Error('Missing property-led sample card: '+file);
  continue;
 }
 const locale=path.relative(root,file).split(path.sep)[0];
 const ja=locale==='ja',translation=locale==='ko'||locale==='zh-cn';
 if(translation&&(mode==='demo'||mode==='production'&&!translationApproved(locale)))throw Error('Unapproved translation outside private review: '+file);
 const lang=ja?'ja':locale==='ko'?'ko':locale==='zh-cn'?'zh-Hans':'en';
 if(!new RegExp(`<html\\b[^>]*\\blang="${lang}"(?:\\s|>)`).test(html)||!html.includes('rel="canonical"')||!html.includes('property="og:image"'))throw Error('Missing SEO metadata: '+file);
 if(mode==='production'&&ja&&japaneseReview.review_status!=='approved')throw Error('Unapproved Japanese draft in production');
 if(mode==='production'&&ja&&(html.includes('確認用ドラフト')||!html.includes('hreflang="ja"')))throw Error('Japanese draft label or missing language metadata');
 if(mode!=='demo'&&html.includes('Imaginary Stay'))throw Error('Demo leaked into live output');
 if(mode==='production'&&(html.includes('noindex')||html.includes('PRIVATE EDITORIAL REVIEW')))throw Error('Review artifact leaked into production');
 if(mode!=='production'&&!html.includes('noindex,nofollow'))throw Error('Draft output must be noindex');
 if(mode!=='demo'){
  const route='/'+path.relative(root,file).split(path.sep).join('/').replace(/index\.html$/,'').replace(/^(ja|ko|zh-cn)\//,'');
  for(const locale of ['ko','zh-cn'])if(mode==='review'||translationApproved(locale)){
   if(!html.includes(`href="/${locale}${route}"`))throw Error('Missing translated-page navigation: '+file);
   if(mode==='production'&&!html.includes(`hreflang="${locale==='ko'?'ko':'zh-Hans'}"`))throw Error('Missing translation alternate: '+file);
  }
 }
 for(const locale of ['ko','zh-cn'])if(mode==='demo'||mode==='production'&&!translationApproved(locale))if(html.includes(`href="/${locale}/`))throw Error('Unpublished translation link: '+file);
}
for(const p of selection.selected){const id=mode==='demo'?'demo-'+p.id:p.id;const file=path.join(root,'stays',id,'index.html');if(!fs.existsSync(file))throw Error('Missing property page: '+id);const html=fs.readFileSync(file,'utf8');if(html.includes('id="owner-interview"'))throw Error('An interview appeared without a recorded interview in this release');}
for(const locale of ['ko','zh-cn']){
 if(mode==='demo'||mode==='production'&&!translationApproved(locale)){
  if(fs.existsSync(path.join(root,locale)))throw Error('Unapproved translation directory: '+locale);
  continue;
 }
 const routes=['','stays','regions','about',...selection.selected.map(p=>'stays/'+p.id),...selection.selected.map(p=>'regions/'+p.region.toLowerCase().replaceAll(' ','-'))];
 for(const route of routes){
  const file=path.join(root,locale,route,'index.html');
  if(!fs.existsSync(file))throw Error('Missing translation page: '+file);
  const html=fs.readFileSync(file,'utf8');
  if(mode==='review'&&(!html.includes('PRIVATE DRAFT REVIEW')||!html.includes('noindex,nofollow')))throw Error('Missing translation review boundary: '+file);
  if(mode==='production'&&(html.includes('PRIVATE DRAFT REVIEW')||html.includes('검토용 초안')||html.includes('审核草稿')))throw Error('Translation draft in production: '+file);
  if(route.startsWith('stays/')){
   const id=route.slice(6),photos=JSON.parse(fs.readFileSync('data/photos.json','utf8')),photo=photos[id];
   if(!html.includes('id="stay-guide"')||!html.includes(photo.source_url)||!html.includes(photo.license_url)||!html.includes(photo.photographed_at.slice(0,4)))throw Error('Incomplete translated guide or photo attribution: '+file);
  }
 }
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
if(mode!=='demo')for(const prefix of ['ja/','','ko/','zh-cn/'])for(const route of ['','townhouse-stay','riverside-retreat'])if(!fs.existsSync(path.join(root,prefix+'samples/interviews',route,'index.html')))throw Error('Missing interview sample: '+prefix+route);
if(sitemap.includes('/samples/interviews/'))throw Error('Sales interview sample in sitemap');
if(mode==='production'&&(!sitemap.includes('https://oyado-journal.pages.dev/stays/')||sitemap.includes('demo-')))throw Error('Invalid production sitemap');
if(mode==='production')for(const locale of ['ko','zh-cn']){
 if(sitemap.includes(`https://oyado-journal.pages.dev/${locale}/`)!==translationApproved(locale))throw Error('Translation sitemap approval mismatch: '+locale);
}
if(mode!=='production'&&sitemap.includes('<loc>'))throw Error('Draft sitemap must not list pages');
console.log(`Checked ${htmls.length} HTML pages, five stay guides and ${mode} indexing rules.`);
