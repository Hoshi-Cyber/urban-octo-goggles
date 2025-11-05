import type { APIRoute } from "astro";

export const prerender = false;

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim();
  const source = String(form.get("source") || "unknown");
  const success = (form.get("success") as string | null) || null;
  const honeypot = String(form.get("company") || "");

  if (!isEmail(email)) {
    return new Response(JSON.stringify({ ok: false, error: "invalid_email" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Honeypot: bots fill hidden "company" field
  if (honeypot) {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  // DEV storage: log only. Replace with ESP API in prod.
  console.log("[leadmagnet]", { email, source, ts: Date.now() });

  // Optional 303 redirect when success URL is provided
  if (success) return redirect(success, 303);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
