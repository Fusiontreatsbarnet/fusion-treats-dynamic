const { prisma } = require("../../../lib/prisma");
const { getSessionFromRequest } = require("../../../lib/auth");

export async function GET() {
  const pages = await prisma.page.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(pages);
}

export async function POST(request) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const page = await prisma.page.create({
    data: {
      slug: body.slug,
      title: body.title,
      content: body.content,
      isPublished: body.isPublished ?? true,
    },
  });
  return Response.json(page, { status: 201 });
}
