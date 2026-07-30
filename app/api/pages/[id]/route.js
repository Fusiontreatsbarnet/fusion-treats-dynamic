const { prisma } = require("../../../../lib/prisma");
const { getSessionFromRequest } = require("../../../../lib/auth");

export async function PUT(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const page = await prisma.page.update({
    where: { id: params.id },
    data: {
      slug: body.slug,
      title: body.title,
      content: body.content,
      isPublished: body.isPublished,
    },
  });
  return Response.json(page);
}

export async function DELETE(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await prisma.page.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
