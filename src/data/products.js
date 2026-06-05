// Static product catalogue for DEMO mode (no backend). Mirrors server/data/seed.js.
// _id is set to the slug so cart keys, routing, and order items all work offline.

import vovTee from '../../assets/images/products/vov-tee.png'
import vovMug from '../../assets/images/products/vov-mug.png'
import ymCap from '../../assets/images/products/ym-cap.png'
import finallyTee from '../../assets/images/products/finally-tee.png'
import komandoHoodie from '../../assets/images/products/kommando-heavy-wheight.png'
import bucketF from '../../assets/images/products/vov-bucket-hat-f.png'
import bucketB from '../../assets/images/products/vov-bucket-hat-b.png'
import tote from '../../assets/images/products/vov-tote.png'
import backpackF from '../../assets/images/products/ym-backpack-f.png'
import backpackB from '../../assets/images/products/ym-backpack-b.png'
import beanie from '../../assets/images/products/ym-beanie.png'
import mrRomantic from '../../assets/images/products/mr-romantic-hoodie.png'
import oliosCap from '../../assets/images/products/olios-dads-cap.png'
import zipUp from '../../assets/images/products/ym-zip-up.png'

// Product photos (others fall back to the generated SVG)
const IMAGES = {
  'vibes-on-vibes-tee':      [vovTee],
  'finally-anniversary-tee': [finallyTee],
  'mr-romantic-hoodie':      [mrRomantic],
  'komando-hoodie':          [komandoHoodie],
  'yo-maps-zip-jacket':      [zipUp],
  'maps-signature-snapback': [ymCap],
  'olios-dad-cap':           [oliosCap],
  'vibes-bucket-hat':        [bucketF, bucketB],
  'ym-tote-bag':             [tote],
  'maps-backpack':           [backpackF, backpackB],
  'ym-beanie':               [beanie],
  'ym-logo-mug':             [vovMug]
}

// Tiny blurred placeholders (base64) for instant blur-up loading.
const lqipModules = import.meta.glob('../../assets/images/products/*.png', {
  eager: true,
  query: '?w=24&format=webp&inline',
  import: 'default'
})
const lqip = (file) => lqipModules[`../../assets/images/products/${file}`]

const LQIP = {
  'vibes-on-vibes-tee':      lqip('vov-tee.png'),
  'finally-anniversary-tee': lqip('finally-tee.png'),
  'mr-romantic-hoodie':      lqip('mr-romantic-hoodie.png'),
  'komando-hoodie':          lqip('kommando-heavy-wheight.png'),
  'yo-maps-zip-jacket':      lqip('ym-zip-up.png'),
  'maps-signature-snapback': lqip('ym-cap.png'),
  'olios-dad-cap':           lqip('olios-dads-cap.png'),
  'vibes-bucket-hat':        lqip('vov-bucket-hat-f.png'),
  'ym-tote-bag':             lqip('vov-tote.png'),
  'maps-backpack':           lqip('ym-backpack-f.png'),
  'ym-beanie':               lqip('ym-beanie.png'),
  'ym-logo-mug':             lqip('vov-mug.png')
}

const raw = [
  { slug:'maps-signature-snapback', name:'Maps Signature Snapback', category:'headwear', price_zmw:180, price_usd:9, description:'Six-panel snapback. Embroidered gold YM logo. One size fits all.', sizes:null, tags:['best-seller'], album:null, in_stock:true, stock_count:90 },
  // APPAREL
  { slug:'vibes-on-vibes-tee', name:'Vibes on Vibes Tee', category:'apparel', price_zmw:250, price_usd:13, description:'Drop-shoulder tee from the Vibes on Vibes album era. 100% heavyweight cotton. Gold YM monogram print.', sizes:['S','M','L','XL','XXL'], tags:['new'], album:'Vibes on Vibes', in_stock:true, stock_count:80 },
  { slug:'finally-anniversary-tee', name:'Finally Anniversary Tee', category:'apparel', price_zmw:230, price_usd:12, description:'Celebrating the song that started it all. Limited anniversary reprint.', sizes:['S','M','L','XL','XXL'], tags:['best-seller'], album:'Finally', in_stock:true, stock_count:60 },
  { slug:'olios-records-tee', name:'Olios Records Tee', category:'apparel', price_zmw:220, price_usd:11, description:'Represent the label. Clean Olios Records wordmark on premium cotton.', sizes:['S','M','L','XL','XXL'], tags:[], album:'Olios Records', in_stock:true, stock_count:100 },
  { slug:'mr-romantic-hoodie', name:'Mr Romantic Hoodie', category:'apparel', price_zmw:420, price_usd:22, description:"Heavy-knit pullover hoodie. Inspired by Boomplay's most-streamed Zambian song of 2022.", sizes:['S','M','L','XL','XXL'], tags:['best-seller'], album:'My Hero', in_stock:true, stock_count:45 },
  { slug:'komando-hoodie', name:'Komando Heavyweight Hoodie', category:'apparel', price_zmw:450, price_usd:23, description:'Inspired by the debut album. 400gsm fleece. Embroidered logo.', sizes:['S','M','L','XL','XXL'], tags:[], album:'Komando', in_stock:true, stock_count:35 },
  { slug:'yo-maps-zip-jacket', name:'Yo Maps Zip-Up Jacket', category:'apparel', price_zmw:550, price_usd:28, description:'Full-zip track jacket. Gold zipper, contrast YM side stripe.', sizes:['S','M','L','XL','XXL'], tags:['new'], album:null, in_stock:true, stock_count:30 },
  // HEADWEAR
  { slug:'olios-dad-cap', name:'Olios Records Dad Cap', category:'headwear', price_zmw:160, price_usd:8, description:'Unstructured low-profile cap. Washed cotton. Adjustable strap.', sizes:null, tags:[], album:'Olios Records', in_stock:true, stock_count:70 },
  { slug:'vibes-bucket-hat', name:'Vibes on Vibes Bucket Hat', category:'headwear', price_zmw:190, price_usd:10, description:'Double-sided bucket hat. Vibes on Vibes text on one side, YM monogram reverse.', sizes:null, tags:['new'], album:'Vibes on Vibes', in_stock:true, stock_count:50 },
  { slug:'ym-beanie', name:'YM Logo Beanie', category:'headwear', price_zmw:150, price_usd:8, description:'Slouch-fit ribbed knit beanie. Embroidered YM. Zambia-ready warmth.', sizes:null, tags:[], album:null, in_stock:true, stock_count:60 },
  // ACCESSORIES
  { slug:'ym-tote-bag', name:'YM Tote Bag', category:'accessories', price_zmw:170, price_usd:9, description:'Heavy-duty canvas tote. YM monogram screen print. 15L capacity.', sizes:null, tags:['new'], album:null, in_stock:true, stock_count:80 },
  { slug:'maps-backpack', name:'Maps Logo Backpack', category:'accessories', price_zmw:480, price_usd:25, description:'Water-resistant backpack. Padded laptop sleeve. Embossed YM badge.', sizes:null, tags:[], album:null, in_stock:true, stock_count:25 },
  // LIFESTYLE
  { slug:'ym-logo-mug', name:'YM Logo Mug', category:'lifestyle', price_zmw:120, price_usd:6, description:'350ml ceramic mug. Gold YM logo. Dishwasher safe. Morning energy.', sizes:null, tags:[], album:null, in_stock:true, stock_count:100 },
  { slug:'vibes-phone-case', name:'Vibes on Vibes Phone Case', category:'lifestyle', price_zmw:140, price_usd:7, description:'Matte black hardshell case. Compatible with iPhone 14–16 and Samsung S-series.', sizes:null, tags:['new'], album:'Vibes on Vibes', in_stock:true, stock_count:80 },
  { slug:'sticker-pack', name:'Sticker Pack (6pc)', category:'lifestyle', price_zmw:60, price_usd:3, description:'Six die-cut vinyl stickers. Waterproof. YM logos, album art, Zambia flag detail.', sizes:null, tags:[], album:null, in_stock:true, stock_count:200 },
  { slug:'ym-notebook', name:'Notebook — Maps Edition', category:'lifestyle', price_zmw:110, price_usd:6, description:'A5 hardcover notebook. 200 pages, gold-ruled. YM logo embossed on cover.', sizes:null, tags:[], album:null, in_stock:true, stock_count:90 }
]

export const PRODUCTS = raw.map((p, i) => ({
  _id: p.slug,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  ...p,
  images: IMAGES[p.slug] || [],
  lqip: LQIP[p.slug] || null
}))
