export const prerender = false;
import { json, verifyToken, configured } from '../../lib/server.js';

// Tells the browser which stored unlock tokens are genuine.
export async function POST({ request, locals }) {
	const env = locals.runtime?.env;
	if (!configured(env)) return json({ error: 'Payments are not configured yet.' }, 503);
	let b;
	try { b = await request.json(); } catch { return json({ error: 'Bad request' }, 400); }
	const out = [];
	for (const tok of (Array.isArray(b?.tokens) ? b.tokens : []).slice(0, 50)) {
		const p = await verifyToken(env, tok);
		if (p && (p.k === 'all' || p.k === 'one')) out.push({ k: p.k, t: p.t, token: tok });
	}
	return json({ valid: out });
}
