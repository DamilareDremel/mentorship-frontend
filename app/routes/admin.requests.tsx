import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";

type Request = {
  id: number;
  menteeId: number;
  mentorId: number;
  status: string;
  createdAt: string;
};

export default function AdminRequests() {
  const { userRole } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userRole === "admin") {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setRequests)
        .catch(console.error);
    }
  }, [userRole]);

  if (userRole !== "admin") return <p className="p-6">Access Denied</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">All Mentorship Requests</h1>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="p-3 border mb-3 rounded">
            <p>Request ID: {req.id}</p>
            <p>Mentee ID: {req.menteeId}</p>
            <p>Mentor ID: {req.mentorId}</p>
            <p>Status: {req.status}</p>
            <p>Created: {new Date(req.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
