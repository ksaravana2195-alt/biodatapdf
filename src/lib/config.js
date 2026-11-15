// Central site + pricing configuration.
export const SITE = {
	// TODO: put your real support email here (used on Contact, Privacy and Terms pages)
	email: 'support@biodatapdf.com',
	gaId: '', // optional Google Analytics ID, e.g. 'G-XXXXXXXXXX'
	name: 'BiodataPDF',
	domain: 'biodatapdf.com',
	url: 'https://biodatapdf.com',
	tagline: 'Free Marriage Biodata Maker with 140+ Templates',
};

// Brand settings for the checkout window. The key id and secret live in wrangler.json (vars) and
// Cloudflare secrets, NOT here. Prices are enforced on the server (src/pages/api/create-order.js).
export const RAZORPAY = {
	currency: 'INR',
	brand: 'BiodataPDF',
	themeColor: '#be123c',
};

// Fixed template rates (in rupees). Each category has 10 templates: 2 free + 8 premium.
export const TIERS = {
	free: {
		id: 'free',
		label: 'Free',
		price: 0,
		blurb: 'Clean design, A4 PDF, small credit line',
		features: ['A4 PDF download', 'Photo crop & upload', 'WhatsApp PNG export'],
	},
	plus: {
		id: 'plus',
		label: 'Premium Plus',
		price: 49,
		blurb: 'Designer layout without watermark',
		features: ['No credit line', 'Ultra-HD 300 DPI PDF', 'Custom colour theme', 'Switch font style', 'Change blessing symbol'],
	},
	pro: {
		id: 'pro',
		label: 'Premium Pro',
		price: 99,
		blurb: 'Everything in Plus + photo gallery page',
		features: ['Everything in Plus', '3-photo gallery page', 'Kundli / horoscope page', 'Extra “About me” & hobbies'],
	},
	royal: {
		id: 'royal',
		label: 'Royal Collection',
		price: 149,
		blurb: 'Luxury cover page + gallery + kundli',
		features: ['Everything in Pro', 'Full-page luxury cover with big photo', 'Gold foil style headings', 'Priority new-template access'],
	},
};

export const ALL_ACCESS = { id: 'all', label: 'All-Access Pass', price: 499, blurb: 'Unlock every premium template on this device, forever' };

export const STORAGE_KEYS = { unlocks: 'bdp_unlocks_v2', draft: 'bdp_draft_v1' };
