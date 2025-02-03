import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { requireUserId } from "../utils/session.server";
// import { Link } from "@remix-run/react";

const prisma = new PrismaClient();

export const action = async ({ request }: { request: Request }) => {
  const user = await requireUserId(request);
  const formData = await request.formData();
  const clientName = formData.get("clientName") as string;
  const clientInitials = formData.get("clientInitials") as string;
  const hourlyRate = parseFloat(formData.get("hourlyRate") as string);

  if (!clientName || !clientInitials || isNaN(hourlyRate)) {
    return json({ error: "All fields are required." }, { status: 400 });
  }

  await prisma.client.create({
    data: {
      tech_id: user.id,
      client_name: clientName,
      client_initials: clientInitials,
      hourly_rate: hourlyRate,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return redirect("/calendar");
};

export default function AddClient() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="centerOnScreen">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="title">Add New Client</h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-6">
            <div>
              <label htmlFor="clientName" className="sr-only">
                Client Name
              </label>
              <input
                id="clientName"
                name="clientName"
                type="text"
                required
                className="roundedInputStyle"
                placeholder="Client Name"
              />
            </div>
            <div>
              <label htmlFor="clientInitials" className="sr-only">
                Client Initials
              </label>
              <input
                id="clientInitials"
                name="clientInitials"
                type="text"
                required
                className="roundedInputStyle"
                placeholder="Client Initials"
              />
            </div>
            <div>
              <label htmlFor="hourlyRate" className="sr-only">
                Hourly Rate
              </label>
              <input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                step="0.01"
                required
                className="roundedInputStyle"
                placeholder="Hourly Rate"
              />
            </div>
          </div>
          {actionData?.error && (
            <p className="mt-2 text-center text-lg text-red-600">
              {actionData.error}
            </p>
          )}
          <div>
            <button type="submit" className="roundedButtonStyle">
              Add Client
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
