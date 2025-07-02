import { useAuth } from "~/context/AuthContext";
import { useEffect, useState } from "react";
import { Link, Outlet } from "@remix-run/react";  // ✅ import Outlet

type Mentor = {
  id: number;
  name: string;
  bio: string | null;
  skills: string[] | null;
};

export default function MentorsPage() {
  const { isLoggedIn } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/mentors`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMentors(data);
        } else {
          console.error("API returned invalid mentors list:", data);
        }
      });
  }, [isLoggedIn]);

  const filteredMentors = filter.trim() === ""
    ? mentors
    : mentors.filter((mentor) =>
        (mentor.skills || []).some((skill) =>
          skill.toLowerCase().includes(filter.toLowerCase())
        )
      );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Mentors</h1>

      <input
        type="text"
        placeholder="Filter by skill (e.g. React)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full mb-6 p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />

      <div className="grid gap-6">
        {filteredMentors.length === 0 && (
          <p className="text-gray-600 dark:text-gray-300">No mentors found.</p>
        )}

        {filteredMentors.map((mentor) => (
          <Link key={mentor.id} to={`/mentors/${mentor.id}`}>
            <div className="p-4 border rounded bg-white dark:bg-gray-800 shadow hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-blue-600">{mentor.name}</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {mentor.bio || "No bio yet."}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Skills: {(mentor.skills || []).join(", ") || "None listed"}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
