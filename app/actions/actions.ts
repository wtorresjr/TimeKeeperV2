import { PrismaClient } from "@prisma/client";
import { requireUserId } from "../utils/session.server";
import { json, redirect } from "@remix-run/node";

const prisma = new PrismaClient();

export async function createHours(request: Request) {
  try {
    const user = await requireUserId(request);
    const formData = await request.formData();
    const date = formData.get("date");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const client_id = formData.get("client_id");

    if (!date || !startTime || !endTime || !client_id) {
      return json({ error: "All fields are required." }, { status: 400 });
    }

    const totalHours = calculateTotalHours(startTime as string, endTime as string);

    await prisma.hours.create({
      data: {
        date: new Date(date as string),
        hours: totalHours,
        tech_id: user.id,
        client_id: client_id as string,
      },
    });

    return redirect("/calendar");
  } catch (error) {
    if (error instanceof Response) throw error;
    return json({ error: "Failed to create hours" }, { status: 500 });
  }
}

function calculateTotalHours(startTime: string, endTime: string): number {
  const start = new Date(`1970-01-01T${startTime}:00`);
  let end = new Date(`1970-01-01T${endTime}:00`);

  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}
