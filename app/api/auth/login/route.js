const { prisma } = require("../../../../lib/prisma");
const { verifyPassword, signSession, COOKIE_NAME } = require("../../../../lib/auth");

export async function POST(request) {
  const { email, password } = await request.json();

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
  }

  const token = signSession({ userId: user.id, email: user.email });

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`
  );
  headers.append("Content-Type", "application/json");

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
