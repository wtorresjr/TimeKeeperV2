import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import { addTech } from "@app/db_calls/add.to.db";
import { requireUserId } from "@app/utils/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: { request: Request }) => {
  await requireUserId(request);
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const isBCBA = formData.get("isBCBA") === "true";

  try {
    const newTech = await addTech(fullName, email, password, isBCBA);
    return { success: true, newTech };
  } catch (error: any) {
    console.error("Error adding tech:", error);
    return { success: false, error: error.message };
  }
};

export default function AddPeople() {
  const actionData = useActionData();

  return (
    <div className="centerOnScreen ">
      <Form method="post" className="flex-col max-w-md w-full space-y-8">
        <h2 className="title">Add Employee</h2>
        <input
          className="roundedInputStyle"
          type="text"
          name="fullName"
          placeholder="Full Name"
          required
        />
        <input
          className="roundedInputStyle"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="roundedInputStyle"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <div className="flex flex-row justify-between">
          <label>Is BCBA?</label>
          <select name="isBCBA">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <button className="roundedButtonStyle" type="submit">
          Add Tech
        </button>
      </Form>
    </div>
  );
}
