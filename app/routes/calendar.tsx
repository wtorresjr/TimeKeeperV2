import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { requireUserId } from "../utils/session.server";
import { useState } from "react";
import NewHoursComp from "../components/newHoursComp";
import { action as newHoursAction } from "../components/newHoursComp.server";

const prisma = new PrismaClient();

export const loader = async ({ request }: { request: Request }) => {
  const user = await requireUserId(request);

  // Fetch clients for the logged-in tech
  const clients = await prisma.client.findMany({
    where: { tech_id: user.id },
  });

  return json({ clients });
};

export const action = newHoursAction;

export default function Calendar() {
  const { clients } = useLoaderData<typeof loader>();

  const [selectedClient, setSelectedClient] = useState(clients[0]);
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
    </div>
  );
}
