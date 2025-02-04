import { Link } from "@remix-run/react";
import Logout from "./logOut";

export const NavBar = () => {
  return (
    <div className="navBar">
      <Link to={"/"}>Menu</Link>
      <Logout />
    </div>
  );
};
