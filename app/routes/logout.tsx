import { redirect } from "@remix-run/node";
import { storage } from "../utils/session.server";

export const action = async ({ request }: { request: Request }) => {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
};

export default function Logout() {
  return (
    <form method="post" className="centerOfScreen">
      <button type="submit" className="btn warn">
        Logout
      </button>
    </form>
  );
}
