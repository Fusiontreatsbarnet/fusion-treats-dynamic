const { prisma } = require("../../../lib/prisma");
const { getSessionFromRequest } = require("../../../lib/auth");

export async function GET() {
  const items = await prisma.menuItem.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  return Response.json(items);
}

export async function POST(request) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const item = await prisma.menuItem.create({
    data: {
      name: body.name,
      description: body.description || "",
      price: body.price,
      category: body.category,
      subCategory: body.subCategory || null,
      badge: body.badge || null,
      imageUrl: body.imageUrl || null,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive ?? true,
    },
  });
  return Response.json(item, { status: 201 });
}
