// Run this once with: node prisma/reset-admin.js
// It creates (or resets) a single admin login with a known email/password.

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const EMAIL = "admin@fusiontreats.uk";
const PASSWORD = "Fusion2026!";

async function main() {
  const passwordHash = bcrypt.hashSync(PASSWORD, 10);

  const existing = await prisma.adminUser.findUnique({ where: { email: EMAIL } });

  if (existing) {
    await prisma.adminUser.update({ where: { email: EMAIL }, data: { passwordHash } });
    console.log(`Updated existing admin: ${EMAIL}`);
  } else {
    await prisma.adminUser.create({ data: { email: EMAIL, passwordHash } });
    console.log(`Created new admin: ${EMAIL}`);
  }

  console.log(`Login with email: ${EMAIL}`);
  console.log(`Login with password: ${PASSWORD}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
