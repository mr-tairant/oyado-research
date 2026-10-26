import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const choices=[
 ['hoshinoya-kyoto','Hoshinoya Kyoto.jpg','property','Water garden at HOSHINOYA Kyoto','星のや京都の水の庭'],
 ['hoshinoya-taketomi','Hoshinoya Okinawa.jpg','property','Village rooftops at HOSHINOYA Taketomi Island','星のや竹富島の集落風景'],
 ['hoshinoya-karuizawa','Kumoba-ike06s2048.jpg','destination','Kumoba Pond, Karuizawa — destination scenery, not the hotel','軽井沢・雲場池の地域風景（施設内ではありません）'],
 ['kiraku','Zao panorama.jpg','destination','Zao Onsen panorama — destination scenery, not the inn','蔵王温泉の地域風景（施設内ではありません）'],
 ['yamatoya','Dogo Noh 01.jpg','property','Dogo Noh Stage at Yamatoya Honten; archival performance photograph','大和屋本店・道後能楽堂の舞台（過去の演舞写真）']
];
const headers={'User-Agent':'OyadoJournal/0.1 (editorial media license verification; limited manual collection)'};
const request=async url=>{let r=await fetch(url,{headers});if(r.status===429){const delay=Number(r.headers.get('retry-after')||60);if(!Number.isFinite(delay)||delay>60)throw Error('Rate limited; retry later');console.log('Rate limit: waiting',delay,'seconds');await new Promise(resolve=>setTimeout(resolve,delay*1000));r=await fetch(url,{headers});}if(!r.ok)throw Error(`${r.status}: ${url}`);return r;};
const strip=s=>s.replace(/<[^>]*>/g,'').replaceAll('&amp;','&');
await fs.mkdir('data/snapshots/photo-rights',{recursive:true});
await fs.mkdir('data/snapshots/private/photo-originals',{recursive:true});
await fs.mkdir('src/assets/photos',{recursive:true});
const photos={};
for(const [id,file,kind,caption,caption_ja] of choices){
 const cached=await fs.readFile(`data/snapshots/photo-rights/${id}.json`,'utf8').catch(()=>null);
 if(cached){photos[id]=JSON.parse(cached).record;continue;}
 const api=new URL('https://commons.wikimedia.org/w/api.php');api.search=new URLSearchParams({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata|size',titles:'File:'+file});
 const evidence=await (await request(api)).json();const info=Object.values(evidence.query.pages)[0].imageinfo[0];const m=info.extmetadata;
 const license=m.LicenseShortName?.value;if(!/^CC BY(?:-SA)? [234]/.test(license))throw Error('Unapproved license: '+license);
 const licenseUrl=m.LicenseUrl?.value;if(!licenseUrl?.includes('creativecommons.org/licenses/'))throw Error('Missing license URL');
 const original=Buffer.from(await (await request(info.url)).arrayBuffer());
 await fs.writeFile(`data/snapshots/private/photo-originals/${id}.jpg`,original);
 const output=await sharp(original).rotate().resize({width:1800,withoutEnlargement:true}).webp({quality:82}).toBuffer();
 await fs.writeFile(`src/assets/photos/${id}.webp`,output);
 const dimensions=await sharp(output).metadata();
 const record={id,kind,caption,caption_ja,source_url:info.descriptionurl,source_name:'Wikimedia Commons',original_url:info.url.split('?')[0],author:id==='hoshinoya-taketomi'?'Hoshino Resorts / Akifumi Yamabe (YAMABE STUDIO INC.)':strip(m.Artist.value),license,license_url:licenseUrl,photographed_at:strip(m.DateTimeOriginal?.value||'Unknown'),retrieved_at:new Date().toISOString(),confidence:0.95,verification_status:'verified',rights_status:'licensed',modifications:'Resized and converted to WebP; display may crop. Derivative image under the same license.',sha256:crypto.createHash('sha256').update(output).digest('hex'),width:dimensions.width,height:dimensions.height,bytes:output.length};
 photos[id]=record;await fs.writeFile(`data/snapshots/photo-rights/${id}.json`,JSON.stringify({record,evidence},null,2)+'\n');
 console.log(id,license,output.length+' bytes');
}
await fs.writeFile('data/photos.json',JSON.stringify(photos,null,2)+'\n');
