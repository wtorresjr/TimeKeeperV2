import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const rates = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

const prisma = new PrismaClient();

let fullName: string;
let initials: string;

const generateNameInit = () => {
  fullName = faker.person.fullName();
  const nameArr = fullName.split(" ");
  let inits: string = "";
  for (let i = 0; i < nameArr.length; i++) {
    inits += nameArr[i][0].toUpperCase();
  }
  initials = inits;
  return fullName;
};

async function main() {
  const techs = await prisma.tech.findMany();

  const clients = Array.from({ length: 12 }).map(() => ({
    tech_id: techs[Math.floor(Math.random() * techs.length)].id,
    client_name: generateNameInit(),
    client_initials: initials,
    hourly_rate: rates[Math.floor(Math.random() * rates.length)],
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await prisma.client.createMany({
    data: clients,
  });

  console.log(`${clients.length} clients created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
