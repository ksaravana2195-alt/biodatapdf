import { TEMPLATES, CATEGORIES, FONT_PAIRS, getTemplate, getCategory, templatesIn, PREMIUM_COUNT } from '../lib/templates.js';
import { buildPages, fitPage, fontsNeeded, PAGE_W, PAGE_H, esc } from '../lib/render.js';
import { SECTIONS, FIELDS, faithSetFor, sampleFor } from '../lib/schema.js';
import { TIERS, ALL_ACCESS, RAZORPAY, STORAGE_KEYS } from '../lib/config.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = $('#bdApp');
if (root) init();

function init() {
	// ------------------------------------------------------------------ state
	const initialCat = root.dataset.cat || 'hindu';
	const startTpl = templatesIn(initialCat).find((t) => !t.premium) || TEMPLATES[0];
	const state = {
		tplId: startTpl.id,
		data: sampleFor(getCategory(startTpl.cat).religion, 'Male'),
		dirty: false,
		custom: {},
		tab: 'personal',
		zoom: 1,
		filter: { cat: 'all', tier: 'all', q: '' },
	};
	state.data.photo = '';
	state.data.gallery = [];
	state.data.kundli = '';

	const tpl = () => getTemplate(state.tplId);
	const cat = () => getCategory(tpl().cat);

	// ------------------------------------------------------------------ unlocks
	const loadUnlocks = () => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEYS.unlocks)) || { all: '', ids: {} };
		} catch {
			return { all: '', ids: {} };
		}
	};
	let unlocks = loadUnlocks();
	const saveUnlocks = () => {
		try {
			localStorage.setItem(STORAGE_KEYS.unlocks, JSON.stringify(unlocks));
		} catch {}
	};
	const isUnlocked = (t) => !t.premium || !!unlocks.all || !!unlocks.ids[t.id];
	const tokensFor = (t) => [unlocks.all, unlocks.ids[t.id]].filter(Boolean);
	async function api(path, body) {
		const res = await fetch('/api/' + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
		const data = await res.json().catch(() => ({}));
		if (!res.ok) throw new Error(data.error || 'Request failed');
		return data;
	}
	function storeToken(kind, tplId, token) {
		if (kind === 'all') unlocks.all = token;
		else unlocks.ids[tplId] = token;
		saveUnlocks();
	}
	// Drop any stored unlock the server does not recognise (edited / fake tokens)
	async function validateStored() {
		const all = [unlocks.all, ...Object.values(unlocks.ids)].filter(Boolean);
		if (!all.length) return;
		try {
			const { valid } = await api('check', { tokens: all });
			const ok = new Set(valid.map((v) => v.token));
			if (unlocks.all && !ok.has(unlocks.all)) unlocks.all = '';
			Object.keys(unlocks.ids).forEach((k) => !ok.has(unlocks.ids[k]) && delete unlocks.ids[k]);
			saveUnlocks();
			renderBar();
			renderPreview();
		} catch {}
	}
	// Final gate right before a premium download: the server must confirm the unlock
	async function serverConfirms(t) {
		try {
			const { valid } = await api('check', { tokens: tokensFor(t) });
			return valid.some((v) => v.k === 'all' || v.t === t.id);
		} catch {
			return false;
		}
	}
	const featuresOn = (t) => t.premium; // demo or unlocked: all premium features usable
	const demoMode = (t) => t.premium && !isUnlocked(t);

	// ------------------------------------------------------------------ helpers
	let toastTimer;
	function toast(msg, ms = 3200) {
		const el = $('#toast');
		el.textContent = msg;
		el.classList.add('show');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => el.classList.remove('show'), ms);
	}
	const scriptCache = {};
	function loadScript(src) {
		if (scriptCache[src]) return scriptCache[src];
		scriptCache[src] = new Promise((res, rej) => {
			const s = document.createElement('script');
			s.src = src;
			s.async = true;
			s.onload = res;
			s.onerror = () => {
				delete scriptCache[src];
				rej(new Error('Could not load ' + src));
			};
			document.head.appendChild(s);
		});
		return scriptCache[src];
	}
	function loadCss(href) {
		if ($(`link[href="${href}"]`)) return;
		const l = document.createElement('link');
		l.rel = 'stylesheet';
		l.href = href;
		document.head.appendChild(l);
	}
	const debounce = (fn, ms) => {
		let t;
		return (...a) => {
			clearTimeout(t);
			t = setTimeout(() => fn(...a), ms);
		};
	};

	function resizeImage(file, maxSide, quality = 0.9) {
		return new Promise((resolve, reject) => {
			const r = new FileReader();
			r.onerror = reject;
			r.onload = () => {
				const img = new Image();
				img.onerror = reject;
				img.onload = () => {
					const k = Math.min(1, maxSide / Math.max(img.width, img.height));
					const c = document.createElement('canvas');
					c.width = Math.round(img.width * k);
					c.height = Math.round(img.height * k);
					c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
					resolve(c.toDataURL('image/jpeg', quality));
				};
				img.src = r.result;
			};
			r.readAsDataURL(file);
		});
	}

	// ------------------------------------------------------------------ form
	const tabs = [
		...SECTIONS.map((s) => ({ id: s.id, label: s.tab, icon: s.icon })),
		{ id: 'photos', label: 'Photos', icon: '📸' },
		{ id: 'style', label: 'Style', icon: '🎨' },
	];

	function fieldHtml(f, labelOverride) {
		const id = 'f_' + f.k;
		const v = esc(state.data[f.k] ?? '');
		const label = esc(labelOverride || f.label);
		const hint = f.hint ? `<span class="hint">${esc(f.hint)}</span>` : '';
		let input;
		if (f.type === 'select') input = `<select id="${id}" data-k="${f.k}">${f.options.map((o) => `<option${state.data[f.k] === o ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
		else if (f.type === 'textarea') input = `<textarea id="${id}" data-k="${f.k}" rows="3">${v}</textarea>`;
		else input = `<input type="text" id="${id}" data-k="${f.k}" value="${v}" ${f.k === 'greeting' ? `placeholder="${esc(tpl().greeting)}"` : ''} autocomplete="off">`;
		return `<label class="fld${f.wide ? ' wide' : ''}" for="${id}"><span>${label}</span>${input}${hint}</label>`;
	}

	function renderTabs() {
		$('#tabBar').innerHTML = tabs
			.map((t) => `<button type="button" role="tab" class="tab${state.tab === t.id ? ' on' : ''}" data-tab="${t.id}" aria-selected="${state.tab === t.id}"><span aria-hidden="true">${t.icon}</span>${t.label}</button>`)
			.join('');
	}

	function renderFields() {
		const t = tpl();
		const host = $('#tabBody');
		if (state.tab === 'photos') return renderPhotos(host, t);
		if (state.tab === 'style') return renderStyle(host, t);
		let fields = FIELDS.filter((f) => f.sec === state.tab || (state.tab === 'personal' && f.sec === 'header'));
		let html = '';
		if (state.tab === 'faith') {
			const fs = faithSetFor(t.religion);
			html += `<p class="tab-note">Fields shown here follow the <b>${esc(cat().name)}</b> template style. Leave any field empty and it will not appear in your PDF.</p>`;
			html += '<div class="grid2">' + fs.keys.map((k) => fieldHtml(FIELDS.find((f) => f.k === k), fs.labels[k])).join('') + '</div>';
		} else {
			html += '<div class="grid2">' + fields.map((f) => fieldHtml(f)).join('') + '</div>';
		}
		host.innerHTML = html;
	}

	function renderPhotos(host, t) {
		const pro = t.tier === 'pro' || t.tier === 'royal';
		const d = state.data;
		const slot = (i) =>
			`<div class="slot">${d.gallery[i] ? `<img src="${d.gallery[i]}" alt="Gallery photo ${i + 1}">` : '<span>+</span>'}<div class="slot-btns"><button type="button" class="btn sm" data-gal="${i}">${d.gallery[i] ? 'Change' : 'Add photo'}</button>${d.gallery[i] ? `<button type="button" class="link" data-galdel="${i}">Remove</button>` : ''}</div></div>`;
		host.innerHTML =
			`<div class="card-in"><h4>Main photograph</h4><p class="muted">Shown large and clear on your biodata. Crop to the shape your template uses.</p>` +
			`<div class="photo-row"><div class="photo-thumb">${d.photo ? `<img src="${d.photo}" alt="Your photo">` : '<span>📷</span>'}</div><div class="stack">` +
			`<button type="button" class="btn primary" id="btnPhoto">${d.photo ? 'Change & re-crop photo' : 'Upload & crop photo'}</button>` +
			(d.photo ? `<button type="button" class="link" id="btnPhotoDel">Remove photo</button>` : '') +
			`</div></div></div>` +
			`<div class="card-in${pro ? '' : ' locked'}"><h4>Photo gallery page ${pro ? '' : '<span class="chip">Pro / Royal</span>'}</h4><p class="muted">Add up to 3 extra photos on a dedicated second page of your biodata.</p>` +
			(pro ? `<div class="slots">${[0, 1, 2].map(slot).join('')}</div>` : `<button type="button" class="btn" data-browse-tier="pro">See Pro &amp; Royal templates</button>`) +
			`</div>` +
			`<div class="card-in${pro ? '' : ' locked'}"><h4>Kundli / horoscope image ${pro ? '' : '<span class="chip">Pro / Royal</span>'}</h4><p class="muted">Upload a photo or screenshot of your kundli to print on page 2.</p>` +
			(pro
				? `<div class="photo-row"><div class="photo-thumb wide">${d.kundli ? `<img src="${d.kundli}" alt="Kundli">` : '<span>🔯</span>'}</div><div class="stack"><button type="button" class="btn" id="btnKundli">${d.kundli ? 'Change image' : 'Upload image'}</button>${d.kundli ? '<button type="button" class="link" id="btnKundliDel">Remove</button>' : ''}</div></div>`
				: `<button type="button" class="btn" data-browse-tier="pro">See Pro &amp; Royal templates</button>`) +
			`</div>`;
	}

	function renderStyle(host, t) {
		if (!t.premium) {
			host.innerHTML = `<div class="card-in locked"><h4>Customise your design <span class="chip">Premium</span></h4><p class="muted">Premium templates let you change the colour theme, font style and blessing symbols. Pick any premium template to try it free in demo mode.</p><button type="button" class="btn primary" data-browse-tier="premium">Browse premium templates</button></div>`;
			return;
		}
		const c = state.custom;
		const syms = cat().symbols;
		host.innerHTML =
			(demoMode(t) ? `<p class="tab-note demo">Demo mode: try every option. Unlock to download without watermark.</p>` : '') +
			`<div class="grid2">` +
			`<label class="fld"><span>Colour theme</span><div class="color-row"><input type="color" id="custColor" value="${c.color || '#9f1239'}"><button type="button" class="link" id="custColorReset">Reset</button></div></label>` +
			`<label class="fld"><span>Font style</span><select id="custFont"><option value="">Template default</option>${FONT_PAIRS.map((f, i) => `<option value="${i}"${String(c.fontIdx) === String(i) ? ' selected' : ''}>${esc(f.h)} + ${esc(f.b)}</option>`).join('')}</select></label>` +
			`<label class="fld"><span>Left symbol</span><select id="custSymA">${syms.map((s) => `<option${(c.symA || t.symA) === s ? ' selected' : ''}>${s}</option>`).join('')}</select></label>` +
			`<label class="fld"><span>Right symbol</span><select id="custSymB">${syms.map((s) => `<option${(c.symB || t.symB) === s ? ' selected' : ''}>${s}</option>`).join('')}</select></label>` +
			`</div>`;
	}

	// ------------------------------------------------------------------ preview
	function pageScale() {
		const wrap = $('#pvScroll');
		const w = wrap.clientWidth - 24;
		return Math.max(0.25, Math.min(1.25, w / PAGE_W)) * state.zoom;
	}

	function renderPreview() {
		const t = tpl();
		const stage = $('#pvStage');
		const feat = featuresOn(t);
		const pages = buildPages(t, state.data, {
			preview: true,
			features: feat,
			custom: feat ? state.custom : null,
			watermark: demoMode(t),
		});
		const s = pageScale();
		stage.innerHTML = pages
			.map((h, i) => `<div class="pv-page" style="width:${PAGE_W * s}px;height:${PAGE_H * s}px"><div class="pv-inner" style="transform:scale(${s})">${h}</div></div><div class="pv-label">Page ${i + 1} of ${pages.length}</div>`)
			.join('');
		$$('.bd', stage).forEach(fitPage);
		$('#zoomLevel').textContent = Math.round(state.zoom * 100) + '%';
	}
	const renderPreviewSoon = debounce(renderPreview, 90);
	const refit = debounce(() => $$('#pvStage .bd').forEach(fitPage), 60);
	if (document.fonts) document.fonts.addEventListener?.('loadingdone', refit);

	function renderBar() {
		const t = tpl();
		const tier = TIERS[t.tier];
		$('#tplName').textContent = `#${String(t.no).padStart(3, '0')} · ${t.name}`;
		$('#tplMeta').textContent = `${t.catName} · ${tier.label}${t.premium ? ' · ₹' + t.price : ''}`;
		$('#tplBadge').className = 'badge ' + (t.premium ? 'prem' : 'free');
		$('#tplBadge').textContent = t.premium ? (isUnlocked(t) ? '✓ Unlocked' : '★ Premium') : 'Free';
		const demo = demoMode(t);
		$('#demoBar').hidden = !demo;
		if (demo) $('#demoBarPrice').textContent = '₹' + t.price;
		$('#btnDownload').innerHTML = demo ? `🔒 Unlock &amp; Download <b>₹${t.price}</b>` : '⬇ Download PDF';
		const hd = $('#hdrDownload'); if (hd) hd.innerHTML = demo ? `Unlock ₹${t.price}` : 'Download PDF';
		$('#catSelect').value = t.cat;
	}

	function renderStrip() {
		const host = $('#strip');
		host.innerHTML = templatesIn(tpl().cat)
			.map((t) => `<button type="button" class="strip-item${t.id === state.tplId ? ' on' : ''}" data-tpl="${t.id}" aria-label="Template ${t.no} ${esc(t.name)}"><div class="thumb" data-thumb="${t.id}"></div><span class="lbl">#${t.no} ${esc(t.name)}</span><span class="price ${t.premium ? 'p' : 'f'}">${t.premium ? '₹' + t.price : 'Free'}</span></button>`)
			.join('');
		observeThumbs(host, 0.15);
	}

	function renderAll() {
		renderBar();
		renderStrip();
		renderTabs();
		renderFields();
		renderPreview();
	}

	// ------------------------------------------------------------------ thumbnails (lazy)
	const thumbData = {};
	const thumbObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (!e.isIntersecting) return;
				thumbObserver.unobserve(e.target);
				drawThumb(e.target);
			});
		},
		{ rootMargin: '200px' }
	);
	function observeThumbs(host, scale) {
		$$('[data-thumb]', host).forEach((el) => {
			el.dataset.scale = scale;
			el.style.width = PAGE_W * scale + 'px';
			el.style.height = PAGE_H * scale + 'px';
			thumbObserver.observe(el);
		});
	}
	function drawThumb(el) {
		const t = getTemplate(el.dataset.thumb);
		const scale = parseFloat(el.dataset.scale);
		const key = t.religion;
		thumbData[key] ||= sampleFor(key, 'Male');
		const pages = buildPages(t, thumbData[key], { preview: true, features: false, watermark: false });
		const main = pages[pages.length - 1];
		el.innerHTML = `<div class="thumb-in" style="transform:scale(${scale})">${main}</div>`;
		fitPage(el.querySelector('.bd'));
	}

	// ------------------------------------------------------------------ template selection
	function selectTemplate(id, { keepData = true } = {}) {
		const prevCat = tpl().cat;
		state.tplId = id;
		state.custom = {};
		const t = tpl();
		// swap sample data for the new religion until the user starts typing their own details
		if (!state.dirty && getCategory(prevCat).religion !== t.religion) {
			const keep = { photo: state.data.photo, gallery: state.data.gallery, kundli: state.data.kundli, gender: state.data.gender };
			state.data = { ...sampleFor(t.religion, keep.gender), ...keep };
		}
		if (state.tab === 'style' && !t.premium) state.tab = 'personal';
		renderAll();
		saveDraftSoon();
		if (t.premium && !isUnlocked(t)) toast(`Premium demo: try every feature free. Unlock for ₹${t.price} to download.`);
	}

	// ------------------------------------------------------------------ gallery modal
	const modal = $('#galleryModal');
	function openGallery(opts = {}) {
		if (opts.cat) state.filter.cat = opts.cat;
		if (opts.tier) state.filter.tier = opts.tier;
		modal.hidden = false;
		document.body.classList.add('no-scroll');
		renderGalleryFilters();
		renderGalleryGrid();
		$('#gQuery').focus({ preventScroll: true });
	}
	function closeGallery() {
		modal.hidden = true;
		document.body.classList.remove('no-scroll');
	}
	function renderGalleryFilters() {
		const f = state.filter;
		$('#gCats').innerHTML =
			`<button type="button" class="chipbtn${f.cat === 'all' ? ' on' : ''}" data-gcat="all">All (${TEMPLATES.length})</button>` +
			CATEGORIES.map((c) => `<button type="button" class="chipbtn${f.cat === c.id ? ' on' : ''}" data-gcat="${c.id}">${c.icon} ${esc(c.name)}</button>`).join('');
		$('#gTiers').innerHTML = [
			['all', 'All'],
			['free', 'Free'],
			['premium', `Premium (${PREMIUM_COUNT})`],
			['plus', '₹49'],
			['pro', '₹99'],
			['royal', '₹149'],
		]
			.map(([id, l]) => `<button type="button" class="chipbtn${f.tier === id ? ' on' : ''}" data-gtier="${id}">${l}</button>`)
			.join('');
		$('#gQuery').value = f.q;
	}
	function filtered() {
		const f = state.filter;
		const q = f.q.trim().toLowerCase().replace(/^#/, '');
		return TEMPLATES.filter((t) => {
			if (f.cat !== 'all' && t.cat !== f.cat) return false;
			if (f.tier === 'free' && t.premium) return false;
			if (f.tier === 'premium' && !t.premium) return false;
			if (['plus', 'pro', 'royal'].includes(f.tier) && t.tier !== f.tier) return false;
			if (q && !(String(t.no) === q || (t.name + ' ' + t.catName + ' ' + t.tier).toLowerCase().includes(q))) return false;
			return true;
		});
	}
	function renderGalleryGrid() {
		const list = filtered();
		$('#gCount').textContent = `${list.length} template${list.length === 1 ? '' : 's'}`;
		const grid = $('#gGrid');
		grid.innerHTML = list.length
			? list
					.map(
						(t) =>
							`<button type="button" class="gcard${t.id === state.tplId ? ' on' : ''}" data-tpl="${t.id}"><div class="gthumb"><div data-thumb="${t.id}" class="thumb"></div>${t.premium ? `<span class="ribbon">${isUnlocked(t) ? '✓ Unlocked' : '★ ₹' + t.price}</span>` : '<span class="ribbon free">Free</span>'}</div><div class="gmeta"><b>#${t.no} ${esc(t.name)}</b><span>${esc(t.catName)} · ${TIERS[t.tier].label}</span></div></button>`
					)
					.join('')
			: '<p class="muted" style="padding:2rem">No templates match. Try another filter.</p>';
		observeThumbs(grid, 0.2);
		grid.scrollTop = 0;
	}

	// ------------------------------------------------------------------ photo cropping
	let cropper = null;
	let cropTarget = 'photo';
	async function openCropper(file) {
		loadCss('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css');
		await loadScript('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js');
		const src = await resizeImage(file, 1800, 0.92);
		const img = $('#cropImg');
		$('#cropModal').hidden = false;
		document.body.classList.add('no-scroll');
		img.src = src;
		if (cropper) cropper.destroy();
		const shape = tpl().photo;
		const aspect = shape === 'circle' ? 1 : 3 / 4;
		cropper = new window.Cropper(img, { aspectRatio: aspect, viewMode: 1, autoCropArea: 1, background: false });
		$('#cropShape').textContent = shape === 'circle' ? 'Square crop (circle frame)' : 'Portrait crop (3:4)';
	}
	function closeCropper() {
		$('#cropModal').hidden = true;
		document.body.classList.remove('no-scroll');
		if (cropper) {
			cropper.destroy();
			cropper = null;
		}
	}
	function applyCrop() {
		if (!cropper) return;
		const shape = tpl().photo;
		const w = shape === 'circle' ? 840 : 720;
		const h = shape === 'circle' ? 840 : 960;
		const canvas = cropper.getCroppedCanvas({ width: w, height: h, imageSmoothingQuality: 'high' });
		state.data.photo = canvas.toDataURL('image/jpeg', 0.92);
		closeCropper();
		if (state.tab === 'photos') renderFields();
		renderPreview();
		saveDraftSoon();
	}

	// ------------------------------------------------------------------ draft
	function saveDraft() {
		try {
			localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify({ data: state.data, dirty: state.dirty, tplId: state.tplId }));
		} catch {}
	}
	const saveDraftSoon = debounce(saveDraft, 600);
	function restoreDraft() {
		try {
			const d = JSON.parse(localStorage.getItem(STORAGE_KEYS.draft));
			if (d && d.dirty) {
				state.data = { ...state.data, ...d.data };
				state.dirty = true;
			}
		} catch {}
	}

	// ------------------------------------------------------------------ payments (Razorpay)
	const unlockModal = $('#unlockModal');
	let pendingDownload = false;
	function openUnlock() {
		const t = tpl();
		const tier = TIERS[t.tier];
		$('#ulName').textContent = `#${t.no} ${t.name} (${t.catName})`;
		$('#ulTier').textContent = tier.label;
		$('#ulFeatures').innerHTML = tier.features.map((f) => `<li>${esc(f)}</li>`).join('');
		$('#ulBuyOne').innerHTML = `Buy this template <b>₹${t.price}</b>`;
		$('#ulBuyAll').innerHTML = `All-Access Pass <b>₹${ALL_ACCESS.price}</b><small>All ${PREMIUM_COUNT} premium templates, forever</small>`;
		unlockModal.hidden = false;
		document.body.classList.add('no-scroll');
	}
	function closeUnlock() {
		unlockModal.hidden = true;
		document.body.classList.remove('no-scroll');
	}
	async function pay(kind) {
		const t = tpl();
		const btn = kind === 'all' ? $('#ulBuyAll') : $('#ulBuyOne');
		btn.disabled = true;
		try {
			const order = await api('create-order', { kind: kind === 'all' ? 'all' : 'one', tplId: t.id });
			await loadScript('https://checkout.razorpay.com/v1/checkout.js');
			const rzp = new window.Razorpay({
				key: order.keyId,
				order_id: order.orderId,
				amount: order.amount,
				currency: order.currency,
				name: RAZORPAY.brand,
				description: kind === 'all' ? ALL_ACCESS.label : `Template #${t.no} ${t.name}`,
				theme: { color: RAZORPAY.themeColor },
				handler: async (res) => {
					try {
						setBusy(true, 'Confirming your payment…');
						const v = await api('verify', { order_id: res.razorpay_order_id, payment_id: res.razorpay_payment_id, signature: res.razorpay_signature });
						storeToken(v.kind, v.tpl, v.token);
						closeUnlock();
						renderBar();
						renderPreview();
						renderFields();
						setBusy(false);
						toast('Payment confirmed. Premium unlocked! 🎉 Save your payment ID ' + res.razorpay_payment_id + ' to restore later.', 7000);
						if (pendingDownload) {
							pendingDownload = false;
							exportPdf();
						}
					} catch (e) {
						setBusy(false);
						toast('Payment received but confirmation failed: ' + e.message + '. Use “Restore purchase” with your payment ID.', 9000);
					}
				},
				modal: { ondismiss: () => (btn.disabled = false) },
			});
			rzp.on('payment.failed', (r) => {
				btn.disabled = false;
				toast('Payment failed: ' + (r.error?.description || 'please try again'), 5000);
			});
			rzp.open();
		} catch (e) {
			toast(e.message || 'Could not open payment window. Try again.', 5000);
		}
		btn.disabled = false;
	}

	async function restorePurchase() {
		const email = $('#rsEmail').value.trim();
		const pid = $('#rsPid').value.trim();
		const btn = $('#rsBtn');
		btn.disabled = true;
		try {
			const v = await api('restore', { email, payment_id: pid });
			storeToken(v.kind, v.tpl, v.token);
			closeUnlock();
			renderBar();
			renderPreview();
			renderFields();
			toast('Purchase restored ✔');
		} catch (e) {
			toast(e.message, 6000);
		}
		btn.disabled = false;
	}

	// ------------------------------------------------------------------ export
	async function ensureFonts(t) {
		if (!document.fonts) return;
		const sample = 'Aa अआ ਅਆ অআ ابج 0123';
		await Promise.all(
			fontsNeeded(t, state.data, state.custom).flatMap((f) => [
				document.fonts.load(`400 24px "${f}"`, sample).catch(() => {}),
				document.fonts.load(`700 24px "${f}"`, sample).catch(() => {}),
			])
		);
		await document.fonts.ready;
	}

	async function renderToCanvases(scale) {
		const t = tpl();
		await Promise.all([loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')]);
		await ensureFonts(t);
		const feat = featuresOn(t);
		const pages = buildPages(t, state.data, { preview: false, features: feat, custom: feat ? state.custom : null, watermark: false });
		const host = document.createElement('div');
		host.className = 'export-stage';
		host.innerHTML = pages.map((h) => `<div class="export-page">${h}</div>`).join('');
		document.body.appendChild(host);
		try {
			$$('.bd', host).forEach(fitPage);
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
			$$('.bd', host).forEach(fitPage);
			const out = [];
			for (const el of $$('.export-page', host)) {
				out.push(
					await window.html2canvas(el, {
						scale,
						useCORS: true,
						backgroundColor: '#ffffff',
						logging: false,
						width: PAGE_W,
						height: PAGE_H,
						onclone: (doc) => {
							const s = doc.querySelector('.export-stage');
							if (s) {
								s.style.left = '0px';
								s.style.top = '0px';
							}
						},
					})
				);
			}
			return out;
		} finally {
			host.remove();
		}
	}

	const fileBase = () => (state.data.name || 'Biodata').trim().replace(/[^\w\u0900-\u097F]+/g, '_').replace(/^_+|_+$/g, '') || 'Biodata';

	let busy = false;
	function setBusy(on, msg) {
		busy = on;
		$$('[data-busy-btn]').forEach((b) => (b.disabled = on));
		$('#busy').hidden = !on;
		if (msg) $('#busyMsg').textContent = msg;
	}

	async function exportPdf() {
		const t = tpl();
		if (busy) return;
		if (demoMode(t)) {
			pendingDownload = true;
			return openUnlock();
		}
		setBusy(true, t.premium ? 'Creating Ultra-HD PDF…' : 'Creating your PDF…');
		if (t.premium && !(await serverConfirms(t))) {
			setBusy(false);
			delete unlocks.ids[t.id];
			unlocks.all = '';
			saveUnlocks();
			renderBar();
			renderPreview();
			toast('Could not verify your unlock. Use “Restore purchase” or unlock again.', 6000);
			return;
		}
		try {
			await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
			let canvases;
			try {
				canvases = await renderToCanvases(t.premium ? 3.125 : 2);
			} catch (e) {
				canvases = await renderToCanvases(2); // low-memory fallback
			}
			const { jsPDF } = window.jspdf;
			const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
			canvases.forEach((c, i) => {
				if (i) doc.addPage();
				doc.addImage(c.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
			});
			doc.setProperties({ title: `${state.data.name || 'Marriage'} Biodata`, creator: 'biodatapdf.com' });
			doc.save(`${fileBase()}_Biodata.pdf`);
			toast('PDF downloaded ✔');
		} catch (e) {
			console.error(e);
			toast('Could not create the PDF. Please try again.', 5000);
		}
		setBusy(false);
	}

	async function exportPng() {
		const t = tpl();
		if (busy) return;
		if (demoMode(t)) {
			pendingDownload = false;
			return openUnlock();
		}
		setBusy(true, 'Creating WhatsApp image…');
		if (t.premium && !(await serverConfirms(t))) {
			setBusy(false);
			toast('Could not verify your unlock. Use “Restore purchase”.', 6000);
			return;
		}
		try {
			const [c] = await renderToCanvases(2);
			c.toBlob((blob) => {
				const a = document.createElement('a');
				a.href = URL.createObjectURL(blob);
				a.download = `${fileBase()}_Biodata.png`;
				a.click();
				setTimeout(() => URL.revokeObjectURL(a.href), 4000);
			}, 'image/png');
			toast('Image saved ✔');
		} catch (e) {
			console.error(e);
			toast('Could not create the image. Please try again.', 5000);
		}
		setBusy(false);
	}

	// ------------------------------------------------------------------ events
	root.addEventListener('input', (e) => {
		const el = e.target;
		if (el.dataset?.k) {
			state.data[el.dataset.k] = el.value;
			state.dirty = true;
			if (el.dataset.k === 'gender') {
				/* keep sample gender in sync until user edits */
			}
			renderPreviewSoon();
			saveDraftSoon();
		}
		if (el.id === 'custColor') {
			state.custom.color = el.value;
			renderPreviewSoon();
		}
	});
	root.addEventListener('change', (e) => {
		const el = e.target;
		if (el.id === 'custFont') {
			state.custom.fontIdx = el.value === '' ? undefined : +el.value;
			renderPreview();
		} else if (el.id === 'custSymA') {
			state.custom.symA = el.value;
			renderPreview();
		} else if (el.id === 'custSymB') {
			state.custom.symB = el.value;
			renderPreview();
		} else if (el.id === 'catSelect') {
			const first = templatesIn(el.value).find((t) => !t.premium) || templatesIn(el.value)[0];
			selectTemplate(first.id);
		} else if (el.dataset?.k === 'gender' && !state.dirty) {
			const keep = { photo: state.data.photo, gallery: state.data.gallery, kundli: state.data.kundli };
			state.data = { ...sampleFor(tpl().religion, el.value), ...keep };
			renderFields();
			renderPreview();
		}
	});

	document.addEventListener('click', (e) => {
		const t = e.target.closest('button, a, [data-tpl]');
		if (!t) return;
		if (t.dataset.tab) {
			state.tab = t.dataset.tab;
			renderTabs();
			renderFields();
			return;
		}
		if (t.dataset.tpl) {
			selectTemplate(t.dataset.tpl);
			if (!modal.hidden) closeGallery();
			if (window.matchMedia('(max-width: 1023px)').matches) setMobileView('prev');
			return;
		}
		if (t.dataset.gcat) {
			state.filter.cat = t.dataset.gcat;
			renderGalleryFilters();
			return renderGalleryGrid();
		}
		if (t.dataset.gtier) {
			state.filter.tier = t.dataset.gtier;
			renderGalleryFilters();
			return renderGalleryGrid();
		}
		if (t.dataset.browseTier) return openGallery({ tier: t.dataset.browseTier, cat: 'all' });
		if (t.dataset.gal !== undefined) return pickFile('gallery', +t.dataset.gal);
		if (t.dataset.galdel !== undefined) {
			state.data.gallery[+t.dataset.galdel] = '';
			renderFields();
			renderPreview();
			return saveDraftSoon();
		}
		switch (t.id) {
			case 'browseAll':
			case 'browseAll2':
				return openGallery({});
			case 'gClose':
				return closeGallery();
			case 'btnPhoto':
				return pickFile('photo');
			case 'btnPhotoDel':
				state.data.photo = '';
				renderFields();
				renderPreview();
				return saveDraftSoon();
			case 'btnKundli':
				return pickFile('kundli');
			case 'btnKundliDel':
				state.data.kundli = '';
				renderFields();
				renderPreview();
				return saveDraftSoon();
			case 'custColorReset':
				delete state.custom.color;
				renderFields();
				return renderPreview();
			case 'btnDownload':
			case 'hdrDownload':
			case 'demoUnlock':
				return exportPdf();
			case 'btnPng':
				return exportPng();
			case 'zoomIn':
				state.zoom = Math.min(1.6, +(state.zoom + 0.1).toFixed(2));
				return renderPreview();
			case 'zoomOut':
				state.zoom = Math.max(0.5, +(state.zoom - 0.1).toFixed(2));
				return renderPreview();
			case 'ulClose':
				return closeUnlock();
			case 'ulBuyOne':
				return pay('one');
			case 'ulBuyAll':
				return pay('all');
			case 'rsBtn':
				return restorePurchase();
			case 'cropApply':
				return applyCrop();
			case 'cropCancel':
				return closeCropper();
			case 'btnReset':
				if (confirm('Clear all details and start again?')) {
					state.data = { ...sampleFor(tpl().religion, 'Male'), photo: '', gallery: [], kundli: '' };
					state.dirty = false;
					try {
						localStorage.removeItem(STORAGE_KEYS.draft);
					} catch {}
					renderFields();
					renderPreview();
				}
				return;
			case 'btnClear':
				state.data = Object.fromEntries(Object.keys(state.data).map((k) => [k, k === 'gallery' ? [] : k === 'gender' ? state.data.gender : '']));
				state.dirty = true;
				renderFields();
				renderPreview();
				toast('All fields cleared. Type your own details.');
				return;
			case 'btnNext': {
				const i = tabs.findIndex((x) => x.id === state.tab);
				state.tab = tabs[(i + 1) % tabs.length].id;
				renderTabs();
				renderFields();
				return;
			}
			case 'mvEdit':
				return setMobileView('edit');
			case 'mvPrev':
				return setMobileView('prev');
		}
	});

	$('#gQuery').addEventListener(
		'input',
		debounce((e) => {
			state.filter.q = e.target.value;
			renderGalleryGrid();
		}, 150)
	);
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			if (!modal.hidden) closeGallery();
			if (!unlockModal.hidden) closeUnlock();
			if (!$('#cropModal').hidden) closeCropper();
		}
	});
	modal.addEventListener('click', (e) => e.target === modal && closeGallery());
	unlockModal.addEventListener('click', (e) => e.target === unlockModal && closeUnlock());
	window.addEventListener('resize', debounce(renderPreview, 150));

	// hidden file input shared by all image pickers
	const fileInput = $('#fileInput');
	let pickMode = null;
	function pickFile(mode, idx) {
		pickMode = { mode, idx };
		fileInput.value = '';
		fileInput.click();
	}
	fileInput.addEventListener('change', async () => {
		const file = fileInput.files?.[0];
		if (!file || !pickMode) return;
		const { mode, idx } = pickMode;
		try {
			if (mode === 'photo') await openCropper(file);
			else if (mode === 'gallery') {
				state.data.gallery[idx] = await resizeImage(file, 1100);
				renderFields();
				renderPreview();
			} else if (mode === 'kundli') {
				state.data.kundli = await resizeImage(file, 1400);
				renderFields();
				renderPreview();
			}
			saveDraftSoon();
		} catch (e) {
			toast('Could not read that image. Try a JPG or PNG.');
		}
	});

	function setMobileView(v) {
		root.dataset.view = v;
		$$('[data-mv]').forEach((b) => b.classList.toggle('on', b.dataset.mv === v));
		if (v === 'prev') {
			renderPreview();
			$('#pvTop').scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	// ------------------------------------------------------------------ boot
	$('#catSelect').innerHTML = CATEGORIES.map((c) => `<option value="${c.id}">${c.icon} ${esc(c.name)} (10)</option>`).join('');
	restoreDraft();
	renderAll();
	validateStored();
	root.dataset.view = 'edit';
	$$('[data-mv]').forEach((b) => b.classList.toggle('on', b.dataset.mv === 'edit'));
	if (location.hash === '#templates') openGallery({});
}
