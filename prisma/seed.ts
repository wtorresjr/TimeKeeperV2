import { faker } from "@faker-js/faker";
import { hashPassword } from "../app/components/hashingFuncs.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 3; i++) {
    const randomName = faker.person.fullName();
    const randomEmail = faker.internet.email();
    const tech = await prisma.tech.create({
      data: {
        email: randomEmail,
        fullName: randomName,
        password: await hashPassword("password"),
        isBCBA: i % 2 === 0,
      },
    });
    console.log(`Created tech: ${tech.fullName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
