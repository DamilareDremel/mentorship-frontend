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
  if (!rawToken) throw new Response("Unauthorized", { status: 401 });

  const token = decodeURIComponent(rawToken);

  const res = await fetch(`${process.env.VITE_API_BASE_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Response("Failed to fetch users", { status: 500 });
  const data = await res.json();
  return json(data);
};

export default function AdminUsersPage() {
  const users = useLoaderData<User[]>();
  const token = localStorage.getItem("token");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [editedSkills, setEditedSkills] = useState("");
  const [editedGoals, setEditedGoals] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("mentee");

  const [showPassword, setShowPassword] = useState(false);

  const handleRoleChange = (id: number, newRole: string) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole }),
    })
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
      .then(() => {
        alert("User deleted!");
        window.location.reload();
      })
      .catch(console.error);
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedRole(user.role);
    setEditedBio(user.bio || "");
    setEditedSkills((user.skills || []).join(", "));
    setEditedGoals(user.goals || "");
    setIsEditModalOpen(true);
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${selectedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: editedName,
        email: editedEmail,
        role: editedRole,
        bio: editedBio,
        skills: editedSkills.split(",").map((s) => s.trim()),
        goals: editedGoals,
      }),
    })
      .then(() => {
        alert("User updated!");
        setIsEditModalOpen(false);
        window.location.reload();
      })
      .catch(console.error);
  };

  const handleAddUser = () => {
    if (!newName || !newEmail || !newPassword || !newRole) {
  alert("Name, email, password, and role are required.");
  return;
}
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      }),
    })
      .then(() => {
        alert("New user added!");
        setIsAddModalOpen(false);
        window.location.reload();
      })
      .catch(console.error);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Admin: Manage Users</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + Add User
        </button>
      </div>

      <table className="table-auto w-full mb-6">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Change Role</th>
            <th className="p-3 border">Actions</th>
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
                <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleOpenEditModal(user)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Add New User</h2>

            <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-3" placeholder="Name" />
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-3" placeholder="Email" />
            <div className="relative mb-3">
  <input
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    type={showPassword ? "text" : "password"}
    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    placeholder="Password"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-2 top-2 text-sm text-blue-600"
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>

            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-3">
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex flex-wrap justify-end space-x-2 mt-4">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={handleAddUser} className="px-4 py-2 bg-green-600 text-white rounded">Add User</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Edit User</h2>

            <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-3" placeholder="Name" />
            <input value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-3" placeholder="Email" />
            <select value={editedRole} onChange={(e) => setEditedRole(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-3">
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
            <textarea value={editedBio} onChange={(e) => setEditedBio(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-3" placeholder="Bio (optional)" />
            <input value={editedSkills} onChange={(e) => setEditedSkills(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-3" placeholder="Skills (comma-separated)" />
            <textarea value={editedGoals} onChange={(e) => setEditedGoals(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-3" placeholder="Goals (optional)" />

            <div className="flex flex-wrap justify-end space-x-2 mt-4">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={handleEditUser} className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
