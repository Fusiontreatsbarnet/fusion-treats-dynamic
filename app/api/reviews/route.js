const { prisma } = require("../../../lib/prisma");
const { getSessionFromRequest } = require("../../../lib/auth");

export async function GET() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(reviews);
}

export async function POST(request) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const review = await prisma.review.create({
    data: {
      name: body.name,
      rating: body.rating || 5,
      content: body.content,
      isFeatured: body.isFeatured ?? true,
    },
  });
  return Response.json(review, { status: 201 });
}
