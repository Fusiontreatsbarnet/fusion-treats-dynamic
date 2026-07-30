const { COOKIE_NAME } = require("../../../../lib/auth");

export async function POST() {
  const headers = new Headers();
  headers.append("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
