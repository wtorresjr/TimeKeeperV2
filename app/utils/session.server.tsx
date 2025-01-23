import { createCookieSessionStorage, redirect } from "@remix-run/node";

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

export const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get("Cookie"));
};

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  return typeof userId === "string" ? userId : null;
};

export const requireUserId = async (request: Request) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw await redirectToLogin(request);
  }
  return userId;
};

export async function redirectToLogin(request: Request) {
  const session = await storage.getSession();
  const url = new URL(request.url);
  session.set("redirectTo", url.pathname);
  return redirect("/login", {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}
