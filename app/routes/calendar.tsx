import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { requireUserId } from "../utils/session.server";
import { useState } from "react";

const prisma = new PrismaClient();

export const loader = async ({ request }: { request: Request }) => {
  const userId = await requireUserId(request);

  // Fetch clients for the logged-in tech
  const clients = await prisma.client.findMany({
    where: { tech_id: userId },
  });

  return json({ clients });
};

export default function Calendar() {
  const { clients } = useLoaderData<typeof loader>();

  const [selectedClient, setSelectedClient] = useState(clients[0]);

  const showAlert = () => {
    alert(`Add Hours For ${selectedClient.client_name}`);
  };

  return (
    <div className="flex flex-col h-screen items-center space-y-4 p-4">
      <div className="w-full flex justify-end">
        <Link to={"/logout"} className="btn">
          Logout
        </Link>
      </div>
      <div className="p-2">Select a client</div>
      <div className="flex w-full space-x-4">
        <select
          className="flex-grow"
          onChange={(e) =>
            setSelectedClient(
              clients.find((client) => client.client_id === e.target.value)
            )
          }
        >
          {clients.map((client) => (
            <option key={client.client_id} value={client.client_id}>
              {client.client_name}
            </option>
          ))}
        </select>
        <button className="btn" onClick={showAlert}>
          Add Hours
        </button>
      </div>
    </div>
  );
}
