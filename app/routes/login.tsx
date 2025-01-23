import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "@app/components/hashingFuncs";
import { createUserSession } from "@app/utils/session.server";
import { storage } from "@app/utils/session.server";
const prisma = new PrismaClient();

// Server-side action to handle login
export const action = async ({ request }: { request: Request }) => {
  const session = await storage.getSession(request.headers.get("Cookie"));
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
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return json({ error: "Invalid email or password." }, { status: 401 });
  }

  // Get the stored redirect URL or default to calendar
  const redirectTo = session.get("redirectTo") || "/login";
  session.unset("redirectTo"); // Clear the stored URL

  return createUserSession(user.id, redirectTo);
};

// Login Form Component
export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="centerOnScreen">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="title">Time Keeper Login</h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="roundedInputStyle"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="roundedInputStyle"
                placeholder="Password"
              />
            </div>
          </div>
          {actionData?.error && (
            <p className="mt-2 text-center text-lg text-red-600">
              {actionData.error}
            </p>
          )}
          <div>
            <button type="submit" className="roundedButtonStyle">
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
