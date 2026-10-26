import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {draw,approved} from './pipeline.mjs';
import {spawnSync} from 'node:child_process';
import os from 'node:os';import path from 'node:path';import {contentDigest,metadata} from './editorial.mjs';
const pool=JSON.parse(fs.readFileSync('data/candidates.json'));
test('seed reproduces unique selections with five different regions',()=>{const a=draw(pool,5,42);assert.deepEqual(a,draw(pool,5,42));assert.equal(new Set(a.map(p=>p.id)).size,5);assert.equal(new Set(a.map(p=>p.region)).size,5);});
test('bad arguments fail',()=>{for(const n of [0,-1,pool.length+1,1.5,NaN])assert.throws(()=>draw(pool,n,42));});
test('drafts, demos and missing evidence cannot publish',()=>{assert.equal(approved({mode:'demo',review_status:'approved',facts:[]}),false);assert.equal(approved({mode:'live',review_status:'draft',facts:[]}),false);assert.equal(approved({mode:'live',review_status:'approved',facts:[]}),false);assert.equal(approved({mode:'live',review_status:'approved',facts:[{verification_status:'verified'}]}),false);});
function fixture(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'oyado-editorial-test-'));
 t.after(()=>{const resolved=path.resolve(dir);if(path.dirname(resolved)!==path.resolve(os.tmpdir())||!path.basename(resolved).startsWith('oyado-editorial-test-'))throw Error('Unsafe test cleanup path');fs.rmSync(resolved,{recursive:true,force:true});});
 const put=(p,v)=>{const file=path.join(dir,p);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');};
 for(const file of ['pipeline.mjs','editorial.mjs','review.mjs'])put('scripts/'+file,fs.readFileSync('scripts/'+file,'utf8'));
 const property={id:'fixture',research_id:'fixture',name:'Fixture Stay',mode:'live',review_status:'draft',region:'Kansai',prefecture:'Kyoto',type:'Ryokan',tags:['Test'],intro:'Test only',updated_at:'2026-10-26T00:00:00Z',image:null,facts:[{field:'address',value:'Fixture address',source_url:'https://example.com/fixture/',source_name:'Fixture official source',retrieved_at:'2026-10-26T00:00:00Z',confidence:.95,verification_status:'verified'}]};
 const article='---\nproperty_id: fixture\nreview_status: draft\nmode: live\n---\n\n## Fixture guide\n\nThis is test content.\n';
 put('data/selection.json',{count:1,selected:[{id:'fixture'}]});put('data/properties/fixture.json',property);put('src/content/stays/fixture.md',article);
 put('data/sources/fixture.json',{identity_checks:{name:true,address:true,official_cross_reference:true},entries:[{source_url:'https://example.com/fixture/',verification_status:'verified'}]});
 put('data/review-request.json',{properties:[{id:'fixture',sha256:contentDigest(property,article)}]});
 const run=(script='pipeline.mjs',args=['validate'],env={})=>spawnSync(process.execPath,['scripts/'+script,...args],{cwd:dir,env:{...process.env,PUBLICATION_MODE:'production',SITE_URL:'https://oyado-journal.pages.dev',...env},encoding:'utf8'});
 const get=p=>JSON.parse(fs.readFileSync(path.join(dir,p),'utf8'));
 return {dir,put,get,property,article,run};
}
test('production refuses unapproved drafts in isolated data',t=>{const f=fixture(t);const r=f.run();assert.equal(r.status,1);assert.match(r.stderr,/No approved live guides/);});
test('recorded human approval allows verified production data',t=>{const f=fixture(t);const r=f.run('review.mjs',['--all','Fixture human reviewer','TEST FIXTURE ONLY: explicit approval']);assert.equal(r.status,0,r.stderr);assert.equal(f.run().status,0);});
test('approval rejects content changed after review request',t=>{const f=fixture(t);f.put('src/content/stays/fixture.md',f.article+'Unreviewed edit.');const r=f.run('review.mjs',['--all','Fixture human reviewer','TEST FIXTURE ONLY']);assert.equal(r.status,1);assert.match(r.stderr,/Draft changed/);assert.equal(f.get('data/properties/fixture.json').review_status,'draft');});
test('production rejects content changed after approval',t=>{const f=fixture(t);assert.equal(f.run('review.mjs',['--all','Fixture human reviewer','TEST FIXTURE ONLY']).status,0);f.put('src/content/stays/fixture.md',fs.readFileSync(path.join(f.dir,'src/content/stays/fixture.md'),'utf8')+'Unapproved edit.');const r=f.run();assert.equal(r.status,1);assert.match(r.stderr,/stale human review/);});
test('approval rejects unresolved property identity',t=>{const f=fixture(t);const s=f.get('data/sources/fixture.json');s.identity_checks.address=false;f.put('data/sources/fixture.json',s);const r=f.run('review.mjs',['--all','Fixture human reviewer','TEST FIXTURE ONLY']);assert.equal(r.status,1);assert.match(r.stderr,/Identity or source URL not verified/);});
test('Windows and Linux line endings produce the same review digest',()=>{const p={id:'fixture'};const text='---\nreview_status: draft\n---\nText\n';assert.equal(contentDigest(p,text),contentDigest(p,text.replaceAll('\n','\r\n')));});
test('frontmatter cannot be forged inside article body',()=>{assert.throws(()=>metadata('Body only\nproperty_id: fixture\nreview_status: approved'));assert.throws(()=>metadata('---\nreview_status: draft\nreview_status: approved\n---\n'));});
test('unknown publication mode fails closed',t=>{const f=fixture(t);const r=f.run('pipeline.mjs',['validate'],{PUBLICATION_MODE:'prodution'});assert.equal(r.status,1);assert.match(r.stderr,/Unknown publication mode/);});
