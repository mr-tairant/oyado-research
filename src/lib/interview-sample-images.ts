import mountainLounge from '../assets/interview-samples/mountain-inn-lounge.webp';
import townhouseOkami from '../assets/interview-samples/townhouse-okami.webp';
import townhouseWindow from '../assets/interview-samples/townhouse-window.webp';
import realExterior from '../assets/photos/hoshinoya-kyoto.webp';
import photoRecords from '../../data/photos.json';
// Fictional sample illustrations and a licensed reference photo; quotes do not belong to the pictured inn.
export const sampleImages={
 'townhouse-stay':{
  hero:townhouseOkami,detail:townhouseWindow,portrait:true,credit:null,
  heroAlt:'町家の宿で迎える着物姿の架空の女将。サンプルイラスト。',
  detailAlt:'木の建具と庭を望む町家の窓辺。サンプルイラスト。',
  label:'水彩イラスト',
  heroCaption:'町家の宿の女将という設定。サンプルイラスト／実在する人物の肖像ではありません。',
  detailCaption:'窓辺の椅子と庭の光。サンプルイラスト／架空の空間です。'
 },
 'riverside-retreat':{
  hero:realExterior,detail:mountainLounge,portrait:false,credit:photoRecords['hoshinoya-kyoto'],
  heroAlt:'星のや京都の水の庭と建物。2011年撮影の実写写真。',
  detailAlt:'窓辺のラウンジを描いた架空の空間イメージ。',
  label:'宿の実写写真（素材例）',
  heroCaption:'写真素材例：星のや京都。本文は架空のインタビューで、写真の宿への取材記事ではありません。',
  detailCaption:'窓辺のラウンジのサンプル画像。架空の空間であり、掲載写真の宿の内部ではありません。'
 }
};
