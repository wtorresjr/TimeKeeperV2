import { PrismaClient } from "@prisma/client";
import { requireUserId } from "../utils/session.server";
import { json } from "@remix-run/node";
import type { Client } from "../types/client";

const prisma = new PrismaClient();

export async function loadClientsByTech(request: Request) {
  const user = await requireUserId(request);

  const clients = await prisma.client.findMany({
    where: { tech_id: user.id },
    include: { hours: true },
  });

  return json({ clients });
}

export async function loadTechs(request: Request) {
  const techs = await prisma.tech.findMany();
  return json({ techs });
}
