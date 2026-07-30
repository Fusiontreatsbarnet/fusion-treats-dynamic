const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const COOKIE_NAME = "ft_admin_session";
const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function signSession(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

function verifySession(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// Reads the session cookie from a Next.js Request object and returns the
// decoded payload, or null if missing/invalid. Use this at the top of any
// admin-only API route to guard it.
function getSessionFromRequest(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const token = match.split("=")[1];
  return verifySession(token);
}

module.exports = {
  COOKIE_NAME,
  hashPassword,
  verifyPassword,
  signSession,
  verifySession,
  getSessionFromRequest,
};
