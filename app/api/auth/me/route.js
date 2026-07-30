const { getSessionFromRequest } = require("../../../../lib/auth");

export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response(JSON.stringify({ authenticated: false }), { status: 200 });
  return Response.json({ authenticated: true, email: session.email });
}
