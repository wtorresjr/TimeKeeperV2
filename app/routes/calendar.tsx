import { requireUserId } from "../utils/session.server";
import { Link } from "@remix-run/react";

export const loader = async ({ request }: { request: Request }) => {
  await requireUserId(request);
  return null;
};

export default function Calendar() {
  return (
    <>
      Success Login
      <Link to={"/logout"}>Logout</Link>
    </>
  );
}
