import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "@app/components/hashingFuncs";
import { createUserSession } from "@app/utils/session.server";

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
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return json({ error: "Invalid email or password." }, { status: 401 });
  } else {
    return createUserSession(user.id, "/calendar");
  }
};

// Login Form Component
export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex h-screen items-center justify-center p-5">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white-900">
            Time Keeper Login
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
