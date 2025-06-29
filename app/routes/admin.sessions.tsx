import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";

type Session = {
  id: number;
  menteeId: number;
  mentorId: number;
  date: string;
  time: string;
  status: string;
  menteeFeedback: string | null;
  mentorFeedback: string | null;
  requestId: number;
};

export default function AdminSessions() {
  const { userRole } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userRole === "admin") {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setSessions)
        .catch(console.error);
    }
  }, [userRole]);

  if (userRole !== "admin") return <p className="p-6">Access Denied</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">All Mentorship Sessions</h1>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        sessions.map((session) => (
          <div key={session.id} className="p-3 border mb-3 rounded">
            <p>Session ID: {session.id}</p>
            <p>Mentee ID: {session.menteeId}</p>
            <p>Mentor ID: {session.mentorId}</p>
            <p>Date: {session.date}</p>
            <p>Time: {session.time}</p>
            <p>Status: {session.status}</p>
            <p>Mentee Feedback: {session.menteeFeedback || "None"}</p>
            <p>Mentor Feedback: {session.mentorFeedback || "None"}</p>
            <p>Request ID: {session.requestId}</p>
          </div>
        ))
      )}
    </div>
  );
}