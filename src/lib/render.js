// Render engine: turns (template + form data) into A4 page HTML (794 x 1123 px at 96 dpi).
// The same HTML is used for the live preview, the gallery thumbnails and the PDF export.
import { symbolHtml, dividerHtml, cornerHtml, silhouetteHtml } from './symbols.js';
import { FONT_PAIRS, makePalette, hexToHsl, blessingFont } from './templates.js';
import { FIELDS, faithSetFor, ageFromDob } from './schema.js';

export const PAGE_W = 794;
export const PAGE_H = 1123;

export const esc = (s) =>
	String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const FIELD = Object.fromEntries(FIELDS.map((f) => [f.k, f]));
const val = (d, k) => String(d?.[k] ?? '').trim();

export function resolveStyle(tpl, custom) {
	const spec = { ...tpl.spec };
	if (custom?.color) {
		const c = hexToHsl(custom.color);
		if (c) {
			spec.h = c.h;
			spec.s = Math.max(c.s, 12);
			spec.l = Math.min(58, Math.max(18, c.l));
		}
	}
	const pal = makePalette(spec);
	const font = FONT_PAIRS[custom?.fontIdx ?? tpl.fontIdx];
	return { pal, font, symA: custom?.symA || tpl.symA, symB: custom?.symB || tpl.symB };
}

function cssVars(pal, font, greetFont) {
	return (
		`--pri:${pal.pri};--priD:${pal.priDark};--acc:${pal.acc};--paper:${pal.paper};--tint:${pal.tint};--ink:${pal.ink};--mut:${pal.mut};--on:${pal.on};--line:${pal.line};--patt:${pal.patt};` +
		`--hf:'${font.h}';--hw:${font.hw};--bf:'${font.b}';--sf:'${font.s}';--gf:'${greetFont}';`
	);
}

// ---------- data -> sections ----------
function rowsFor(keys, data, labels = {}) {
	return keys
		.map((k) => [labels[k] || FIELD[k]?.label || k, val(data, k)])
		.filter(([, v]) => v);
}

export function buildSections(tpl, data, { withAbout }) {
	const fs = faithSetFor(tpl.religion);
	const personalKeys = ['dob', 'tob', 'pob', 'height', 'complexion', 'blood', 'marital', 'tongue', 'diet'];
	if (withAbout) personalKeys.push('hobbies');
	const secs = [
		{ id: 'personal', title: 'Personal Details', rows: rowsFor(personalKeys, data) },
		{ id: 'faith', title: fs.title, rows: rowsFor(fs.keys, data, fs.labels) },
		{ id: 'career', title: 'Education & Career', rows: rowsFor(['education', 'college', 'occupation', 'company', 'workLocation', 'income'], data) },
		{ id: 'family', title: 'Family Details', rows: rowsFor(['father', 'mother', 'siblings', 'familyValues', 'native', 'maternal'], data) },
		{ id: 'contact', title: 'Contact Details', rows: rowsFor(['contactPerson', 'phone', 'email', 'address'], data) },
	];
	return secs.filter((s) => s.rows.length);
}

function sectionHtml(s) {
	return (
		`<section class="sec sec-${s.id}"><h3 class="sec-h"><span>${esc(s.title)}</span></h3><div class="rows">` +
		s.rows.map(([l, v]) => `<div class="row"><b>${esc(l)}</b><span>${esc(v)}</span></div>`).join('') +
		`</div></section>`
	);
}

function paraHtml(title, text) {
	if (!text) return '';
	return `<section class="sec para"><h3 class="sec-h"><span>${esc(title)}</span></h3><p>${esc(text)}</p></section>`;
}

function splitColumns(secs) {
	const cols = [[], []];
	const w = [0, 0];
	secs.forEach((s) => {
		const i = w[0] <= w[1] ? 0 : 1;
		cols[i].push(s);
		w[i] += s.rows.length + 2.5;
	});
	return cols;
}

// ---------- pieces ----------
function factsList(data) {
	const age = ageFromDob(data.dob);
	const out = [];
	if (age) out.push(['Age', `${age} Yrs`]);
	if (val(data, 'height')) out.push(['Height', val(data, 'height').replace(/\s*\(.*\)/, '')]);
	if (val(data, 'education')) out.push(['Education', val(data, 'education').split(/ & | and |,/)[0]]);
	if (val(data, 'occupation')) out.push(['Profession', val(data, 'occupation')]);
	return out;
}

function factsHtml(data) {
	const f = factsList(data);
	if (!f.length) return '';
	return `<div class="facts">${f.map(([k, v]) => `<span><b>${esc(k)}:</b> ${esc(v)}</span>`).join('')}</div>`;
}

function photoHtml(tpl, st, data, opts, extraClass = '') {
	const shape = extraClass.includes('big') ? 'arch' : tpl.photo;
	let inner;
	if (data.photo) {
		inner = `<div class="ph-in" style="background-image:url('${data.photo}')"></div>`;
	} else if (opts.preview) {
		inner = `<div class="ph-in ph-empty">${silhouetteHtml(st.pal.pri)}<span class="ph-hint">Upload your photo</span></div>`;
	} else {
		inner = `<div class="ph-in ph-empty ph-medal">${symbolHtml(st.symA, st.pal.pri, 72, st.pal.paper)}</div>`;
	}
	return `<div class="ph ph-${shape} phf-${tpl.phf} ${extraClass}">${inner}</div>`;
}

function blessingHtml(tpl, st, data, col) {
	const text = val(data, 'greeting') || tpl.greeting;
	const long = text.length > 34;
	const A = symbolHtml(st.symA, col, long ? 46 : 52, st.pal.paper);
	const B = symbolHtml(st.symB, col, long ? 46 : 52, st.pal.paper);
	const g = `<span class="greet${long ? ' greet-long' : ''}">${esc(text)}</span>`;
	return long ? `<div class="bless bless-col">${A}${g}</div>` : `<div class="bless">${A}${g}${B}</div>`;
}

function nameHtml(data) {
	return `<h1 class="nm">${esc(val(data, 'name') || 'Your Name')}</h1>`;
}

function subtitle(tpl, data) {
	const g = val(data, 'gender');
	return `<div class="sub">${g === 'Female' ? 'Bride' : g === 'Male' ? 'Groom' : ''} Marriage Biodata</div>`;
}

function dividerFor(tpl, st, col) {
	return dividerHtml(tpl.divider, col || st.pal.pri, st.pal.acc, tpl.symA, st.pal.paper);
}

const CORNER_FRAMES = ['corners', 'diamond', 'double', 'gold-inset', 'inner-ring', 'dashed', 'rounded'];

function shell(tpl, st, data, inner, opts, layoutClass, extraAttr = '') {
	const greeting = val(data, 'greeting') || tpl.greeting;
	const gf = blessingFont(greeting, st.font.h);
	const showCorners = CORNER_FRAMES.includes(tpl.frame);
	const crn = showCorners ? cornerHtml(tpl.corner, st.pal.pri, st.pal.acc, 76) : '';
	const corners = crn ? `<div class="crns"><div class="crn c1">${crn}</div><div class="crn c2">${crn}</div><div class="crn c3">${crn}</div><div class="crn c4">${crn}</div></div>` : '';
	const wm = opts.watermark
		? `<div class="wm"><div class="wm-a">PREMIUM DEMO</div><div class="wm-b">biodatapdf.com • Unlock to remove</div></div>`
		: '';
	return (
		`<div class="bd l-${layoutClass} f-${tpl.frame} s-${tpl.sec} r-${tpl.rows} n-${tpl.nameStyle} pt-${tpl.pat}${st.pal.dark ? ' is-dark' : ''}" style="${cssVars(st.pal, st.font, gf)}" ${extraAttr}>` +
		`<div class="bd-bg"></div><div class="bd-frame"></div>${corners}` +
		inner +
		wm +
		`</div>`
	);
}

const credit = (opts) => (opts.credit ? `<div class="foot">Created free at biodatapdf.com</div>` : `<div class="foot foot-clean"></div>`);

// ---------- main page ----------
function mainPage(tpl, st, data, opts) {
	const withAbout = !opts.hasExtras;
	const secs = buildSections(tpl, data, { withAbout });
	const pri = st.pal.pri;
	const expect = paraHtml('Partner Expectations', val(data, 'expectations'));
	const about = withAbout ? paraHtml('About Me', val(data, 'about')) : '';

	if (tpl.layout === 'side') {
		const contact = secs.find((s) => s.id === 'contact');
		const mainSecs = secs.filter((s) => s.id !== 'contact');
		const facts = factsList(data);
		const inner =
			`<div class="bd-in"><div class="side-wrap">` +
			`<aside class="side" data-fit>` +
			blessingHtml(tpl, st, data, st.pal.on) +
			photoHtml(tpl, st, data, opts) +
			`<h1 class="nm">${esc(val(data, 'name') || 'Your Name')}</h1>` +
			subtitle(tpl, data) +
			`<div class="side-facts">${facts.map(([k, v]) => `<div><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}</div>` +
			(contact ? sectionHtml(contact) : '') +
			`</aside>` +
			`<div class="main" data-fit>${mainSecs.map(sectionHtml).join('')}${about}${expect}${credit(opts)}</div>` +
			`</div></div>`;
		return shell(tpl, st, data, inner, opts, 'side');
	}

	const [c1, c2] = splitColumns(secs);
	const cols = `<div class="cols"><div class="col">${c1.map(sectionHtml).join('')}</div><div class="col">${c2.map(sectionHtml).join('')}</div></div>`;
	const lower = `<div class="lower">${about}${expect}</div>`;

	let header;
	if (tpl.layout === 'center') {
		header =
			`<header class="hd hd-center">` +
			blessingHtml(tpl, st, data, pri) +
			nameHtml(data) +
			subtitle(tpl, data) +
			dividerFor(tpl, st) +
			`<div class="ph-wrap">${photoHtml(tpl, st, data, opts)}</div>` +
			factsHtml(data) +
			`</header>`;
	} else if (tpl.layout === 'left' || tpl.layout === 'right') {
		header =
			`<header class="hd hd-row">` +
			photoHtml(tpl, st, data, opts) +
			`<div class="hd-text">` +
			blessingHtml(tpl, st, data, pri) +
			nameHtml(data) +
			subtitle(tpl, data) +
			dividerFor(tpl, st) +
			factsHtml(data) +
			`</div></header>`;
	} else {
		// banner
		header =
			`<header class="hd hd-banner"><div class="banner">` +
			blessingHtml(tpl, st, data, st.pal.on) +
			nameHtml(data) +
			subtitle(tpl, data) +
			`</div>` +
			`<div class="ph-wrap">${photoHtml(tpl, st, data, opts)}</div>` +
			factsHtml(data) +
			`</header>`;
	}

	const inner = `<div class="bd-in" data-fit>${header}${cols}${lower}${credit(opts)}</div>`;
	return shell(tpl, st, data, inner, opts, tpl.layout);
}

// ---------- royal cover page ----------
function coverPage(tpl, st, data, opts) {
	const pri = st.pal.pri;
	const inner =
		`<div class="bd-in" data-fit>` +
		blessingHtml(tpl, st, data, pri) +
		`<div class="cover-ph">${photoHtml(tpl, st, data, opts, 'big')}</div>` +
		nameHtml(data) +
		dividerFor(tpl, st) +
		subtitle(tpl, data) +
		factsHtml(data) +
		`<div class="cover-note">Profile details on the next page</div>` +
		`</div>`;
	return shell(tpl, st, data, inner, opts, 'cover');
}

// ---------- extra page (gallery / kundli / about) ----------
function extraPage(tpl, st, data, opts) {
	const g = (data.gallery || []).filter(Boolean).slice(0, 3);
	const gal = g.length
		? `<section class="sec"><h3 class="sec-h"><span>Photo Gallery</span></h3><div class="gal gal-${g.length}">${g
				.map((src, i) => `<div class="g g${i + 1}" style="background-image:url('${src}')"></div>`)
				.join('')}</div></section>`
		: '';
	const kundli = data.kundli
		? `<section class="sec"><h3 class="sec-h"><span>Kundli / Horoscope</span></h3><div class="kundli" style="background-image:url('${data.kundli}')"></div></section>`
		: '';
	const inner =
		`<div class="bd-in" data-fit>` +
		`<header class="hd hd-mini">${symbolHtml(st.symA, st.pal.pri, 34, st.pal.paper)}<span class="mini-name">${esc(val(data, 'name') || 'Your Name')}</span>${symbolHtml(st.symB, st.pal.pri, 34, st.pal.paper)}</header>` +
		gal +
		kundli +
		paraHtml('About Me', val(data, 'about')) +
		paraHtml('Hobbies & Interests', val(data, 'hobbies')) +
		credit(opts) +
		`</div>`;
	return shell(tpl, st, data, inner, opts, 'extra');
}

/**
 * Build all pages for a template.
 * opts: { preview, custom, features, watermark, credit }
 *  - features: premium features active (demo or unlocked)
 */
export function buildPages(tpl, data, opts = {}) {
	const st = resolveStyle(tpl, opts.features ? opts.custom : null);
	const proTier = tpl.tier === 'pro' || tpl.tier === 'royal';
	const hasExtras = !!(opts.features && proTier && ((data.gallery || []).some(Boolean) || data.kundli));
	const o = { ...opts, hasExtras, credit: opts.credit ?? !tpl.premium };
	const pages = [];
	if (opts.features && tpl.tier === 'royal') pages.push(coverPage(tpl, st, data, o));
	pages.push(mainPage(tpl, st, data, o));
	if (hasExtras) pages.push(extraPage(tpl, st, data, o));
	return pages;
}

// Shrink the page font until nothing overflows its box (keeps every biodata on one A4 page)
export function fitPage(bd) {
	const nodes = [...bd.querySelectorAll('[data-fit]')];
	let fs = 15;
	bd.style.setProperty('--fs', fs + 'px');
	const over = () => nodes.some((n) => n.scrollHeight > n.clientHeight + 1);
	while (fs > 8.5 && over()) {
		fs -= 0.25;
		bd.style.setProperty('--fs', fs + 'px');
	}
	return fs;
}

// Fonts that must be loaded before rasterising (so the PDF never falls back to a default font)
export function fontsNeeded(tpl, data, custom) {
	const st = resolveStyle(tpl, custom);
	const greeting = String(data?.greeting || '').trim() || tpl.greeting;
	const list = new Set([st.font.h, st.font.b, st.font.s, blessingFont(greeting, st.font.h), 'Noto Serif Devanagari', 'Noto Sans Gurmukhi']);
	return [...list];
}
