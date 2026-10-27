import fs from 'node:fs';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
export const locales=['ko','zh-cn'];
const recordFile='data/international-review.json';
export function reviewFiles(locale){
 if(!locales.includes(locale))throw Error('Unknown translation locale');
 return ['scripts/international-review.mjs','src/lib/international.ts','src/lib/international-approval.ts','src/lib/data.ts','src/lib/photos.ts','data/photos.json','src/layouts/International.astro','src/layouts/Layout.astro','src/components/InternationalPhoto.astro','src/pages/[locale]/[...page].astro','src/pages/sitemap.xml.ts','src/styles/global.css','src/styles/editorial.css',...fs.readdirSync(`src/content/stays-${locale}`).filter(f=>f.endsWith('.md')).sort().map(f=>`src/content/stays-${locale}/${f}`)];
}
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')).digest('hex');
export function translationApproved(locale){
 try{
  const record=JSON.parse(fs.readFileSync(recordFile,'utf8'))[locale],files=reviewFiles(locale);
  return record?.review_status==='approved'&&Boolean(record.reviewer&&record.approval_evidence)&&files.length===Object.keys(record.hashes).length&&files.every(f=>record.hashes[f]===hash(f));
 }catch{return false;}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [action,locale]=process.argv.slice(2),files=reviewFiles(locale);
 const records=fs.existsSync(recordFile)?JSON.parse(fs.readFileSync(recordFile,'utf8')):{};
 if(action==='--prepare'){
  if(records[locale]?.review_status==='approved')throw Error('Explicitly revise the approved record before preparing a new review');
  records[locale]={review_status:'draft',reviewer:'',approval_evidence:'',prepared_at:new Date().toISOString(),hashes:Object.fromEntries(files.map(f=>[f,hash(f)]))};
 }else if(action==='--approve'){
  const reviewer=process.env.HUMAN_REVIEWER,evidence=process.env.APPROVAL_EVIDENCE,record=records[locale];
  if(!reviewer||/codex|assistant|bot/i.test(reviewer)||!evidence)throw Error('Explicit human approval required');
  if(!record||files.length!==Object.keys(record.hashes).length||!files.every(f=>record.hashes[f]===hash(f)))throw Error('Translation changed after review preparation');
  records[locale]={...record,review_status:'approved',reviewer,approval_evidence:evidence,approved_at:new Date().toISOString()};
 }else throw Error('Use --prepare or --approve followed by ko or zh-cn');
 fs.writeFileSync(recordFile,JSON.stringify(records,null,2)+'\n');
 console.log(`${locale}: ${records[locale].review_status}`);
}
