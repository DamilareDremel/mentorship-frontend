import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";

type Request = {
  id: number;
  menteeId: number;
  mentorId: number;
  mentee?: { id: number; name: string };
  mentor?: { id: number; name: string };
  status: string;
};

export default function AdminRequests() {
  const { isLoggedIn, userRole } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const token = localStorage.getItem("token");

  const fetchRequests = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setRequests)
      .catch(console.error);
  };

  useEffect(() => {
    if (isLoggedIn && userRole === "admin") fetchRequests();
  }, [isLoggedIn, userRole]);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/requests/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert("Request deleted!");
        fetchRequests();
      })
      .catch(console.error);
  };

  if (!isLoggedIn || userRole !== "admin") {
    return <p className="p-6">Access Denied</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">All Requests</h1>
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="p-4 border rounded mb-3">
            <p>Request ID: {req.id}</p>
            <p>Mentee ID: {req.menteeId}</p>
            <p>Mentee Name: {req.mentee?.name}</p>
            <p>Mentor ID: {req.mentorId}</p>
            <p>Mentor Name: {req.mentor?.name}</p>
            <p>Status: {req.status}</p>
            <button
              onClick={() => handleDelete(req.id)}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
