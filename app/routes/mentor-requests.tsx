import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";

type Request = {
  id: number;
  menteeId: number;
  mentorId: number;
  status: string;
};

export default function MentorRequests() {
  const { isLoggedIn, userRole } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn && userRole === "mentor") {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/received`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setRequests(data))
        .catch(console.error);
    }
  }, [isLoggedIn, userRole]);

  const handleUpdate = (id: number, status: string) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then(() => {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status } : req
          )
        );
      })
      .catch(console.error);
  };

  if (!isLoggedIn || userRole !== "mentor") {
    return <p className="p-6">Access Denied</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Mentorship Requests</h1>
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="p-4 border mb-3 rounded">
            <p>Mentee ID: {req.menteeId}</p>
            <p>Status: {req.status}</p>
            {req.status === "PENDING" && (
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleUpdate(req.id, "ACCEPTED")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleUpdate(req.id, "REJECTED")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
