import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import NewHoursComp from "@app/components/newHoursComp";
import { CalendarInfoBar } from "../components/calendarInfoBar";
// import { createHours } from "@app/actions/actions";
import { Client } from "@app/types/client";
import { Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "../utils/session.server";
import { PrismaClient } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import type { Tech } from "../types/client";

const prisma = new PrismaClient();

interface LoaderData {
  clients: Client[];
  techData: Tech[];
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const user = await requireUserId(request);
    const clients = await prisma.client.findMany({
      where: { tech_id: user.id },
      include: { hours: true },
    });

    const techs = await prisma.tech.findMany();

    if (clients.length === 0) {
      return json({ clients: [], techData: techs });
    }

    return json({ clients, techData: techs });
  } catch (error) {
    if (error instanceof Response) throw error;
    throw redirect("/login");
  }
};

export default function Calendar() {
  const { clients, techData } = useLoaderData<LoaderData>();
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0]);
  const [showNewHours, setShowNewHours] = useState(false);

  const showNewHoursComponent = () => {
    setShowNewHours(true);
  };

  return (
    <div className="flex flex-col h-screen items-center space-y-4 p-4">
      {clients.length > 0 ? (
        <>
          <div className="p-2">Select a client</div>
          <div className="flex w-full space-x-4">
            <select
              className="dropdown flex-grow"
              onChange={(e) => {
                const client = clients.find(
                  (client) => client.client_id === e.target.value
                );
                if (client) {
                  setSelectedClient(client);
                }
                setShowNewHours(false);
              }}
            >
              {clients.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.client_name}
                </option>
              ))}
            </select>

            <button className="btn" onClick={showNewHoursComponent}>
              Add Hours
            </button>
          </div>
          <CalendarInfoBar chosenClient={selectedClient} />
        </>
      ) : (
        <div className="centerOnScreen flex-col space-y-4">
          <div>
            There are no clients associated with your account please add a
            client first.
          </div>
          <Link to={"/add_client"} className="btn">
            Add New Client
          </Link>
        </div>
      )}
      {showNewHours && <NewHoursComp chosenClient={selectedClient} />}
      {techData &&
        techData.map((tech) => (
          <div key={tech.id}>
            {tech.fullName} - {tech.email}
          </div>
        ))}
    </div>
  );
}
