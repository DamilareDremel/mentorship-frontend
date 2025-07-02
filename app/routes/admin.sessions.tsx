import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";

type Session = {
  id: number;
  menteeId: number;
  mentorId: number;
  mentee?: { id: number; name: string };
  mentor?: { id: number; name: string };
  date: string;
  time: string;
  status: string;
  menteeFeedback?: string;
  menteeRating?: number;
  mentorFeedback?: string;
};


export default function AdminSessions() {
  const { isLoggedIn, userRole } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const token = localStorage.getItem("token");

  const fetchSessions = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setSessions)
      .catch(console.error);
  };

  useEffect(() => {
    if (isLoggedIn && userRole === "admin") fetchSessions();
  }, [isLoggedIn, userRole]);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/sessions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert("Session deleted!");
        fetchSessions();
      })
      .catch(console.error);
  };

  if (!isLoggedIn || userRole !== "admin") {
    return <p className="p-6">Access Denied</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">All Sessions</h1>
      {sessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        sessions.map((s) => (
          <div key={s.id} className="p-4 border rounded mb-4">
            <p><strong>Session ID:</strong> {s.id}</p>
            <p><strong>Mentee ID:</strong> {s.menteeId}</p>
            <p><strong>Mentee Name:</strong> {s.mentee?.name}</p>
            <p><strong>Mentor ID:</strong> {s.mentorId}</p>
            <p><strong>Mentor Name:</strong> {s.mentor?.name}</p>
            <p><strong>Date:</strong> {s.date}</p>
            <p><strong>Time:</strong> {s.time}</p>
            <p><strong>Status:</strong> {s.status}</p>

            {s.menteeFeedback && (
              <p><strong>Mentee Feedback:</strong> {s.menteeFeedback}</p>
            )}
            {s.menteeRating !== undefined && (
              <p><strong>Mentee Rating:</strong> {s.menteeRating} ⭐</p>
            )}
            {s.mentorFeedback && (
              <p><strong>Mentor Feedback:</strong> {s.mentorFeedback}</p>
            )}

            <button
              onClick={() => handleDelete(s.id)}
              className="mt-3 bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
