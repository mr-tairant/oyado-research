import fs from 'node:fs';
const base='https://oyado-journal.pages.dev';
const selected=JSON.parse(fs.readFileSync('data/selection.json','utf8')).selected;
const region=r=>r.toLowerCase().replaceAll(' ','-');
const paths=['/','/about/','/stays/','/regions/',...selected.map(p=>`/stays/${p.id}/`),...[...new Set(selected.map(p=>region(p.region)))].map(r=>`/regions/${r}/`)];
paths.push(...paths.map(p=>'/ja'+p));
const photos=JSON.parse(fs.readFileSync('data/photos.json','utf8'));
const photoAssets=new Set();
const request=async p=>{const response=await fetch(base+p,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'OYADO-publication-check/1.0'}});return {response,text:await response.text()};};
const results=await Promise.allSettled(paths.map(async p=>{
 const {response,text}=await request(p);
 if(response.status!==200)throw Error(`${p}: HTTP ${response.status}`);
 if(!text.includes(`href="${base+p}"`))throw Error(`${p}: canonical URL mismatch`);
 if(text.includes('noindex')||text.includes('Imaginary Stay')||text.includes('PRIVATE EDITORIAL REVIEW'))throw Error(`${p}: non-public content detected`);
 if(text.includes('確認用ドラフト')||!text.includes('hreflang="ja"')||!text.includes('hreflang="en"'))throw Error(`${p}: invalid language publication`);
 if(!text.includes(`<html lang="${p.startsWith('/ja/')?'ja':'en'}">`))throw Error(`${p}: wrong document language`);
 const stayPath=p.replace(/^\/ja/,'');
 if(stayPath.startsWith('/stays/')&&stayPath!=='/stays/'){
  const id=stayPath.split('/')[2],photo=photos[id];
  if(!text.includes(photo.source_url)||!text.includes(photo.license_url)||!text.includes('<img ')||!text.includes('srcset=')||!text.includes('application/ld+json'))throw Error(`${p}: missing photo credit or structured data`);
  for(const match of text.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g))photoAssets.add(match[1]);
 }
 if(p.startsWith('/stays/')&&p!=='/stays/'){
  const property=selected.find(s=>p===`/stays/${s.id}/`);
  if(!text.includes(property.name)||!text.includes('application/ld+json')||text.includes('id="owner-interview"'))throw Error(`${p}: invalid stay metadata`);
 }
 return {url:base+p,status:response.status,canonical:true,public_content:true};
}));
const failures=results.filter(r=>r.status==='rejected').map(r=>String(r.reason));
const extras=await Promise.allSettled(['/sitemap.xml','/robots.txt','/og.png',...photoAssets].map(async p=>{
 const response=await fetch(base+p,{signal:AbortSignal.timeout(20000)});if(response.status!==200)throw Error(`${p}: HTTP ${response.status}`);
 if(p==='/sitemap.xml'){const text=await response.text();if(selected.some(s=>!text.includes(`${base}/stays/${s.id}/`))||text.includes('demo-'))throw Error('Invalid public sitemap');}
 if(p.startsWith('/_astro/')&&!response.headers.get('content-type')?.startsWith('image/'))throw Error('Invalid photo asset');
 if(p==='/robots.txt'&&(await response.text()).includes('Disallow: /'))throw Error('Live robots blocks indexing');
 if(p==='/og.png'&&!response.headers.get('content-type')?.startsWith('image/png'))throw Error('Invalid OGP image content type');
 return {url:base+p,status:response.status};
}));
failures.push(...extras.filter(r=>r.status==='rejected').map(r=>String(r.reason)));
const report={checked_at:new Date().toISOString(),site:base,status:failures.length?'failed':'passed',pages:results.filter(r=>r.status==='fulfilled').map(r=>r.value),assets:extras.filter(r=>r.status==='fulfilled').map(r=>r.value),failures};
fs.mkdirSync('data/logs',{recursive:true});fs.writeFileSync('data/logs/live-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({site:base,status:report.status,pages:report.pages.length,assets:report.assets.length,failures},null,2));
if(failures.length)process.exitCode=1;
