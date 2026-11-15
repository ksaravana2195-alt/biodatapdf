export const prerender = false;
import { json, rzp, signToken, configured } from '../../lib/server.js';

// Restore a purchase on a new phone/browser: needs the payment ID from the Razorpay receipt AND the same email.
export async function POST({ request, locals }) {
	const env = locals.runtime?.env;
	if (!configured(env)) return json({ error: 'Payments are not configured yet.' }, 503);
	let b;
	try { b = await request.json(); } catch { return json({ error: 'Bad request' }, 400); }
	const email = String(b?.email || '').trim().toLowerCase();
	const pid = String(b?.payment_id || '').trim();
	if (!email || !/^pay_[A-Za-z0-9]+$/.test(pid)) return json({ error: 'Enter your email and payment ID (starts with pay_)' }, 400);
	try {
		const pay = await rzp(env, '/payments/' + pid);
		if (String(pay.email || '').toLowerCase() !== email) return json({ error: 'Email does not match this payment' }, 403);
		if (pay.status !== 'captured' || !pay.order_id) return json({ error: 'This payment is not completed' }, 402);
		const order = await rzp(env, '/orders/' + pay.order_id);
		const { kind, tpl } = order.notes || {};
		if (!kind) return json({ error: 'This payment is not a template purchase' }, 400);
		return json({ ok: true, kind, tpl: tpl || '', token: await signToken(env, { k: kind, t: tpl || '', p: pid, iat: Date.now() }) });
	} catch (e) {
		return json({ error: e.message }, 502);
	}
}
