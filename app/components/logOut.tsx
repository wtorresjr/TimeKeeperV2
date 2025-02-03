// filepath: /home/reinstall/Documents/Dev-Projects/TimeKeeperV2/app/components/Logout.tsx
import { Form } from "@remix-run/react";

const Logout = () => {
  return (
    <Form
      method="post"
      action="/logout"
      // className="centerOnScreen flex-col space-y-8"
    >
      <button type="submit" className="btn warn">
        Logout
      </button>
    </Form>
  );
};

export default Logout;
