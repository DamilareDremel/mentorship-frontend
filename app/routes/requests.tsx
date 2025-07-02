import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";

type Request = {
  id: number;
  menteeId: number;
  mentorId: number;
  status: string;
  mentor?: { id: number; name: string };
};


type Session = {
  id: number;
  menteeId: number;
  mentorId: number;
  requestId: number;
  status: string;
};

type Availability = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
};

export default function MenteeRequests() {
  const { isLoggedIn, userRole } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [availabilities, setAvailabilities] = useState<{ [key: number]: Availability[] }>({});
  const [openMentorIds, setOpenMentorIds] = useState<number[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn && userRole === "mentee") {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/sent`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setRequests)
        .catch(console.error);

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sessions/mentee`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setSessions)
        .catch(console.error);
    }
  }, [isLoggedIn, userRole]);

  const handleViewAvailability = (mentorId: number, requestId: number) => {
    const isOpen = openMentorIds.includes(requestId);
    if (isOpen) {
      setOpenMentorIds((prev) => prev.filter((id) => id !== requestId));
    } else {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/availability/${mentorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setAvailabilities((prev) => ({ ...prev, [requestId]: data }));
          setOpenMentorIds((prev) => [...prev, requestId]);
        })
        .catch(console.error);
    }
  };

  const hasActiveSessionForRequest = (requestId: number) => {
    return sessions.some(
      (session) =>
        session.requestId === requestId &&
        (session.status === "SCHEDULED" || session.status === "COMPLETED")
    );
  };

  const handleBookSession = (mentorId: number, requestId: number, day: string, time: string) => {
    const date = "2025-07-01"; // Hardcoded for now or you can pick with date picker
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mentorId, requestId, date, time }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Session booked successfully!");
        window.location.reload();
      })
      .catch(console.error);
  };

  if (!isLoggedIn || userRole !== "mentee") {
    return <p className="p-6">Access Denied</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">My Mentorship Requests</h1>
      {requests.length === 0 ? (
        <p>No sent requests yet.</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="p-4 border mb-3 rounded">
            <p>Request ID: {req.id}</p>
            <p>Mentor ID: {req.mentorId}</p>
            <p>Mentor: {req.mentor?.name}</p>
            <p>Status: {req.status}</p>

            {req.status === "ACCEPTED" && !hasActiveSessionForRequest(req.id) && (
              <button
                onClick={() => handleViewAvailability(req.mentorId, req.id)}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
              >
                {openMentorIds.includes(req.id) ? "Hide Availability" : "View Availability"}
              </button>
            )}

            {openMentorIds.includes(req.id) && (
              <div className="mt-2 space-y-2">
                {(availabilities[req.id] || []).map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span>
                      {slot.day}: {slot.startTime} - {slot.endTime}
                    </span>
                    <button
                      onClick={() =>
                        handleBookSession(req.mentorId, req.id, slot.day, slot.startTime)
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
