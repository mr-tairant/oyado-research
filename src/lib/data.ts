import fs from 'node:fs';
import path from 'node:path';
import { marked, Renderer } from 'marked';
export type Fact={field:string;value:string;source_url:string;source_name:string;retrieved_at:string;confidence:number;verification_status:string};
export type Property={id:string;name:string;mode:string;review_status:string;region:string;prefecture:string;type:string;tags:string[];intro:string;updated_at:string;facts:Fact[]};
const all=Object.values(import.meta.glob('../../data/properties/*.json',{eager:true,import:'default'})) as Property[];
export const demo=process.env.PUBLICATION_MODE!=='production';
export const stays=all.filter(p=>demo?p.mode==='demo':p.mode==='live'&&p.review_status==='approved'&&p.facts.length>0&&p.facts.every(f=>f.verification_status==='verified'));
export const regions=[...new Set(stays.map(p=>p.region))];
export const regionSlug=(r:string)=>r.toLowerCase().replaceAll(' ','-');
// Article HTML is escaped first; generated or interview text cannot inject HTML.
export function article(id:string,kind='stays') {
 const file=path.resolve(`src/content/${kind}/${id}.md`);if(!fs.existsSync(file))return null;
 const raw=fs.readFileSync(file,'utf8');
 if(kind==='interviews'&&(!/^review_status: approved$/m.test(raw)||!/^consent: granted$/m.test(raw)))return null;
 const body=raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'');
 // Disable Markdown links/images as well as HTML; source links are rendered separately.
 const renderer=new Renderer();
 renderer.link=function({tokens}) {return this.parser.parseInline(tokens);};
 renderer.image=()=>'';
 return marked.parse(body.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),{renderer});
}
