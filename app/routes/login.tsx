import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "~/components/hashingFuncs";

const prisma = new PrismaClient();

// Server-side action to handle login
export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Input validation
  if (!email || !password) {
    return json({ error: "Email and password are required." }, { status: 400 });
  }

  // Find user by email
  const user = await prisma.tech.findUnique({ where: { email } });
  if (!user) {
    return json({ error: "Invalid email or password." }, { status: 401 });
  }

  // Compare password
  const isPasswordValid = verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return json({ error: "Invalid email or password." }, { status: 401 });
  }

  // Handle successful login (e.g., create a session)
  // Redirect to dashboard or home page
  return redirect("/calendar");
};

// Login Form Component
export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex h-screen items-center justify-center">
      <h1>Login</h1>
      <Form method="post" className="login-form">
        <div>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="input"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="input"
          />
        </div>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
