import fs from 'node:fs';
import crypto from 'node:crypto';
const files=['src/lib/ja.ts','src/pages/ja/[...page].astro',...fs.readdirSync('src/content/stays-ja').map(f=>'src/content/stays-ja/'+f)];
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')).digest('hex');
const file='data/japanese-review.json';
if(process.argv.includes('--prepare')){
 const old=JSON.parse(fs.readFileSync(file,'utf8'));if(old.review_status==='approved')throw Error('Already approved; explicitly revise before preparing a new packet');
 fs.writeFileSync(file,JSON.stringify({review_status:'draft',reviewer:'',approval_evidence:'',prepared_at:new Date().toISOString(),hashes:Object.fromEntries(files.map(f=>[f,hash(f)]))},null,2)+'\n');
 console.log('Japanese review packet prepared: five draft articles and Japanese UI.');
}else if(process.argv.includes('--approve')){
 const r=JSON.parse(fs.readFileSync(file,'utf8'));const reviewer=process.env.HUMAN_REVIEWER,evidence=process.env.APPROVAL_EVIDENCE;
 if(!reviewer||/codex|assistant|bot/i.test(reviewer)||!evidence)throw Error('Explicit human reviewer and approval evidence required');
 if(files.length!==Object.keys(r.hashes).length||!files.every(f=>r.hashes[f]===hash(f)))throw Error('Content changed after review packet; prepare and review again');
 fs.writeFileSync(file,JSON.stringify({...r,review_status:'approved',reviewer,approval_evidence:evidence,approved_at:new Date().toISOString()},null,2)+'\n');
 console.log('Japanese translation bundle approved.');
}else throw Error('Use --prepare or --approve');
