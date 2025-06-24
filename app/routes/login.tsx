import { Form, useActionData, useNavigate, useSearchParams } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useAuth } from "~/context/AuthContext";
import { useEffect } from "react";
import { useNotification } from "~/context/NotificationContext";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const data = await res.json();
    return json({ token: data.token, name: data.user.name });
  }

  return json({ error: "Invalid credentials" }, { status: 400 });
};

type ActionData = {
  error?: string;
  token?: string;
  name?: string;
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showMessage } = useNotification();

  // 🔥 1️⃣ Show login success + redirect
  useEffect(() => {
    if (actionData?.token && actionData?.name) {
      login(actionData.token, actionData.name);
      showMessage("Login successful!");
      navigate("/profile");
    }
  }, [actionData, login, navigate, showMessage]);

  // 🔥 2️⃣ Show registration success toast if URL param exists
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      showMessage("Registration successful! You can now log in.");
    }
  }, [searchParams, showMessage]);

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl mb-6 font-bold text-blue-600">Login</h1>

      <Form method="post" className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          required
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded"
        >
          Login
        </button>
      </Form>

      {actionData?.error && (
        <p className="mt-4 text-red-500">{actionData.error}</p>
      )}
    </div>
  );
}
