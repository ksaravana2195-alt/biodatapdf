BiodataPDF (Astro + Cloudflare)
Marriage biodata maker with 140 templates (14 categories x 10). 28 free, 112 premium.
`src/lib/templates.js`  template catalogue (palettes, fonts, layouts, frames, symbols, tiers)
`src/lib/render.js`     page renderer (preview, thumbnails and PDF all use it)
`src/lib/symbols.js`    religion/decor SVG symbols
`src/lib/config.js`     prices + Razorpay key id (test key now; swap to rzp_live_ key to go live)
`src/scripts/app.js`    builder UI, cropper, Razorpay checkout, PDF/PNG export
`src/lib/seo-content.js` copy for the 14 category landing pages
Run: `npm install && npm run dev` · Deploy: `npm run deploy`
Before going live with real payments
Unlocks are stored in the visitor's browser (localStorage), so a technical user could bypass them.
For production create Razorpay Orders and verify the signature on the server (Cloudflare Worker)
using your key SECRET (never put the secret in the browser code), and enable auto-capture in the Razorpay dashboard.
