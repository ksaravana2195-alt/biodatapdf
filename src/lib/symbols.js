// SVG symbol library. Every symbol takes explicit colours (no CSS variables / currentColor)
// so that html2canvas can rasterise the inline SVGs correctly when exporting to PDF.

const svg = (inner, size, extra = '') =>
	`<svg class="sym" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true" ${extra}>${inner}</svg>`;

function starPath(cx, cy, r, points = 5) {
	const inner = r * 0.4;
	let d = '';
	for (let i = 0; i < points * 2; i++) {
		const rad = i % 2 === 0 ? r : inner;
		const a = (Math.PI / points) * i - Math.PI / 2;
		d += (i === 0 ? 'M' : 'L') + (cx + rad * Math.cos(a)).toFixed(2) + ' ' + (cy + rad * Math.sin(a)).toFixed(2);
	}
	return d + 'Z';
}

function lotusPetals(c) {
	const petal = 'M50 14 C 63 33 63 58 50 76 C 37 58 37 33 50 14Z';
	let g = '';
	[-66, -33, 33, 66].forEach((a) => {
		g += `<path d="${petal}" transform="rotate(${a} 50 78)" fill="${c}" opacity="0.72"/>`;
	});
	g += `<path d="${petal}" fill="${c}"/>`;
	g += `<path d="M18 80 C 34 92 66 92 82 80 C 66 86 34 86 18 80Z" fill="${c}"/>`;
	return g;
}

export const SYMBOLS = {
	// ---------- Hindu ----------
	swastik: (c, s) =>
		svg(
			`<g fill="none" stroke="${c}" stroke-width="9" stroke-linecap="square"><path d="M50 12V88 M12 50H88 M50 12H74 M88 50V74 M50 88H26 M12 50V26"/></g>` +
				`<g fill="${c}"><circle cx="30" cy="30" r="5"/><circle cx="70" cy="30" r="5"/><circle cx="70" cy="70" r="5"/><circle cx="30" cy="70" r="5"/></g>`,
			s
		),
	lotus: (c, s) => svg(lotusPetals(c), s),
	kalash: (c, s, paper = '#fff') =>
		svg(
			`<path d="M50 40 C 30 36 24 22 30 12 C 40 18 48 28 50 40Z" fill="${c}"/>` +
				`<path d="M50 40 C 70 36 76 22 70 12 C 60 18 52 28 50 40Z" fill="${c}"/>` +
				`<path d="M50 40 C 43 28 45 14 50 4 C 55 14 57 28 50 40Z" fill="${c}"/>` +
				`<circle cx="50" cy="30" r="7" fill="${c}" stroke="${paper}" stroke-width="2"/>` +
				`<rect x="34" y="40" width="32" height="7" rx="3" fill="${c}"/>` +
				`<rect x="39" y="47" width="22" height="7" fill="${c}"/>` +
				`<path d="M39 54 C 20 62 22 86 38 92 H62 C78 86 80 62 61 54 Z" fill="${c}"/>` +
				`<path d="M27 70 H73" stroke="${paper}" stroke-width="2.5" opacity="0.7"/><path d="M30 78 H70" stroke="${paper}" stroke-width="2" opacity="0.5"/>`,
			s
		),
	diya: (c, s) =>
		svg(
			`<path d="M50 58 C 38 44 42 30 50 12 C 58 30 62 44 50 58Z" fill="${c}"/>` +
				`<path d="M10 62 C 18 88 82 88 90 62 Z" fill="${c}"/>` +
				`<path d="M90 62 C 95 60 98 56 99 50" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
				`<rect x="34" y="88" width="32" height="5" rx="2" fill="${c}"/>`,
			s
		),
	mandala: (c, s) => {
		let g = '';
		for (let a = 0; a < 360; a += 30) g += `<ellipse cx="50" cy="22" rx="6" ry="15" fill="${c}" opacity="0.85" transform="rotate(${a} 50 50)"/>`;
		g += `<circle cx="50" cy="50" r="14" fill="none" stroke="${c}" stroke-width="3"/><circle cx="50" cy="50" r="6" fill="${c}"/>`;
		return svg(g, s);
	},
	conch: (c, s, paper = '#fff') =>
		svg(
			`<path d="M22 70 C 8 50 18 22 46 16 C 74 10 92 34 84 58 C 78 76 56 90 36 84 C 28 82 24 76 22 70Z" fill="${c}"/>` +
				`<path d="M30 66 C 24 50 32 34 48 30 C 64 26 74 40 70 54" fill="none" stroke="${paper}" stroke-width="3" opacity="0.8"/>` +
				`<path d="M40 62 C 38 52 44 44 52 44" fill="none" stroke="${paper}" stroke-width="3" opacity="0.8"/>`,
			s
		),

	// ---------- Muslim ----------
	crescent: (c, s) => svg(`<path d="M62 8 A42 42 0 1 0 62 92 A33 33 0 1 1 62 8Z" fill="${c}"/><path d="${starPath(72, 46, 13)}" fill="${c}"/>`, s),
	mosque: (c, s, paper = '#fff') =>
		svg(
			`<path d="M50 8 L52 14 L48 14Z" fill="${c}"/>` +
				`<path d="M28 58 C 28 36 42 30 50 14 C 58 30 72 36 72 58 Z" fill="${c}"/>` +
				`<rect x="24" y="58" width="52" height="30" fill="${c}"/>` +
				`<rect x="10" y="34" width="9" height="54" fill="${c}"/><path d="M8 34 L14.5 18 L21 34Z" fill="${c}"/>` +
				`<rect x="81" y="34" width="9" height="54" fill="${c}"/><path d="M79 34 L85.5 18 L92 34Z" fill="${c}"/>` +
				`<path d="M43 88 V74 A7 7 0 0 1 57 74 V88Z" fill="${paper}"/>`,
			s
		),
	star8: (c, s) =>
		svg(
			`<rect x="20" y="20" width="60" height="60" fill="none" stroke="${c}" stroke-width="6"/><rect x="20" y="20" width="60" height="60" fill="none" stroke="${c}" stroke-width="6" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="8" fill="${c}"/>`,
			s
		),
	lantern: (c, s, paper = '#fff') =>
		svg(
			`<path d="M50 4 V16" stroke="${c}" stroke-width="4"/><path d="M34 22 C 34 14 66 14 66 22Z" fill="${c}"/>` +
				`<path d="M30 24 H70 L74 60 C 74 74 62 84 50 84 C 38 84 26 74 26 60Z" fill="${c}"/>` +
				`<path d="M50 30 C 42 40 42 54 50 64 C 58 54 58 40 50 30Z" fill="${paper}" opacity="0.85"/>` +
				`<rect x="42" y="84" width="16" height="6" fill="${c}"/><circle cx="50" cy="94" r="3" fill="${c}"/>`,
			s
		),

	// ---------- Christian ----------
	cross: (c, s) => svg(`<rect x="43" y="8" width="14" height="84" rx="2" fill="${c}"/><rect x="20" y="30" width="60" height="14" rx="2" fill="${c}"/>`, s),
	rings: (c, s) =>
		svg(`<circle cx="38" cy="56" r="26" fill="none" stroke="${c}" stroke-width="6"/><circle cx="62" cy="56" r="26" fill="none" stroke="${c}" stroke-width="6"/><path d="M50 14 L57 24 L50 32 L43 24Z" fill="${c}"/>`, s),
	dove: (c, s) =>
		svg(
			`<path d="M10 58 C 24 56 34 48 40 38 C 44 30 52 28 60 32 C 64 22 74 16 88 18 C 82 24 80 28 80 34 C 90 32 94 34 96 36 C 88 38 84 42 82 48 C 78 66 62 78 44 76 L30 90 L32 72 C 22 70 14 66 10 58Z" fill="${c}"/>`,
			s
		),
	olive: (c, s) => {
		let g = `<path d="M18 86 C 34 66 52 44 80 14" stroke="${c}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
		const leaf = (x, y, a) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="5.5" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`;
		g += leaf(30, 62, -20) + leaf(38, 72, 40) + leaf(46, 50, -30) + leaf(54, 60, 30) + leaf(62, 36, -40) + leaf(70, 44, 20) + leaf(76, 24, -50);
		return svg(g, s);
	},
	crossfloral: (c, s) => {
		let g = `<rect x="45" y="12" width="10" height="76" fill="${c}"/><rect x="24" y="34" width="52" height="10" fill="${c}"/>`;
		[[50, 12], [50, 88], [24, 39], [76, 39]].forEach(([x, y]) => (g += `<circle cx="${x}" cy="${y}" r="7" fill="${c}"/>`));
		return svg(g, s);
	},

	// ---------- Sikh ----------
	khanda: (c, s) =>
		svg(
			`<path d="M50 4 L58 18 V74 L50 84 L42 74 V18Z" fill="${c}"/>` +
				`<circle cx="50" cy="46" r="23" fill="none" stroke="${c}" stroke-width="6"/>` +
				`<path d="M30 92 C 4 72 4 26 30 6 C 20 34 20 66 30 92Z" fill="${c}"/>` +
				`<path d="M70 92 C 96 72 96 26 70 6 C 80 34 80 66 70 92Z" fill="${c}"/>` +
				`<rect x="40" y="82" width="20" height="5" fill="${c}"/>`,
			s
		),

	// ---------- Jain ----------
	jain: (c, s) =>
		svg(
			`<circle cx="50" cy="8" r="4" fill="${c}"/>` +
				`<path d="M30 24 C 36 14 64 14 70 24 C 62 20 38 20 30 24Z" fill="${c}"/>` +
				`<circle cx="34" cy="34" r="3.5" fill="${c}"/><circle cx="50" cy="34" r="3.5" fill="${c}"/><circle cx="66" cy="34" r="3.5" fill="${c}"/>` +
				`<g transform="translate(22 38) scale(0.56)" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="square"><path d="M50 12V88 M12 50H88 M50 12H74 M88 50V74 M50 88H26 M12 50V26"/></g>`,
			s
		),

	// ---------- Buddhist ----------
	dharma: (c, s) => {
		let g = `<circle cx="50" cy="50" r="40" fill="none" stroke="${c}" stroke-width="6"/><circle cx="50" cy="50" r="9" fill="${c}"/><circle cx="50" cy="50" r="21" fill="none" stroke="${c}" stroke-width="3"/>`;
		for (let a = 0; a < 360; a += 45) {
			g += `<line x1="50" y1="50" x2="50" y2="12" stroke="${c}" stroke-width="4" transform="rotate(${a} 50 50)"/><circle cx="50" cy="8" r="4" fill="${c}" transform="rotate(${a} 50 50)"/>`;
		}
		return svg(g, s);
	},
	bodhi: (c, s) =>
		svg(
			`<path d="M50 94 V58" stroke="${c}" stroke-width="5"/><path d="M50 8 C 30 8 14 24 20 42 C 22 52 34 58 50 58 C 66 58 78 52 80 42 C 86 24 70 8 50 8Z" fill="${c}" opacity="0.9"/><path d="M50 58 C 52 40 48 24 50 12" stroke="#fff" stroke-width="2" opacity="0.6" fill="none"/>`,
			s
		),

	// ---------- Generic ----------
	heart: (c, s) => svg(`<path d="M50 88 C 14 58 8 36 22 22 C 34 12 46 20 50 30 C 54 20 66 12 78 22 C 92 36 86 58 50 88Z" fill="${c}"/>`, s),
	diamond: (c, s) => svg(`<path d="M50 6 L90 50 L50 94 L10 50Z" fill="none" stroke="${c}" stroke-width="6"/><path d="M50 26 L72 50 L50 74 L28 50Z" fill="${c}"/>`, s),
	flower: (c, s) => {
		let g = '';
		for (let a = 0; a < 360; a += 72) g += `<ellipse cx="50" cy="26" rx="13" ry="22" fill="${c}" opacity="0.8" transform="rotate(${a} 50 50)"/>`;
		g += `<circle cx="50" cy="50" r="10" fill="${c}"/>`;
		return svg(g, s);
	},
	crown: (c, s) => svg(`<path d="M10 80 L6 30 L30 52 L50 16 L70 52 L94 30 L90 80Z" fill="${c}"/><rect x="10" y="84" width="80" height="8" rx="2" fill="${c}"/>`, s),
	peacock: (c, s) => {
		let g = `<path d="M50 94 C 44 76 46 60 50 52" stroke="${c}" stroke-width="5" fill="none"/>`;
		for (let a = -60; a <= 60; a += 20) g += `<ellipse cx="50" cy="26" rx="7" ry="20" fill="${c}" opacity="0.85" transform="rotate(${a} 50 56)"/><circle cx="50" cy="12" r="3" fill="#fff" opacity="0.8" transform="rotate(${a} 50 56)"/>`;
		g += `<circle cx="50" cy="58" r="8" fill="${c}"/>`;
		return svg(g, s);
	},
	sun: (c, s) => {
		let g = `<circle cx="50" cy="50" r="16" fill="${c}"/>`;
		for (let a = 0; a < 360; a += 30) g += `<path d="M50 10 L54 26 H46Z" fill="${c}" transform="rotate(${a} 50 50)"/>`;
		return svg(g, s);
	},
};

// Text-glyph symbols (rendered as text so the browser uses the right Indic/Arabic font)
export const TEXT_SYMBOLS = {
	om: { ch: 'ॐ', font: "'Noto Serif Devanagari', serif", scale: 1 },
	ikonkar: { ch: 'ੴ', font: "'Noto Sans Gurmukhi', sans-serif", scale: 1 },
	bismillah: { ch: 'ﷲ', font: "'Amiri', serif", scale: 1.05 },
	khanda_txt: { ch: '☬', font: "'Noto Sans Symbols 2', serif", scale: 1 },
};

export function symbolHtml(name, color, size = 44, paper = '#fff') {
	if (TEXT_SYMBOLS[name]) {
		const t = TEXT_SYMBOLS[name];
		return `<span class="sym sym-txt" style="color:${color};font-family:${t.font};font-size:${Math.round(size * t.scale * 0.95)}px;line-height:${size}px;height:${size}px">${t.ch}</span>`;
	}
	const fn = SYMBOLS[name] || SYMBOLS.flower;
	return fn(color, size, paper);
}

// Decorative divider (line - ornament - line)
export function dividerHtml(variant, color, accent, symbolName, paper) {
	const w = 260;
	const mid = {
		diamond: `<path d="M130 4 L138 12 L130 20 L122 12Z" fill="${accent}"/><circle cx="112" cy="12" r="2.4" fill="${color}"/><circle cx="148" cy="12" r="2.4" fill="${color}"/>`,
		dots: `<circle cx="130" cy="12" r="4" fill="${accent}"/><circle cx="116" cy="12" r="2.4" fill="${color}"/><circle cx="144" cy="12" r="2.4" fill="${color}"/><circle cx="104" cy="12" r="1.6" fill="${color}"/><circle cx="156" cy="12" r="1.6" fill="${color}"/>`,
		wave: `<path d="M96 12 q8 -9 17 0 t17 0 t17 0 t17 0" fill="none" stroke="${accent}" stroke-width="2"/>`,
		star: `<path d="${starPath(130, 12, 9)}" fill="${accent}"/><circle cx="112" cy="12" r="2.4" fill="${color}"/><circle cx="148" cy="12" r="2.4" fill="${color}"/>`,
	}[variant] || '';
	const lines = variant === 'wave' ? '' : `<path d="M10 12 H100 M160 12 H250" stroke="${color}" stroke-width="1.2"/>`;
	const wavelines = variant === 'wave' ? `<path d="M10 12 H92 M168 12 H250" stroke="${color}" stroke-width="1.2"/>` : '';
	return `<svg class="divider" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 24" width="${w}" height="24" aria-hidden="true">${lines}${wavelines}${mid}</svg>`;
}

// Corner ornaments (top-left design; mirrored by CSS for the other corners)
export function cornerHtml(variant, color, accent, size = 74) {
	const inner = {
		curl: `<path d="M4 4 H58 M4 4 V58" stroke="${color}" stroke-width="2.4" fill="none"/><path d="M12 12 C 34 12 44 22 44 44" stroke="${accent}" stroke-width="2" fill="none"/><circle cx="8" cy="8" r="4.5" fill="${accent}"/><circle cx="48" cy="48" r="2.6" fill="${color}"/>`,
		floral: `<path d="M4 4 H50 M4 4 V50" stroke="${color}" stroke-width="2" fill="none"/><g transform="translate(26 26)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-8" rx="4.4" ry="8.5" fill="${accent}" transform="rotate(${a})"/>`).join('')}<circle r="3.4" fill="${color}"/></g>`,
		geo: `<path d="M4 4 H56 V10 H10 V56 H4Z" fill="${color}"/><path d="M18 18 H44 V22 H22 V44 H18Z" fill="${accent}"/><rect x="28" y="28" width="8" height="8" fill="${color}" transform="rotate(45 32 32)"/>`,
		leaf: `<path d="M4 4 C 30 4 52 14 62 40 C 40 36 14 28 4 4Z" fill="${accent}" opacity="0.85"/><path d="M4 4 C 4 30 14 52 40 62 C 36 40 28 14 4 4Z" fill="${color}" opacity="0.85"/><circle cx="10" cy="10" r="4" fill="${color}"/>`,
	}[variant];
	if (!inner) return '';
	return `<svg class="crn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}

// Generic person silhouette placeholder
export function silhouetteHtml(color) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><circle cx="50" cy="38" r="18" fill="${color}" opacity="0.5"/><path d="M12 100 C 12 70 30 60 50 60 C 70 60 88 70 88 100Z" fill="${color}" opacity="0.5"/></svg>`;
}

export const SYMBOL_NAMES = Object.keys(SYMBOLS).concat(Object.keys(TEXT_SYMBOLS));
