import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useNotification } from "~/context/NotificationContext";
import { useState } from "react";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const newPassword = formData.get("newPassword");

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });

  if (res.ok) {
    return json({ success: true });
  }

  const errorRes = await res.json();
  return json({ error: errorRes.message || "Reset request failed." }, { status: 400 });
};

type ActionData = {
  error?: string;
  success?: boolean;
};

export default function ResetPassword() {
  const actionData = useActionData<ActionData>();
  const { showMessage } = useNotification();
  const [showPassword, setShowPassword] = useState(false);

  if (actionData?.success) {
    showMessage("Password reset successfully!");
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl mb-6 font-bold text-blue-600">Reset Password</h1>

      <Form method="post" className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Enter new password"
            className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-3 right-3 text-sm"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded"
        >
          Reset Password
        </button>
      </Form>

      {actionData?.error && (
        <p className="mt-4 text-red-500">{actionData.error}</p>
      )}
    </div>
  );
}
