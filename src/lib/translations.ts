import fs from 'node:fs';
import crypto from 'node:crypto';
import review from '../../data/japanese-review.json';
const expected=['src/lib/ja.ts','src/pages/ja/[...page].astro',...fs.readdirSync('src/content/stays-ja').map(f=>'src/content/stays-ja/'+f)];
export const japaneseApproved=review.review_status==='approved'&&Boolean(review.reviewer&&review.approval_evidence)&&Object.keys(review.hashes).length===expected.length&&expected.every(file=>crypto.createHash('sha256').update(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')).digest('hex')===review.hashes[file as keyof typeof review.hashes]);
