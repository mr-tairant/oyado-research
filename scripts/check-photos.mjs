import fs from 'node:fs';
import crypto from 'node:crypto';
const photos=JSON.parse(fs.readFileSync('data/photos.json','utf8'));
const selection=JSON.parse(fs.readFileSync('data/selection.json','utf8'));
for(const {id} of selection.selected){
 const p=photos[id];if(!p||p.rights_status!=='licensed'||p.verification_status!=='verified')throw Error('Unverified photo '+id);
 if(!p.author||!p.source_url.startsWith('https://commons.wikimedia.org/wiki/File:')||!/^https:\/\/creativecommons.org\/licenses\//.test(p.license_url))throw Error('Missing credit '+id);
 const evidence=JSON.parse(fs.readFileSync(`data/snapshots/photo-rights/${id}.json`,'utf8'));
 if(evidence.record.sha256!==p.sha256)throw Error('Evidence mismatch '+id);
 const image=fs.readFileSync(`src/assets/photos/${id}.webp`);
 if(crypto.createHash('sha256').update(image).digest('hex')!==p.sha256)throw Error('Photo changed '+id);
 if(p.kind==='destination'&&(!p.caption.includes('not the')||!p.caption_ja.includes('施設内ではありません')))throw Error('Destination mislabeled '+id);
}
const root=process.argv[2];
if(root){for(const {id} of selection.selected){
 const html=fs.readFileSync(`${root}/stays/${id}/index.html`,'utf8');const p=photos[id];
 if(!html.includes('<img ')||!html.includes('srcset=')||!html.includes(p.license_url)||!html.includes(p.source_url)||!html.includes(p.photographed_at.slice(0,4)))throw Error('Missing public photo credit '+id);
}}
console.log('Five licensed photos, hashes, source evidence and destination labels verified.');
