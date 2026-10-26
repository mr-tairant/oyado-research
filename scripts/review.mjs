import fs from 'node:fs';
import {approved} from './pipeline.mjs';
import {contentDigest,metadata,normalizeMarkdown} from './editorial.mjs';
const [target,reviewer,evidence]=process.argv.slice(2);
if((target!=='--all'&&!/^[a-z0-9-]+$/.test(target||''))||!reviewer||!evidence)throw Error('Usage: node scripts/review.mjs ID|--all HUMAN_REVIEWER APPROVAL_EVIDENCE');
if(/codex|assistant|\bbot\b/i.test(reviewer))throw Error('The reviewer must be the person who actually approved the content');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const packet=read('data/review-request.json');
const ids=target==='--all'?packet.properties.map(p=>p.id):[target];
const pending=ids.map(id=>{
 const p=read(`data/properties/${id}.json`),oldText=normalizeMarkdown(fs.readFileSync(`src/content/stays/${id}.md`,'utf8'));
 const request=packet.properties.find(p=>p.id===id),meta=metadata(oldText);
 if(p.review_status!=='draft'||meta.review_status!=='draft'||meta.property_id!==id||meta.mode!=='live'||!request||request.sha256!==contentDigest(p,oldText))throw Error('Draft changed since review request: '+id);
 const sources=read(`data/sources/${p.research_id||id}.json`);
 if(!['name','address','official_cross_reference'].every(k=>sources.identity_checks?.[k]===true)||p.facts.some(f=>!sources.entries.some(e=>e.source_url===f.source_url&&e.verification_status==='verified')))throw Error('Identity or source URL not verified: '+id);
 p.review_status='approved';if(!approved(p))throw Error('Insufficient evidence: '+id);
 const text=oldText.replace(/^review_status: draft$/m,'review_status: approved');
 return {id,p,text,record:{reviewer,approval_evidence:evidence,reviewed_at:new Date().toISOString(),review_request_sha256:request.sha256,content_sha256:contentDigest(p,text)}};
});
// All drafts and evidence are checked before changing any approval state.
fs.mkdirSync('data/reviews',{recursive:true});
for(const {id,p,text,record}of pending){fs.writeFileSync(`data/properties/${id}.json`,JSON.stringify(p,null,2)+'\n');fs.writeFileSync(`src/content/stays/${id}.md`,text);fs.writeFileSync(`data/reviews/${id}.json`,JSON.stringify(record,null,2)+'\n');}
packet.status=packet.properties.every(p=>read(`data/properties/${p.id}.json`).review_status==='approved')?'approved':'partially_approved';
packet.last_approval_at=new Date().toISOString();
fs.writeFileSync('data/review-request.json',JSON.stringify(packet,null,2)+'\n');
console.log(`Human approval recorded for ${pending.length} guides. Run validation before publishing.`);
