import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { addTech } from "@app/db_calls/add.to.db";
// import { removeTech } from "@app/db_calls/remove.from.db";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="centerOnScreen flex-col space-y-6">
      <h2 className="title">
        Time Keeper App
      </h2>
      <Link to={"/calendar"}>Add Hours</Link>
      <Link to={"/add_people"}>Add Tech</Link>
    </div>
  );
}
