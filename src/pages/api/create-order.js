export const prerender = false;
import { json, rzp, configured } from '../../lib/server.js';
import { getTemplate } from '../../lib/templates.js';
import { ALL_ACCESS } from '../../lib/config.js';

// The price is decided HERE on the server, never taken from the browser.
export async function POST({ request, locals }) {
	const env = locals.runtime?.env;
	if (!configured(env)) return json({ error: 'Payments are not configured yet.' }, 503);
	let b;
	try { b = await request.json(); } catch { return json({ error: 'Bad request' }, 400); }
	let price, tpl = '';
	if (b.kind === 'all') price = ALL_ACCESS.price;
	else if (b.kind === 'one') {
		const t = getTemplate(String(b.tplId || ''));
		if (!t || !t.premium) return json({ error: 'Unknown template' }, 400);
		price = t.price;
		tpl = t.id;
	} else return json({ error: 'Bad request' }, 400);
	try {
		const order = await rzp(env, '/orders', 'POST', {
			amount: price * 100,
			currency: 'INR',
			receipt: 'bdp_' + Date.now(),
			notes: { kind: b.kind, tpl },
		});
		return json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: env.RAZORPAY_KEY_ID });
	} catch (e) {
		return json({ error: e.message }, 502);
	}
}
