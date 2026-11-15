export const prerender = false;
import { json, rzp, hmacHex, safeEqual, signToken, configured } from '../../lib/server.js';

// Called after Razorpay checkout succeeds. Verifies the signature, re-reads the order from Razorpay
// (so kind/template/amount cannot be faked), captures the payment, and returns a signed unlock token.
export async function POST({ request, locals }) {
	const env = locals.runtime?.env;
	if (!configured(env)) return json({ error: 'Payments are not configured yet.' }, 503);
	let b;
	try { b = await request.json(); } catch { return json({ error: 'Bad request' }, 400); }
	const { order_id, payment_id, signature } = b || {};
	if (!order_id || !payment_id || !signature) return json({ error: 'Bad request' }, 400);
	const expected = await hmacHex(env.RAZORPAY_KEY_SECRET, order_id + '|' + payment_id);
	if (!safeEqual(expected, String(signature))) return json({ error: 'Invalid payment signature' }, 400);
	try {
		const order = await rzp(env, '/orders/' + encodeURIComponent(order_id));
		let pay = await rzp(env, '/payments/' + encodeURIComponent(payment_id));
		if (pay.order_id !== order_id || pay.amount !== order.amount) return json({ error: 'Payment mismatch' }, 400);
		if (pay.status === 'authorized') pay = await rzp(env, `/payments/${encodeURIComponent(payment_id)}/capture`, 'POST', { amount: pay.amount, currency: pay.currency });
		if (pay.status !== 'captured') return json({ error: 'Payment not completed' }, 402);
		const { kind, tpl } = order.notes || {};
		const token = await signToken(env, { k: kind, t: tpl || '', p: payment_id, iat: Date.now() });
		return json({ ok: true, kind, tpl: tpl || '', token });
	} catch (e) {
		return json({ error: e.message }, 502);
	}
}
