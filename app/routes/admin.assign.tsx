import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";

type User = {
  id: number;
  name: string;
  role: string;
};

export default function AssignMatch() {
  const { isLoggedIn, userRole } = useAuth();
  const [mentors, setMentors] = useState<User[]>([]);
  const [mentees, setMentees] = useState<User[]>([]);
  const [mentorId, setMentorId] = useState("");
  const [menteeId, setMenteeId] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn && userRole === "admin") {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setMentors(data.filter((u: User) => u.role === "mentor"));
          setMentees(data.filter((u: User) => u.role === "mentee"));
        })
        .catch(console.error);
    }
  }, [isLoggedIn, userRole, token]);

  const handleAssign = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/assign-match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        menteeId: Number(menteeId),
        mentorId: Number(mentorId),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            alert(data.message);
            throw new Error(data.message);
          });
        }
        return res.json();
      })
      .then((data) => {
        alert(`Match assigned successfully!\nNew Request ID: ${data.newRequest.id}`);
        setMenteeId("");
        setMentorId("");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  if (!isLoggedIn || userRole !== "admin") {
    return <p className="p-6">Access Denied</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Assign Mentor to Mentee</h1>

      <div className="space-y-4">
        <select
          value={menteeId}
          onChange={(e) => setMenteeId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select Mentee</option>
          {mentees.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          value={mentorId}
          onChange={(e) => setMentorId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select Mentor</option>
          {mentors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          disabled={!menteeId || !mentorId || loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Assigning..." : "Assign Match"}
        </button>
      </div>
    </div>
  );
}
