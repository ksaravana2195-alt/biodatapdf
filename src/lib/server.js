// Server-side helpers (Cloudflare Worker). Secrets come from env, never from the browser.
const enc = new TextEncoder();

export const json = (obj, status = 200) =>
	new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

export async function hmacHex(secret, message) {
	const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(message)));
}

export function safeEqual(a, b) {
	if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
	let r = 0;
	for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return r === 0;
}

const b64 = (s) => btoa(String.fromCharCode(...enc.encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)));

const tokenSecret = (env) => env.TOKEN_SECRET || env.RAZORPAY_KEY_SECRET;

// Unlock token = base64url(payload).hmac. Cannot be forged without the server secret.
export async function signToken(env, payload) {
	const body = b64(JSON.stringify(payload));
	return body + '.' + (await hmacHex(tokenSecret(env), body));
}

export async function verifyToken(env, token) {
	if (typeof token !== 'string' || !token.includes('.')) return null;
	const [body, sig] = token.split('.');
	if (!safeEqual(sig, await hmacHex(tokenSecret(env), body))) return null;
	try {
		return JSON.parse(unb64(body));
	} catch {
		return null;
	}
}

export async function rzp(env, path, method = 'GET', body) {
	const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
	const res = await fetch('https://api.razorpay.com/v1' + path, {
		method,
		headers: { authorization: 'Basic ' + auth, 'content-type': 'application/json' },
		body: body ? JSON.stringify(body) : undefined,
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data?.error?.description || 'Razorpay error ' + res.status);
	return data;
}

export const configured = (env) => !!(env?.RAZORPAY_KEY_ID && env?.RAZORPAY_KEY_SECRET);
