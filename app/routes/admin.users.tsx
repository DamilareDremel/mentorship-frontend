import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  bio?: string;
  skills?: string[];
  goals?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("cookie") || "";
  const rawToken = cookie.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];
  if (!rawToken) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const token = decodeURIComponent(rawToken);

  const res = await fetch(`${process.env.VITE_API_BASE_URL}/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Response("Failed to fetch users", { status: 500 });
  }

  const data = await res.json();
  return json(data);
};

export default function AdminUsersPage() {
  const users = useLoaderData<User[]>();
  const token = localStorage.getItem("token");

  const handleRoleChange = (id: number, newRole: string) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${id}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Role updated!");
        window.location.reload();
      })
      .catch(console.error);
  };

  const handleDeleteUser = (id: number) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then(() => {
      alert("User deleted!");
      window.location.reload();
    })
    .catch(console.error);
};

  return (
    <div className="overflow-x-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin: Manage Users</h1>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border">
              <td className="p-3 border">{user.name}</td>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border">{user.role}</td>
              <td className="p-3 border">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="mentee">Mentee</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-3 border">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}