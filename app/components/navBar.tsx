import { Link } from "@remix-run/react";
import Logout from "./logOut";

export const NavBar = () => {
  return (
    <div className="navBar">
      <Link to={"/"}>Home</Link>
      <Logout />
    </div>
  );
};
