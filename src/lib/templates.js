// 14 categories x 10 designs = 140 templates. Every template gets its own combination of
// palette, font pair, layout, frame, section style, photo shape, ornaments and symbols.
import { TIERS } from './config.js';

// ---------- fonts ----------
// h/hw = heading font + weight, b = body font, s = script/display accent font
export const FONT_PAIRS = [
	{ h: 'Playfair Display', hw: 700, b: 'Lora', s: 'Great Vibes' },
	{ h: 'Cormorant Garamond', hw: 700, b: 'Montserrat', s: 'Pinyon Script' },
	{ h: 'Cinzel', hw: 700, b: 'Cormorant Garamond', s: 'Allura' },
	{ h: 'Abril Fatface', hw: 400, b: 'Poppins', s: 'Dancing Script' },
	{ h: 'Marcellus', hw: 400, b: 'Raleway', s: 'Parisienne' },
	{ h: 'DM Serif Display', hw: 400, b: 'Nunito', s: 'Sacramento' },
	{ h: 'Bodoni Moda', hw: 700, b: 'Josefin Sans', s: 'Tangerine' },
	{ h: 'Merriweather', hw: 700, b: 'Lato', s: 'Dancing Script' },
	{ h: 'Rozha One', hw: 400, b: 'Mukta', s: 'Great Vibes' },
	{ h: 'Libre Baskerville', hw: 700, b: 'Raleway', s: 'Allura' },
	{ h: 'Cardo', hw: 700, b: 'Josefin Sans', s: 'Pinyon Script' },
	{ h: 'EB Garamond', hw: 700, b: 'Poppins', s: 'Parisienne' },
	{ h: 'Italiana', hw: 400, b: 'Lato', s: 'Tangerine' },
	{ h: 'Cinzel Decorative', hw: 700, b: 'Cormorant Garamond', s: 'Great Vibes' },
	{ h: 'Philosopher', hw: 700, b: 'Nunito', s: 'Dancing Script' },
	{ h: 'Spectral', hw: 700, b: 'Montserrat', s: 'Sacramento' },
	{ h: 'Crimson Text', hw: 700, b: 'Poppins', s: 'Allura' },
	{ h: 'Alegreya', hw: 700, b: 'Raleway', s: 'Great Vibes' },
	{ h: 'Berkshire Swash', hw: 400, b: 'Lora', s: 'Berkshire Swash' },
	{ h: 'Almendra', hw: 700, b: 'Lato', s: 'Pinyon Script' },
	{ h: 'Outfit', hw: 700, b: 'Outfit', s: 'Dancing Script' },
	{ h: 'Montserrat', hw: 700, b: 'Lora', s: 'Parisienne' },
	{ h: 'Poppins', hw: 600, b: 'Cormorant Garamond', s: 'Allura' },
	{ h: 'Josefin Sans', hw: 700, b: 'Lora', s: 'Sacramento' },
	{ h: 'Raleway', hw: 700, b: 'Merriweather', s: 'Tangerine' },
	{ h: 'Yatra One', hw: 400, b: 'Mukta', s: 'Great Vibes' },
	{ h: 'Tiro Devanagari Hindi', hw: 400, b: 'Mukta', s: 'Pinyon Script' },
	{ h: 'Playfair Display', hw: 700, b: 'Montserrat', s: 'Parisienne' },
	{ h: 'Lora', hw: 700, b: 'Josefin Sans', s: 'Allura' },
	{ h: 'Cormorant Garamond', hw: 700, b: 'Poppins', s: 'Great Vibes' },
];

// Google Fonts families (value = axis string, '' for single-weight fonts)
const FONT_AXES = {
	'Playfair Display': 'wght@400;700', 'Lora': 'wght@400;700', 'Great Vibes': '', 'Cormorant Garamond': 'wght@400;700', 'Montserrat': 'wght@400;600;700',
	'Pinyon Script': '', 'Cinzel': 'wght@400;700', 'Allura': '', 'Abril Fatface': '', 'Poppins': 'wght@400;500;600;700', 'Dancing Script': 'wght@400;700',
	'Marcellus': '', 'Raleway': 'wght@400;600;700', 'Parisienne': '', 'DM Serif Display': '', 'Nunito': 'wght@400;600;700', 'Sacramento': '',
	'Bodoni Moda': 'wght@400;700', 'Josefin Sans': 'wght@400;600;700', 'Tangerine': 'wght@400;700', 'Merriweather': 'wght@400;700', 'Lato': 'wght@400;700',
	'Rozha One': '', 'Mukta': 'wght@400;600;700', 'Libre Baskerville': 'wght@400;700', 'Cardo': 'wght@400;700', 'EB Garamond': 'wght@400;700',
	'Italiana': '', 'Cinzel Decorative': 'wght@400;700', 'Philosopher': 'wght@400;700', 'Spectral': 'wght@400;700', 'Crimson Text': 'wght@400;600;700',
	'Alegreya': 'wght@400;700', 'Berkshire Swash': '', 'Almendra': 'wght@400;700', 'Outfit': 'wght@400;600;700', 'Yatra One': '', 'Tiro Devanagari Hindi': '',
	// script-specific blessing fonts
	'Noto Serif Devanagari': 'wght@400;700', 'Amiri': 'wght@400;700', 'Noto Naskh Arabic': 'wght@400;700', 'Noto Sans Gurmukhi': 'wght@400;700', 'Noto Serif Bengali': 'wght@400;700',
};

export function googleFontsUrl(families = Object.keys(FONT_AXES)) {
	const parts = families.map((f) => 'family=' + f.replace(/ /g, '+') + (FONT_AXES[f] ? ':' + FONT_AXES[f] : ''));
	return 'https://fonts.googleapis.com/css2?' + parts.join('&') + '&display=swap';
}

export function blessingFont(text, headingFont) {
	if (/[\u0900-\u097F]/.test(text)) return 'Noto Serif Devanagari';
	if (/[\u0600-\u06FF\uFB50-\uFDFF]/.test(text)) return 'Amiri';
	if (/[\u0A00-\u0A7F]/.test(text)) return 'Noto Sans Gurmukhi';
	if (/[\u0980-\u09FF]/.test(text)) return 'Noto Serif Bengali';
	return headingFont;
}

// ---------- palettes ----------
const hsl = (h, s, l) => `hsl(${Math.round(((h % 360) + 360) % 360)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
const hsla = (h, s, l, a) => `hsla(${Math.round(((h % 360) + 360) % 360)}, ${Math.round(s)}%, ${Math.round(l)}%, ${a})`;
const ACCENTS = { g: '#c9a13b', c: '#b8693a', s: '#8f9aa8', r: '#c98a80' };
const ACCENTS_DARK = { g: '#e5c15d', c: '#e0905a', s: '#c4ccd6', r: '#e8aaa0' };

export function makePalette({ h, s, l, acc = 'g', dark = false }) {
	if (dark) {
		const pl = Math.min(68, Math.max(52, l + 34));
		const paper = hsl(h, Math.min(s, 30), 9);
		const ink = '#f4ecd8';
		return {
			dark: true, pri: hsl(h, s, pl), priDark: hsl(h, s, Math.min(80, pl + 8)), acc: ACCENTS_DARK[acc] || ACCENTS_DARK.g,
			paper, tint: hsl(h, Math.min(s, 28), 15), ink, mut: hsl(h, 14, 70), on: hsl(h, 35, 10),
			line: hsla(h, 30, 60, 0.35), patt: hsla(h, s, pl, 0.09), paperA: hsla(h, 30, 9, 0.85),
		};
	}
	const sat = Math.max(0, s);
	const lowSat = sat < 14;
	return {
		dark: false, pri: hsl(h, sat, l), priDark: hsl(h, sat, Math.max(8, l - 14)), acc: ACCENTS[acc] || ACCENTS.g,
		paper: hsl(h, lowSat ? 6 : Math.min(55, sat * 0.55), 97), tint: hsl(h, lowSat ? 8 : Math.min(60, sat * 0.6), 93),
		ink: hsl(h, Math.min(sat, 30), 13), mut: hsl(h, Math.min(sat, 14), 38), on: l > 62 ? hsl(h, 40, 12) : '#ffffff',
		line: hsla(h, Math.min(sat, 50), 40, 0.38), patt: hsla(h, sat, l, 0.07), paperA: hsla(h, 30, 97, 0.85),
	};
}

export function hexToHsl(hex) {
	const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
	if (!m) return null;
	const n = parseInt(m[1], 16);
	const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h = 0, s = 0;
	const l = (max + min) / 2;
	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
		else if (max === g) h = (b - r) / d + 2;
		else h = (r - g) / d + 4;
		h *= 60;
	}
	return { h, s: s * 100, l: l * 100 };
}

function hueName({ h, s, l }) {
	if (s < 14) return l < 16 ? 'Onyx' : l < 24 ? 'Graphite' : 'Slate';
	if (l >= 56 && (h >= 300 || h < 20)) return 'Rose';
	if (h >= 340 || h < 10) return l < 32 ? 'Maroon' : 'Ruby';
	if (h < 36) return l < 38 ? 'Copper' : 'Saffron';
	if (h < 66) return l < 36 ? 'Amber' : 'Marigold';
	if (h < 110) return 'Olive';
	if (h < 165) return l < 28 ? 'Forest' : 'Emerald';
	if (h < 195) return 'Teal';
	if (h < 235) return l < 30 ? 'Navy' : 'Sapphire';
	if (h < 290) return 'Amethyst';
	return 'Orchid';
}

// ---------- design option pools ----------
export const LAYOUTS = ['center', 'left', 'right', 'banner', 'side'];
export const FRAMES = ['double', 'gold-inset', 'corners', 'inner-ring', 'dashed', 'dotted', 'bands', 'sidebar', 'arch', 'rounded', 'scallop', 'diamond'];
const SECS = ['bar', 'underline', 'ribbon', 'pill', 'boxed', 'leader', 'edge', 'script'];
const ROWS = ['lines', 'zebra', 'plain', 'tone'];
const PHOTOS = ['rect', 'rounded', 'circle', 'oval', 'arch', 'leaf'];
const PHF = ['ring', 'double', 'shadow', 'solid'];
const DIVS = ['diamond', 'dots', 'wave', 'star'];
const NAMES = ['caps', 'serif', 'script'];
const PATS = ['none', 'dots', 'diag', 'grid', 'vignette', 'chev', 'rings'];
const CORNERS = ['curl', 'floral', 'geo', 'leaf'];
const FRAME_WORDS = ['Heritage', 'Regal', 'Classic', 'Elegance', 'Charm', 'Grace', 'Majesty', 'Bloom', 'Legacy', 'Radiance', 'Haven', 'Aura'];

// ---------- categories ----------
const N = null;
export const CATEGORIES = [
	{
		id: 'hindu', slug: 'hindu-marriage-biodata', name: 'Hindu', religion: 'hindu', icon: '🕉️',
		symbols: ['om', 'swastik', 'kalash', 'lotus', 'diya'],
		greetings: ['॥ श्री गणेशाय नमः ॥', '॥ ॐ नमः शिवाय ॥', '॥ श्री कृष्णाय नमः ॥', '॥ जय श्री राम ॥', '॥ ॐ श्री लक्ष्मी नारायणाय नमः ॥'],
		specs: [[350, 72, 28, 'g'], [26, 92, 46, 'g'], [0, 78, 40, 'g'], [330, 65, 36, 'g'], [270, 45, 32, 'g'], [170, 60, 26, 'g'], [12, 80, 42, 'c'], [40, 80, 38, 'g'], [345, 60, 24, 's'], [200, 50, 28, 'g']],
		dark: [],
	},
	{
		id: 'muslim', slug: 'muslim-marriage-biodata', name: 'Muslim', religion: 'muslim', icon: '☪️',
		symbols: ['crescent', 'mosque', 'star8', 'lantern'],
		greetings: ['بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 'Bismillah hir Rahman nir Raheem', 'ٱلسَّلَامُ عَلَيْكُمْ', 'مَا شَاءَ ٱللَّٰهُ'],
		specs: [[160, 70, 24, 'g'], [210, 60, 24, 'g'], [170, 55, 30, 's'], [140, 50, 26, 'g'], [190, 65, 30, 'g'], [260, 40, 30, 'g'], [0, 0, 18, 'g'], [150, 40, 20, 'g'], [220, 55, 34, 's'], [180, 45, 22, 'c']],
		dark: [6],
	},
	{
		id: 'christian', slug: 'christian-marriage-biodata', name: 'Christian', religion: 'christian', icon: '✝️',
		symbols: ['cross', 'rings', 'dove', 'olive', 'crossfloral'],
		greetings: ['What therefore God hath joined together, let not man put asunder.', 'In the name of the Father, the Son and the Holy Spirit', 'God is Love', 'Love is patient, love is kind'],
		specs: [[215, 55, 28, 's'], [270, 35, 34, 's'], [200, 40, 40, 's'], [350, 30, 34, 's'], [150, 25, 30, 'g'], [30, 35, 36, 'g'], [220, 15, 30, 's'], [300, 25, 32, 's'], [190, 35, 26, 's'], [45, 50, 40, 'g']],
		dark: [],
	},
	{
		id: 'sikh', slug: 'sikh-marriage-biodata', name: 'Sikh', religion: 'sikh', icon: '🪯',
		symbols: ['ikonkar', 'khanda', 'sun', 'flower'],
		greetings: ['ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥', 'ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖ਼ਾਲਸਾ ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਿਹ ॥', 'ੴ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਿਹ'],
		specs: [[215, 80, 34, 'g'], [30, 95, 48, 'g'], [225, 70, 26, 'g'], [48, 90, 46, 's'], [205, 70, 40, 'g'], [0, 0, 20, 'g'], [15, 85, 45, 'g'], [235, 60, 32, 'g'], [190, 70, 30, 'g'], [40, 70, 36, 'g']],
		dark: [],
	},
	{
		id: 'jain', slug: 'jain-marriage-biodata', name: 'Jain', religion: 'jain', icon: '🙏',
		symbols: ['jain', 'lotus', 'mandala', 'diya'],
		greetings: ['॥ णमो अरिहंताणं ॥', '॥ जय जिनेन्द्र ॥', '॥ अहिंसा परमो धर्मः ॥'],
		specs: [[30, 90, 50, 'g'], [0, 70, 42, 'g'], [45, 85, 50, 'c'], [10, 60, 35, 'g'], [140, 45, 30, 'g'], [28, 70, 38, 'c'], [350, 50, 38, 'g'], [200, 50, 36, 's'], [55, 70, 40, 'g'], [20, 80, 40, 'g']],
		dark: [],
	},
	{
		id: 'buddhist', slug: 'buddhist-marriage-biodata', name: 'Buddhist', religion: 'buddhist', icon: '☸️',
		symbols: ['dharma', 'lotus', 'bodhi', 'mandala'],
		greetings: ['॥ नमो बुद्धाय ॥', '॥ बुद्धं शरणं गच्छामि ॥', 'Namo Buddhaya'],
		specs: [[30, 85, 42, 'g'], [350, 60, 28, 'g'], [45, 80, 45, 'g'], [160, 40, 28, 'g'], [20, 70, 35, 'c'], [210, 35, 32, 's'], [280, 35, 32, 'g'], [40, 60, 30, 'g'], [0, 55, 35, 'g'], [100, 30, 28, 'g']],
		dark: [],
	},
	{
		id: 'south-indian', slug: 'south-indian-marriage-biodata', name: 'South Indian', religion: 'hindu', icon: '🪔',
		symbols: ['kalash', 'lotus', 'diya', 'swastik', 'peacock'],
		greetings: ['॥ Sri Ganeshaya Namaha ॥', '॥ Om Namah Shivaya ॥', '॥ Sri Venkateswaraya Namaha ॥', '॥ Om Sri Maha Lakshmyai Namaha ॥'],
		specs: [[140, 55, 24, 'g'], [350, 70, 30, 'g'], [40, 85, 42, 'g'], [170, 70, 26, 'g'], [10, 75, 40, 'g'], [280, 40, 30, 'g'], [200, 60, 30, 'g'], [85, 45, 28, 'g'], [330, 60, 36, 'g'], [25, 80, 38, 'g']],
		dark: [],
	},
	{
		id: 'bengali', slug: 'bengali-marriage-biodata', name: 'Bengali', religion: 'hindu', icon: '🐚',
		symbols: ['conch', 'lotus', 'flower', 'diya'],
		greetings: ['শ্রী শ্রী দুর্গা সহায়', 'শুভ বিবাহ', 'শ্রী শ্রী গণেশায় নমঃ'],
		specs: [[0, 72, 38, 'g'], [350, 60, 30, 'g'], [8, 80, 44, 'g'], [20, 70, 40, 'g'], [340, 55, 34, 'g'], [0, 60, 28, 'g'], [15, 75, 42, 'g'], [355, 70, 46, 'g'], [5, 50, 32, 'g'], [28, 65, 40, 'g']],
		dark: [],
	},
	{
		id: 'royal', slug: 'royal-rajputana-biodata', name: 'Royal & Rajputana', religion: 'hindu', icon: '👑',
		symbols: ['crown', 'peacock', 'mandala', 'lotus', 'sun'],
		greetings: ['॥ श्री गणेशाय नमः ॥', 'Shubh Vivah', '॥ जय श्री राम ॥', 'Marriage Biodata'],
		specs: [[345, 70, 22, 'g'], [230, 50, 22, 'g'], [280, 50, 22, 'g'], [160, 60, 18, 'g'], [20, 60, 24, 'g'], [0, 0, 14, 'g'], [200, 60, 20, 'g'], [320, 55, 26, 'g'], [50, 60, 26, 'g'], [260, 45, 26, 'g']],
		dark: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	},
	{
		id: 'floral', slug: 'floral-wedding-biodata', name: 'Floral & Pastel', religion: 'hindu', icon: '🌸',
		symbols: ['flower', 'lotus', 'heart', 'olive'],
		greetings: ['Shubh Vivah', 'Marriage Biodata', 'With Blessings', 'Biodata for Marriage'],
		specs: [[340, 70, 62, 'r'], [320, 60, 60, 'r'], [10, 75, 64, 'r'], [150, 40, 48, 'r'], [200, 55, 55, 's'], [280, 45, 60, 'r'], [45, 85, 58, 'g'], [170, 45, 44, 'r'], [355, 55, 50, 'r'], [100, 40, 46, 'g']],
		dark: [],
	},
	{
		id: 'modern', slug: 'modern-marriage-biodata', name: 'Modern', religion: 'hindu', icon: '✨',
		symbols: ['rings', 'heart', 'diamond', 'sun'],
		greetings: ['Marriage Biodata', 'Biodata for Marriage', 'Matrimonial Profile', 'Life Partner Search'],
		specs: [[220, 70, 45, 's'], [170, 65, 38, 's'], [260, 60, 52, 's'], [0, 70, 50, 's'], [200, 80, 40, 's'], [330, 70, 50, 's'], [150, 55, 36, 's'], [30, 85, 50, 's'], [240, 40, 30, 's'], [190, 60, 35, 's']],
		dark: [2, 8],
	},
	{
		id: 'professional', slug: 'professional-biodata', name: 'Professional', religion: 'hindu', icon: '💼',
		symbols: ['diamond', 'rings', 'sun', 'flower'],
		greetings: ['Marriage Biodata', 'Matrimonial Profile', 'Biodata for Marriage', 'Personal Profile'],
		specs: [[215, 30, 26, 's'], [200, 15, 30, 's'], [160, 30, 24, 's'], [0, 0, 22, 's'], [230, 40, 32, 's'], [190, 45, 28, 's'], [260, 30, 28, 's'], [10, 40, 32, 's'], [40, 30, 32, 'g'], [210, 60, 30, 's']],
		dark: [3],
	},
	{
		id: 'minimal', slug: 'simple-minimal-biodata', name: 'Simple & Minimal', religion: 'hindu', icon: '▫️',
		symbols: ['diamond', 'flower', 'sun', 'heart'],
		greetings: ['Marriage Biodata', 'Biodata', 'Biodata for Marriage', 'Shubh Vivah'],
		specs: [[0, 0, 12, 's'], [210, 10, 30, 's'], [20, 10, 28, 's'], [160, 15, 26, 's'], [260, 10, 30, 's'], [340, 12, 30, 's'], [40, 12, 30, 'g'], [190, 12, 28, 's'], [120, 10, 26, 's'], [0, 0, 30, 's']],
		dark: [],
	},
	{
		id: 'traditional-gold', slug: 'traditional-gold-biodata', name: 'Traditional Gold', religion: 'hindu', icon: '🪙',
		symbols: ['mandala', 'lotus', 'kalash', 'peacock', 'swastik'],
		greetings: ['॥ श्री गणेशाय नमः ॥', 'Shubh Vivah', '॥ ॐ ॥', 'Marriage Biodata'],
		specs: [[42, 70, 32, 'g'], [38, 80, 28, 'g'], [48, 60, 38, 'g'], [30, 65, 30, 'c'], [50, 50, 26, 'g'], [35, 55, 35, 'g'], [45, 75, 30, 'g'], [25, 60, 30, 'c'], [52, 60, 32, 'g'], [40, 65, 24, 'g']],
		dark: [1],
	},
];

export const TIER_BY_INDEX = ['free', 'free', 'plus', 'plus', 'plus', 'plus', 'pro', 'pro', 'pro', 'royal'];

function build() {
	const list = [];
	CATEGORIES.forEach((cat, c) => {
		for (let i = 0; i < 10; i++) {
			const [h, s, l, acc] = cat.specs[i];
			const spec = { h, s, l, acc, dark: cat.dark.includes(i) };
			const frame = FRAMES[(i * 5 + c * 7) % 12];
			const tier = TIER_BY_INDEX[i];
			const symN = cat.symbols.length;
			const t = {
				id: `${cat.id}-${String(i + 1).padStart(2, '0')}`,
				no: c * 10 + i + 1,
				cat: cat.id,
				religion: cat.religion,
				tier,
				price: TIERS[tier].price,
				premium: tier !== 'free',
				spec,
				layout: LAYOUTS[(i + c) % 5],
				frame,
				corner: CORNERS[(i + c * 2) % 4],
				sec: SECS[(i * 3 + c) % 8],
				rows: ROWS[(i + c) % 4],
				photo: PHOTOS[(i * 5 + c) % 6],
				phf: PHF[(i * 3 + c * 2) % 4],
				divider: DIVS[(i + c * 2) % 4],
				nameStyle: NAMES[(i * 2 + c) % 3],
				pat: PATS[(i * 3 + c * 5) % 7],
				fontIdx: (i * 7 + c * 11) % FONT_PAIRS.length,
				symA: cat.symbols[i % symN],
				symB: cat.symbols[(i + 1 + (c % 2)) % symN],
				greeting: cat.greetings[i % cat.greetings.length],
			};
			t.name = `${hueName(spec)} ${FRAME_WORDS[FRAMES.indexOf(frame)]}`;
			t.catName = cat.name;
			list.push(t);
		}
	});
	return list;
}

export const TEMPLATES = build();
export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id);
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);
export const templatesIn = (catId) => TEMPLATES.filter((t) => t.cat === catId);
export const PREMIUM_COUNT = TEMPLATES.filter((t) => t.premium).length;
