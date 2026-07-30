const { prisma } = require("../../../../lib/prisma");
const { getSessionFromRequest } = require("../../../../lib/auth");

export async function PUT(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const item = await prisma.menuItem.update({
    where: { id: params.id },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      badge: body.badge || null,
      imageUrl: body.imageUrl || null,
      sortOrder: body.sortOrder,
      isActive: body.isActive,
    },
  });
  return Response.json(item);
}

export async function DELETE(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await prisma.menuItem.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
