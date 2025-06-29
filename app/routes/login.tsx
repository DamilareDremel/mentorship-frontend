import { Form, useActionData, useNavigate, useSearchParams } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useAuth } from "~/context/AuthContext";
import { useEffect, useState } from "react";
import { useNotification } from "~/context/NotificationContext";
import { tokenCookie } from "~/cookies";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const data = await res.json();
    const cookieHeader = await tokenCookie.serialize(data.token);

    return json(
      { token: data.token, name: data.user.name, role: data.user.role },
      { headers: { "Set-Cookie": cookieHeader } }
    );
  }

  return json({ error: "Invalid credentials" }, { status: 400 });
};

type ActionData = { error?: string; token?: string; name?: string; role?: string };

export default function Login() {
  const actionData = useActionData<ActionData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showMessage } = useNotification();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (actionData?.token && actionData?.name && actionData?.role) {
      login(actionData.token, actionData.name, actionData.role);
      showMessage("Login successful!");
      navigate("/profile");
    }
  }, [actionData, login, navigate, showMessage]);

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

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded">
          Login
        </button>
      </Form>

      <p className="mt-4">
        Forgot your password?{" "}
        <button
          type="button"
          onClick={() => navigate("/reset-password")}
          className="text-blue-600 underline"
        >
          Reset here
        </button>
      </p>

      {actionData?.error && <p className="mt-4 text-red-500">{actionData.error}</p>}
    </div>
  );
}
