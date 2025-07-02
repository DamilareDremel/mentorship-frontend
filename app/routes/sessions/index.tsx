import { Outlet } from "@remix-run/react";
import { useAuth } from "~/context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";

type Session = {
  id: number;
  date: string;
  time: string;
  status: string;
  mentorId: number;
  menteeId: number;
};

export default function SessionsPage() {
  const { isLoggedIn, userRole } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    const token = localStorage.getItem("token");

    // Determine correct endpoint based on role
    const endpoint =
      userRole === "mentor" ? "mentor" : "mentee";

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/sessions/${endpoint}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSessions(data);
        } else {
          console.error("Invalid sessions data:", data);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, [isLoggedIn, userRole]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Sessions</h1>

      {sessions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No sessions found.
        </p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Link key={session.id} to={`/sessions/${session.id}`}>
              <div className="p-4 border rounded bg-white dark:bg-gray-800 shadow hover:shadow-lg transition">
                <h2 className="text-xl font-semibold text-blue-600 mb-2">
                  {session.date} at {session.time}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Status: {session.status}
                </p>
                <p className="text-sm text-gray-500">
                  Session ID: {session.id}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
