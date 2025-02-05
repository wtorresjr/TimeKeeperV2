// filepath: /home/reinstall/Documents/Dev-Projects/TimeKeeperV2/app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { NavBar } from "./components/navBar";
import { getUserId } from "./utils/session.server";
import { PrismaClient } from "@prisma/client";
import "./tailwind.css";
import { json } from "@remix-run/node";

const prisma = new PrismaClient();

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: { request: Request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return { user: null };
  }

  try {
    const user = await prisma.tech.findUnique({
      where: { id: userId.toString() },
    });
    return json({ user });
  } catch (error) {
    return json({ user: null });
  }
};

export function Layout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { id: string; isBCBA: boolean } | null;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {user && <NavBar />}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Layout user={user}>
      <Outlet />
    </Layout>
  );
}
