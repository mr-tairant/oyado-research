import records from '../../data/photos.json';
import type {ImageMetadata} from 'astro';
const images=import.meta.glob<{default:ImageMetadata}>('../assets/photos/*.webp',{eager:true});
export function photo(id:string){
 const record=records[id as keyof typeof records];
 const image=images[`../assets/photos/${id}.webp`]?.default;
 return record?.rights_status==='licensed'&&record.verification_status==='verified'&&image?{...record,image}:null;
}
