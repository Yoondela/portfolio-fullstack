import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import * as argon2 from "argon2";
import { Pool } from "pg";
import { z } from "zod";

const adminSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});

async function main() {
  const parsedAdmin = adminSchema.parse({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
  });

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: parsedAdmin.email },
    });

    if (existingUser) {
      throw new Error("A user with this email already exists.");
    }

    const passwordHash = await argon2.hash(parsedAdmin.password, {
      type: argon2.argon2id,
    });

    await prisma.user.create({
      data: {
        email: parsedAdmin.email,
        passwordHash,
        isAdmin: true,
      },
    });

    console.log(`Created administrator ${parsedAdmin.email}.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
