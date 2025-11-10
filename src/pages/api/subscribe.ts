// File: src/pages/api/subscribe.ts
import type { APIRoute } from "astro";

export const prerender = false;

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function setParam(u: URL, key: string, value: string) {
  u.searchParams.set(key, value);
  return u;
}

function withSuccess(urlStr: string) {
  try {
    const u = new URL(urlStr);
    return setParam(u, "success", "1").toString();
  } catch {
    return "/?success=1";
  }
}

function withError(urlStr: string, code: "invalid_email" | "try_again", email?: string) {
  try {
    const u = new URL(urlStr);
    setParam(u, "error", code);
    if (email) setParam(u, "email", email);
    return u.toString();
  } catch {
    // Safe fallback keeps user on-site and allows inline error rendering
    let path = `/?error=${encodeURIComponent(code)}`;
    if (email) path += `&email=${encodeURIComponent(email)}`;
    return path;
  }
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const rawEmail = String(form.get("email") || "").trim();
  const email = rawEmail; // keep original for echoing back on error
  const source = String(form.get("source") || "unknown").slice(0, 120);
  const successHref = (form.get("success") as string | null) || null;
  const honeypot = String(form.get("company") || "");
  const referer = request.headers.get("referer") || "/";

  // Honeypot: pretend success, but do nothing server-side
  if (honeypot) {
    const target = successHref || withSuccess(referer);
    return redirect(target, 303);
  }

  // Invalid email → inline error flow on the same page
  if (!isEmail(email)) {
    const target = withError(referer, "invalid_email", email);
    return redirect(target, 303);
  }

  try {
    // TODO: Replace with your ESP/provider integration.
    // Persist + tag with `source`, send the PDF email.
    console.log("[leadmagnet] subscribe", { email, source, ts: Date.now() });
  } catch (err) {
    // Provider failure → inline non-technical error, preserve email
    const target = withError(referer, "try_again", email);
    return redirect(target, 303);
  }

  // Success → prefer explicit successHref, else bounce back with ?success=1
  const target = successHref || withSuccess(referer);
  return redirect(target, 303);
};

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
