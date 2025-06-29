import { Form, useActionData, useNavigate } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import { useNotification } from "~/context/NotificationContext";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (res.ok) {
    return redirect("/login?registered=true");
  }

  const errorRes = await res.json();
  return json({ error: errorRes.message || "Registration failed." }, { status: 400 });
};

type ActionData = { error?: string };

export default function Register() {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const { showMessage } = useNotification();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl mb-6 font-bold text-blue-600">Register</h1>

      <Form method="post" className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          required
        />
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

        <select
          name="role"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          required
        >
          <option value="">Select Role</option>
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
        </select>

        <button type="submit" className="w-full p-3 bg-green-600 text-white rounded">
          Register
        </button>
      </Form>

      {actionData?.error && <p className="mt-4 text-red-500">{actionData.error}</p>}

      <p className="mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-600 underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
