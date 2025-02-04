// filepath: /home/reinstall/Documents/Dev-Projects/TimeKeeperV2/app/routes/_index.tsx
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserId } from "../utils/session.server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return { user: null };
  }

  const user = await prisma.tech.findUnique({ where: { id: userId } });
  return { user };
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="centerOnScreen flex-col space-y-6">
      <h2 className="title">Time Keeper App</h2>
      <Link to={"/calendar"}>Add Hours</Link>
      <Link to={"/add_client"}>Add Client</Link>
      {user?.isBCBA && <Link to={"/add_people"}>Add Tech</Link>}
      <Link to={"/"}>View Hours</Link>
    </div>
  );
}
