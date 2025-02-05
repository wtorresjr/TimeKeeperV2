import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const sessionSecret = process.env.SESSION_SECRET || "default_secret";

export const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
};

export const getUserSession = async (request: Request) => {
  try {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) {
      throw new Error("No cookie present");
    }
    return storage.getSession(cookieHeader);
  } catch (error) {
    throw redirect("/login");
  }
};

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  return userId ? userId : null;
};

export const requireUserId = async (request: Request) => {
  try {
    const session = await getUserSession(request);
    const userId = session.get("userId");

    if (!userId) {
      throw redirect("/login");
    }

    const user = await prisma.tech.findUnique({
      where: { id: userId.toString() }
    });

    if (!user) {
      throw redirect("/login");
    }

    return user;
  } catch (error) {
    throw redirect("/login");
  }
};

export async function redirectToLogin(request: Request) {
  const session = await storage.getSession();
  const url = new URL(request.url);
  session.set("redirectTo", url.pathname);
  return redirect("/login", {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}
