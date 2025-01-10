import { redirect } from "@remix-run/node";
import { storage } from "../utils/session.server";
import { Link } from "@remix-run/react";

export const action = async ({ request }: { request: Request }) => {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
};

export default function Logout() {
  return (
    <form method="post" className="centerOnScreen flex-col space-y-8">
      <button type="submit" className="btn warn">
        Logout
      </button>
      <Link to={"/calendar"}>Cancel</Link>
    </form>
  );
}
