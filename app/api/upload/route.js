const fs = require("fs");
const path = require("path");
const { getSessionFromRequest } = require("../../../lib/auth");

const ALLOWED_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
  const session = getSessionFromRequest(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return Response.json({ error: "Unsupported file type. Use JPG, PNG, WEBP or GIF." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File too large (max 5MB)." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.writeFileSync(path.join(uploadDir, filename), bytes);

  return Response.json({ url: `/uploads/${filename}` }, { status: 201 });
}
