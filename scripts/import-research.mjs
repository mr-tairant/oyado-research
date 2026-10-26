import fs from 'node:fs';
import path from 'node:path';
import {contentDigest} from './editorial.mjs';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,v)=>{const target=path.join(root,p);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');};
const research=read('data/research/2026-10-26.json');
for(const r of research.properties){const target=`data/properties/${r.id}.json`;if(fs.existsSync(path.join(root,target))&&read(target).review_status==='approved')throw Error('Refusing to replace an approved article. Create an explicit new editorial revision.');}
const selected=read('data/selection.json').selected;
if(JSON.stringify(selected.map(p=>p.id).sort())!==JSON.stringify(research.properties.map(p=>p.id).sort()))throw Error('Research must match the saved draw');
const media=['official','Rakuten Travel','Jalan','Ikyu','Booking.com','Agoda','Expedia'];
const queryLog=read('data/raw/research/query-log.json');
const domains=['','travel.rakuten.co.jp','jalan.net','ikyu.com','booking.com','agoda.com','expedia.com'];
const candidates={
 yamatoya:{'Rakuten Travel':'https://travel.rakuten.co.jp/HOTEL/13429/13429.html',Jalan:'https://www.jalan.net/yad354082/',Ikyu:'https://www.ikyu.com/00000663/', 'Booking.com':'https://www.booking.com/hotel/jp/yamatoya-honten-matsuyama.ja.html',Agoda:'https://www.agoda.com/yamatoya-honten-dogo-h10565536/hotel/matsuyama-jp.html',Expedia:'https://www.expedia.com/Matsuyama-Hotels-Yamatoya-Honten.h16000964.Hotel-Information'},
 'hoshinoya-taketomi':{'Rakuten Travel':'https://travel.rakuten.co.jp/mytrip/howto/hoshinoya-taketomijima-guide',Ikyu:'https://www.ikyu.com/00003309/',Agoda:'https://www.agoda.com/hoshinoya-taketomi-island/hotel/taketomi-jp.html'},
 'hoshinoya-karuizawa':{'Rakuten Travel':'https://travel.rakuten.co.jp/HOTEL/172989/THEME/2/',Expedia:'https://www.expedia.com/Karuizawa-Hotels-HOSHINOYA-Karuizawa.h2824199.Hotel-Information'},
 kiraku:{'Rakuten Travel':'https://hotel.travel.rakuten.co.jp/hotelinfo/plan/12535',Jalan:'https://www.jalan.net/yad325153/','Booking.com':'https://www.booking.com/hotel/jp/xi-raku.en-gb.html',Agoda:'https://www.agoda.com/sv-se/zao-spa-hotel-kiraku/hotel/sendai-jp.html'},
 'hoshinoya-kyoto':{'Rakuten Travel':'https://travel.rakuten.co.jp/HOTEL/172992/THEME/1/',Ikyu:'https://www.ikyu.com/concierge/tag/00001576',Agoda:'https://www.agoda.com/hoshinoya-kyoto-h80060022/hotel/kyoto-jp.html'}
};
const report=[];
for(const r of research.properties){
 const urls={main:r.official_url,access:r.official_url.replace(/\/$/,'')+'/access/',dining:r.official_url.replace(/\/$/,'')+'/dining/'};
 const officialEntries=[...new Set(r.facts.map(f=>urls[f[2]]))].map(url=>({source_name:'Official website',source_url:url,retrieved_at:research.researched_at,confidence:0.95,verification_status:'verified',status:'official_text_checked',verification_method:'Published name, address and property-specific official page cross-checked by Codex; human article approval pending',access_method:'built_in_search_service_public_text',automation_permission:'not_granted',screenshot_permission:'not_granted',evidence:r.facts.filter(f=>urls[f[2]]===url).map(f=>({field:f[0],section:f[3]}))}));
 const entries=media.map((name,i)=>{
  const candidate=name==='official'?r.official_url:candidates[r.id]?.[name];
  const linked=r.id==='kiraku'&&['Rakuten Travel','Jalan','Booking.com'].includes(name);
  const verified=name==='official'||linked;
  const editorialOnly=(r.id==='hoshinoya-taketomi'&&name==='Rakuten Travel')||(r.id==='hoshinoya-kyoto'&&name==='Ikyu');
  const result={source_name:name,query:name==='official'?null:queryLog.queries.find(q=>q[0]===r.id&&q[1]===name)?.[2],domain_filters:queryLog.domain_filters[name]||[],source_url:verified?candidate:null,candidate_url:candidate||null,retrieved_at:research.researched_at,confidence:verified?0.95:candidate?0.5:0,verification_status:verified?'verified':'unverified',status:verified?(linked?'official_outbound_link_verified':'official_text_checked'):candidate?(editorialOnly?'editorial_page_only':'candidate_requires_identity_check'):'search_completed_not_confirmed',search_provider:'built_in_search_service',body_collection:linked&&name==='Booking.com'?'blocked_not_retried':'not_automatically_scraped',evidence:linked?'The official English site explicitly links to this OTA URL. Identity confirmation does not establish current availability.':name==='official'?'Property name and address match the saved candidate.':'A search result is a lead; not accepted as a verified listing.'};
  report.push({property:r.name,property_id:r.id,media:name,status:result.status,verification_status:result.verification_status,url:result.source_url||result.candidate_url});return result;
 });
 const previous=`data/sources/${r.id}.json`;if(fs.existsSync(path.join(root,previous)))write(`data/sources/history/${r.id}-before-live-research.json`,read(previous));
 write(previous,{property_id:r.id,researched_at:research.researched_at,identity_checks:{name:true,address:true,official_cross_reference:true},identity_evidence:{name:r.name,address:r.address,official_url:r.official_url,checked_by:research.researcher},editorial_notes:r.editorial_notes,entries:[...entries,...officialEntries.filter(e=>e.source_url!==r.official_url)]});
 const property={id:r.id,research_id:r.id,mode:'live',review_status:'draft',name:r.name,region:r.region,prefecture:r.prefecture,type:r.type,tags:r.tags,intro:r.intro,official_url:r.official_url,address:r.address,facts:r.facts.map(([field,value,key,section])=>({field,value,source_url:urls[key],source_name:'Official website',retrieved_at:research.researched_at,confidence:0.95,verification_status:'verified',evidence_section:section})),unverified_fields:r.unverified_fields,editorial_notes:r.editorial_notes,updated_at:research.researched_at,image:null,generation:{method:'Codex editorial synthesis from recorded official facts; no paid OpenAI API request',generated_at:new Date().toISOString()}};
 write(`data/properties/${r.id}.json`,property);
 const article=`---\nproperty_id: ${r.id}\nreview_status: draft\nmode: live\n---\n\n${r.article}\n`;
 write(`src/content/stays/${r.id}.md`,article);
 write(`data/snapshots/research-${r.id}.json`,{source_urls:officialEntries.map(e=>e.source_url),retrieved_at:research.researched_at,method:research.method,full_html_retained:false,screenshot_taken:false,evidence_sections:officialEntries.flatMap(e=>e.evidence),copyright_policy:'Original factual summaries only; no copied photos, reviews or full pages.'});
}
write('data/discovery-report.json',report);
write('docs/discovery-report.md','# URL discovery report — 2026-10-26\n\n35 source checks for the saved five-property draw. Search completed does not mean a listing was confirmed. Candidate URLs are internal research leads only; only verified URLs may appear as public source or booking links. Availability and rates are not asserted.\n\n|Property|Source|Result|Verification|URL|\n|---|---|---|---|---|\n'+report.map(r=>`|${r.property}|${r.media}|${r.status}|${r.verification_status}|${r.url||'Not confirmed'}|`).join('\n')+'\n\nKiraku’s Rakuten, Jalan and Booking URLs are explicitly linked by its official website. Booking body retrieval was blocked and was not retried. Other OTA leads require further identity checks. Rakuten’s Taketomi result and Ikyu’s Kyoto result are editorial pages, not confirmed booking listings. Unrelated Osaka Yamatoya, Miyazaki Kiraku Obi and Oita Kiraku results were rejected.\n');
const packet={created_at:new Date().toISOString(),status:'awaiting_human_approval',properties:research.properties.map(r=>({id:r.id,article:`src/content/stays/${r.id}.md`,property:`data/properties/${r.id}.json`,sha256:contentDigest(read(`data/properties/${r.id}.json`),fs.readFileSync(path.join(root,`src/content/stays/${r.id}.md`),'utf8'))}))};
write('data/review-request.json',packet);
fs.appendFileSync(path.join(root,'data/logs/events.jsonl'),JSON.stringify({at:new Date().toISOString(),step:'curated_live_research',count:research.properties.length,status:'draft',paid_api_requests:0,search_checks:35})+'\n');
console.log(`Prepared ${research.properties.length} live drafts; ${report.filter(r=>r.verification_status==='verified').length}/35 source URLs verified. No article approved.`);
