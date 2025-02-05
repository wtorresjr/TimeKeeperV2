import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@app/components/hashingFuncs";

const prisma = new PrismaClient();

export async function addTech(
  fullName: string,
  email: string,
  password: string,
  isBCBA: boolean
) {
  const hashedPassword = await hashPassword(password);
  const tech = await prisma.tech.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      isBCBA,
    },
  });

  return tech;
}
