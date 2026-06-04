// Static product catalogue for DEMO mode (no backend). Mirrors server/data/seed.js.
// _id is set to the slug so cart keys, routing, and order items all work offline.

const raw = [
  // APPAREL
  { slug:'vibes-on-vibes-tee', name:'Vibes on Vibes Tee', category:'apparel', price_zmw:250, price_usd:13, description:'Drop-shoulder tee from the Vibes on Vibes album era. 100% heavyweight cotton. Gold YM monogram print.', sizes:['S','M','L','XL','XXL'], tags:['new'], album:'Vibes on Vibes', in_stock:true, stock_count:80 },
  { slug:'finally-anniversary-tee', name:'Finally Anniversary Tee', category:'apparel', price_zmw:230, price_usd:12, description:'Celebrating the song that started it all. Limited anniversary reprint.', sizes:['S','M','L','XL','XXL'], tags:['best-seller'], album:'Finally', in_stock:true, stock_count:60 },
  { slug:'olios-records-tee', name:'Olios Records Tee', category:'apparel', price_zmw:220, price_usd:11, description:'Represent the label. Clean Olios Records wordmark on premium cotton.', sizes:['S','M','L','XL','XXL'], tags:[], album:'Olios Records', in_stock:true, stock_count:100 },
  { slug:'mr-romantic-hoodie', name:'Mr Romantic Hoodie', category:'apparel', price_zmw:420, price_usd:22, description:"Heavy-knit pullover hoodie. Inspired by Boomplay's most-streamed Zambian song of 2022.", sizes:['S','M','L','XL','XXL'], tags:['best-seller'], album:'My Hero', in_stock:true, stock_count:45 },
  { slug:'komando-hoodie', name:'Komando Heavyweight Hoodie', category:'apparel', price_zmw:450, price_usd:23, description:'Inspired by the debut album. 400gsm fleece. Embroidered logo.', sizes:['S','M','L','XL','XXL'], tags:[], album:'Komando', in_stock:true, stock_count:35 },
  { slug:'yo-maps-zip-jacket', name:'Yo Maps Zip-Up Jacket', category:'apparel', price_zmw:550, price_usd:28, description:'Full-zip track jacket. Gold zipper, contrast YM side stripe.', sizes:['S','M','L','XL','XXL'], tags:['new'], album:null, in_stock:true, stock_count:30 },
  // HEADWEAR
  { slug:'maps-signature-snapback', name:'Maps Signature Snapback', category:'headwear', price_zmw:180, price_usd:9, description:'Six-panel snapback. Embroidered gold YM logo. One size fits all.', sizes:null, tags:['best-seller'], album:null, in_stock:true, stock_count:90 },
  { slug:'olios-dad-cap', name:'Olios Records Dad Cap', category:'headwear', price_zmw:160, price_usd:8, description:'Unstructured low-profile cap. Washed cotton. Adjustable strap.', sizes:null, tags:[], album:'Olios Records', in_stock:true, stock_count:70 },
  { slug:'vibes-bucket-hat', name:'Vibes on Vibes Bucket Hat', category:'headwear', price_zmw:190, price_usd:10, description:'Double-sided bucket hat. Vibes on Vibes text on one side, YM monogram reverse.', sizes:null, tags:['new'], album:'Vibes on Vibes', in_stock:true, stock_count:50 },
  { slug:'ym-beanie', name:'YM Logo Beanie', category:'headwear', price_zmw:150, price_usd:8, description:'Slouch-fit ribbed knit beanie. Embroidered YM. Zambia-ready warmth.', sizes:null, tags:[], album:null, in_stock:true, stock_count:60 },
  // ACCESSORIES
  { slug:'ym-tote-bag', name:'YM Tote Bag', category:'accessories', price_zmw:170, price_usd:9, description:'Heavy-duty canvas tote. YM monogram screen print. 15L capacity.', sizes:null, tags:['new'], album:null, in_stock:true, stock_count:80 },
  { slug:'maps-backpack', name:'Maps Logo Backpack', category:'accessories', price_zmw:480, price_usd:25, description:'Water-resistant backpack. Padded laptop sleeve. Embossed YM badge.', sizes:null, tags:[], album:null, in_stock:true, stock_count:25 },
  { slug:'phone-grip', name:'Phone Grip / PopSocket', category:'accessories', price_zmw:90, price_usd:5, description:'Swappable phone grip. Gold YM design. Works with all cases.', sizes:null, tags:[], album:null, in_stock:true, stock_count:120 },
  { slug:'lanyard-keyring', name:'Lanyard & Keyring Set', category:'accessories', price_zmw:80, price_usd:4, description:'YM branded lanyard + matching metal keyring. Festival essential.', sizes:null, tags:[], album:null, in_stock:true, stock_count:150 },
  // MUSIC & COLLECTIBLES
  { slug:'vibes-signed-poster', name:'Vibes on Vibes Signed Poster', category:'music', price_zmw:350, price_usd:18, description:'A2 art print. Hand-signed by Yo Maps. Certificate of authenticity included.', sizes:null, tags:['limited'], album:'Vibes on Vibes', in_stock:true, stock_count:40 },
  { slug:'finally-vinyl', name:'Finally Vinyl Record', category:'music', price_zmw:520, price_usd:27, description:'12" vinyl pressing of "Finally" ft. Macky 2. Collector\'s edition. Numbered sleeve.', sizes:null, tags:['limited'], album:'Finally', in_stock:true, stock_count:20 },
  { slug:'concert-photo-print', name:'Concert Photo Print (A3)', category:'music', price_zmw:200, price_usd:10, description:'Archival-quality A3 print from the Heroes Stadium concert, Lusaka 2023.', sizes:null, tags:[], album:null, in_stock:true, stock_count:60 },
  { slug:'autographed-lyric-sheet', name:'Autographed Lyric Sheet', category:'music', price_zmw:600, price_usd:31, description:'Hand-written and signed lyric sheet from "Mr Romantic". Framed, numbered 1–30.', sizes:null, tags:['limited','exclusive'], album:'My Hero', in_stock:true, stock_count:12 },
  // LIFESTYLE
  { slug:'ym-logo-mug', name:'YM Logo Mug', category:'lifestyle', price_zmw:120, price_usd:6, description:'350ml ceramic mug. Gold YM logo. Dishwasher safe. Morning energy.', sizes:null, tags:[], album:null, in_stock:true, stock_count:100 },
  { slug:'vibes-phone-case', name:'Vibes on Vibes Phone Case', category:'lifestyle', price_zmw:140, price_usd:7, description:'Matte black hardshell case. Compatible with iPhone 14–16 and Samsung S-series.', sizes:null, tags:['new'], album:'Vibes on Vibes', in_stock:true, stock_count:80 },
  { slug:'sticker-pack', name:'Sticker Pack (6pc)', category:'lifestyle', price_zmw:60, price_usd:3, description:'Six die-cut vinyl stickers. Waterproof. YM logos, album art, Zambia flag detail.', sizes:null, tags:[], album:null, in_stock:true, stock_count:200 },
  { slug:'ym-notebook', name:'Notebook — Maps Edition', category:'lifestyle', price_zmw:110, price_usd:6, description:'A5 hardcover notebook. 200 pages, gold-ruled. YM logo embossed on cover.', sizes:null, tags:[], album:null, in_stock:true, stock_count:90 },
  // EXCLUSIVE DROPS
  { slug:'vip-fan-bundle', name:'VIP Fan Bundle', category:'exclusive', price_zmw:950, price_usd:49, description:'The full fan package: signed poster + snapback + tee + sticker pack. Ships in branded box.', sizes:['M','L','XL'], tags:['exclusive','limited'], album:null, in_stock:true, stock_count:15 },
  { slug:'heroes-stadium-tee', name:'Heroes Stadium Memorial Tee', category:'exclusive', price_zmw:380, price_usd:20, description:'Commemorating the 2023 Heroes Stadium concert. Print includes date, set list, and crowd art.', sizes:['S','M','L','XL','XXL'], tags:['exclusive','limited'], album:null, in_stock:true, stock_count:50 },
  { slug:'afrima-cap', name:'AFRIMA Winner Edition Cap', category:'exclusive', price_zmw:420, price_usd:22, description:'Celebrating Best Male Artist in Southern Africa, AFRIMA 2025. Gold embroidery.', sizes:null, tags:['exclusive','new'], album:null, in_stock:true, stock_count:30 },
  { slug:'full-bundle-box', name:'Full Merch Bundle Box', category:'exclusive', price_zmw:1200, price_usd:62, description:'Everything. One box. Hoodie, cap, tote, mug, sticker pack, signed poster. The complete set.', sizes:['M','L','XL'], tags:['exclusive'], album:null, in_stock:true, stock_count:10 }
]

export const PRODUCTS = raw.map((p, i) => ({
  _id: p.slug,
  images: [],
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  ...p
}))
