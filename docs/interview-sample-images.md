# 商談用サンプルの画像

## 人物画像への差し替え（2026-10-27）

利用者の「１つはオーナーの写真、もう１つは女将のイラストでGO。」に合わせ、一覧・記事冒頭を人物画像へ変更し、プロフィールにも使用。内蔵image_genで作成した架空人物である旨を各画像に表示。本文の役職はオーナーA・女将Bに統一。中面のラウンジ・窓辺画像は継続使用。

- `src/assets/interview-samples/mountain-inn-owner.webp`：AI生成の写真風オーナーポートレート。
- `src/assets/interview-samples/townhouse-okami.webp`：AI生成の女将の水彩イラスト。

以前の外観画像2点は素材として保持し、現在のページからは参照しない。人物画像も1536×1024、WebP品質88。元PNGは生成ツールの保存領域に保持。

### mountain-inn-owner の使用プロンプト

Use case: photorealistic-natural. A warm, believable editorial environmental portrait of an entirely fictional Japanese male ryokan owner in his late forties, standing naturally at the timber entrance of an imaginary small mountain inn, forest greenery softly out of focus behind him. Wearing a plain charcoal work jacket over a natural linen shirt, no logos, relaxed hands and genuine subtle welcoming expression, thoughtful approachable personality, natural skin texture and slight wrinkles, no beauty retouching. Medium waist-up composition, face in upper-middle area and well inside central safe region so a 16:9 crop will retain whole head and shoulders, generous space above head. Wide landscape 3:2 composition, eye-level camera, soft natural daylight, understated premium travel journal photography, moss green and warm wood palette. No text, no watermarks, no actual celebrity or known person, no identifiable real inn. This is a clearly labeled AI-generated fictional interview mockup asset.

### townhouse-okami の使用プロンプト

Use case: illustration-story. An elegant hand-painted watercolor and fine pencil environmental portrait of an entirely fictional Japanese female ryokan okami in her early fifties, welcoming the viewer inside an imaginary renovated wooden machiya inn. Wearing a tasteful muted sage green kimono with a simple cream obi, natural neat hair, warm confident gentle smile, hands loosely folded, believable unexaggerated proportions. Medium waist-up composition, face in upper-middle area well inside central safe region for a 16:9 crop, generous space above head. Wide landscape 3:2 composition. Delicate graphite architectural lines, transparent watercolor washes on warm ivory paper, subtle wood lattice and a quiet courtyard in the background, sophisticated travel magazine illustration, restrained earth colors. No text, no logos, no watermarks, no identifiable actual person or existing inn. This is an AI-generated fictional interview sample, not a portrait of a real okami.

## 以下は初回の背景画像記録

2026-10-27、利用者の「サンプルでいいので写真を適用して。１つはイラストでもOK」という依頼で作成。内蔵 `image_gen` を使用し、外部の有料APIやCLIは使っていない。すべてAI生成の架空イメージであり、実在施設の撮影写真や取材実績ではない。人物・施設名・ロゴは含めていない。

保存先：`src/assets/interview-samples/`。1536×1024、WebP品質88。各記事のメイン・中面、一覧の画像に使用する。元のPNGは生成ツールの保存領域に保持。実施設写真の `data/photos.json` には登録しない。

|ファイル|使用箇所|
|---|---|
|mountain-inn-exterior.webp|山の宿の一覧・メイン画像（写真風）|
|mountain-inn-lounge.webp|山の宿の記事中面（写真風）|
|townhouse-exterior.webp|町家の宿の一覧・メイン画像（水彩イラスト）|
|townhouse-window.webp|町家の宿の記事中面（水彩イラスト）|

## 使用したプロンプト

### mountain-inn-exterior

Use case: photorealistic-natural. Create a wide landscape editorial photograph-style AI illustration for an explicitly fictional Japanese inn interview sales sample. Quiet small timber ryokan nestled in a lush forested mountain valley in Japan, modest dark tiled roof and weathered wood facade, warm window light, a simple stone approach, early morning mist, natural unembellished textures. Understated Japanese travel journal photography, realistic proportions and materials, soft overcast light, muted moss greens and warm wood. Architecture and setting fill frame, no people, no lettering, no signs, no logos, no watermark. Entirely imaginary architecture; do not depict a real named hotel. Landscape 3:2 composition.

### townhouse-exterior

Use case: illustration-story. Wide landscape editorial watercolor and fine pencil illustration for a fictional Japanese townhouse inn interview sales sample. A small two-storey traditional wooden machiya with lattice windows and a modest unmarked linen curtain at the entrance, on a quiet narrow lived-in Japanese lane, potted greenery and neighboring facades. Warm ivory paper, translucent soft earth colors, restrained sage and terracotta accents, beautifully drawn architectural details, hand-painted travel journal illustration with generous atmospheric light. No people, no text, no logos, no watermark. Entirely imaginary building, not an identifiable real property. Landscape 3:2 composition.

### mountain-inn-lounge

Use case: photorealistic-natural. Landscape editorial photograph-style image for a clearly fictional Japanese mountain ryokan sales sample. A quiet modest timber lounge after a hot spring bath: two low wooden lounge chairs with linen cushions facing a large window, handmade ceramic tea cups on a small table, lush forest beyond, soft natural morning light. Authentic believable Japanese joinery, quiet warm wood and moss green, restrained premium travel magazine photography, lived-in and tactile, no people, no text, no logos, no identifiable existing hotel. Composition 3:2, intimate interior detail, photorealistic.

### townhouse-window

Use case: illustration-story. Landscape watercolor and fine graphite editorial illustration on warm ivory paper: close intimate view of a fictional Japanese machiya interior, a simple wooden chair beside a timber lattice window, tea cup and small ceramic vase on a low wooden table, soft morning light, a tiny courtyard garden glimpsed beyond. Restrained muted sage and ochre, delicate hand-drawn architectural lines, translucent washes, sophisticated travel journal, no people, no lettering, no logos. Fictional location. Landscape 3:2 composition.
