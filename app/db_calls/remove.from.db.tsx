import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function removeTech(email: string) {
  try {
    console.log("removeTech called");
    const tech = await prisma.tech.delete({
      where: {
        email: email,
      },
    });
    return tech;
  } catch (e) {
    throw e;
  } finally {
    await prisma.$disconnect();
  }
}

// removeTech("will@will.com");

// removeTech("bill@bill.com")
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
