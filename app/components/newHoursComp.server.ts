import { PrismaClient } from "@prisma/client";
import { requireUserId } from "../utils/session.server";
import { json, redirect } from "@remix-run/node";

const prisma = new PrismaClient();

export const action = async ({ request }: { request: Request }) => {
  const user = await requireUserId(request);
  const formData = await request.formData();
  const date = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const client_id = formData.get("client_id") as string;

  if (!date || !startTime || !endTime || !client_id) {
    return json({ error: "All fields are required." }, { status: 400 });
  }

  const start = new Date(`1970-01-01T${startTime}:00`);
  let end = new Date(`1970-01-01T${endTime}:00`);

  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  await prisma.hours.create({
    data: {
      date: new Date(date),
      hours: totalHours,
      tech_id: user.id,
      client_id,
    },
  });

  return redirect("/calendar");
};
