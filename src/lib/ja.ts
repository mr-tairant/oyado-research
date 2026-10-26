import {stays} from './data';
export const regionNames:Record<string,string>={Tohoku:'東北',Chubu:'中部',Kansai:'関西',Shikoku:'四国',Okinawa:'沖縄'};
export const typeNames:Record<string,string>={'Ryokan':'旅館','Luxury resort':'ラグジュアリーリゾート','Onsen inn':'温泉宿','Resort':'リゾート','Riverside resort':'川辺のリゾート','Island resort':'島のリゾート'};
export const names:Record<string,string>={'yamatoya':'大和屋本店','hoshinoya-karuizawa':'星のや軽井沢','hoshinoya-kyoto':'星のや京都','hoshinoya-taketomi':'星のや竹富島','kiraku':'KIRAKU ONSEN LIVING'};
export const intros:Record<string,string>={'yamatoya':'道後温泉の日本旅館。能舞台のある館内で、松山の滞在をゆっくりと。','hoshinoya-karuizawa':'軽井沢の自然に寄り添うリゾート。客室や食事、温泉を軸に滞在を考える。','hoshinoya-kyoto':'京都・嵐山の川沿いに佇む宿。和の空間と季節の食を楽しむ滞在へ。','hoshinoya-taketomi':'沖縄・竹富島の集落風景に溶け込むリゾート。島の時間を感じる旅へ。','kiraku':'蔵王温泉の内湯・露天風呂がある宿。2027年1月からの新客室を案内しており、宿泊時期の確認が大切。'};
const tagNames:Record<string,string>={'Nature':'自然','Pavilion rooms':'離れの客室','Onsen':'温泉','Riverside':'川辺','Arashiyama':'嵐山','Boat arrival':'船での到着','Island villas':'島のヴィラ','Pool':'プール','Ferry journey':'船旅','Zao':'蔵王','Renewal planned':'リニューアル予定','Japanese rooms':'和室','Tram access':'路面電車でアクセス'};
export const jaStays=stays.filter(p=>p.mode==='live').map(p=>({...p,name:names[p.id]||p.name,intro:intros[p.id]||p.intro,tags:p.tags.map(t=>tagNames[t]||t)}));
