const { prisma } = require("../../../../lib/prisma");
const { getSessionFromRequest } = require("../../../../lib/auth");

export async function PUT(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const review = await prisma.review.update({
    where: { id: params.id },
    data: {
      name: body.name,
      rating: body.rating,
      content: body.content,
      isFeatured: body.isFeatured,
    },
  });
  return Response.json(review);
}

export async function DELETE(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await prisma.review.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
