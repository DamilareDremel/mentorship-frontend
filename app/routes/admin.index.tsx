import { useAuth } from "~/context/AuthContext";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { isLoggedIn, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || userRole !== "admin") {
      navigate("/login");
    }
  }, [isLoggedIn, userRole, navigate]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome Admin!</h1>
      <p className="text-lg mb-4">You have full control of users, requests, and sessions.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/admin/users" className="block bg-blue-600 text-white p-4 rounded text-center hover:bg-blue-700">👥 Manage Users</a>
        <a href="/admin/requests" className="block bg-green-600 text-white p-4 rounded text-center hover:bg-green-700">📄 View Requests</a>
        <a href="/admin/sessions" className="block bg-purple-600 text-white p-4 rounded text-center hover:bg-purple-700">📅 View Sessions</a>
        <a href="/admin/assign"className="block bg-yellow-600 text-white p-4 rounded text-center hover:bg-yellow-700">🎯 Assign Match</a>
      </div>
    </div>
  );
}
