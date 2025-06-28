import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";
import { useNavigate } from "@remix-run/react";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  skills: string[] | null;
  goals: string | null;
};

export default function ProfilePage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setBio(data.bio || "");
        setSkills((data.skills || []).join(", "));
        setGoals(data.goals || "");
        setLoading(false);
      });
  }, [isLoggedIn, navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/me/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bio,
        skills: skills.split(",").map((s) => s.trim()),
        goals,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      setMessage("✅ Profile updated successfully!");
    } else {
      setMessage(`❌ Error: ${result.message}`);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading profile…</p>;
  if (!profile) return <p className="p-6 text-red-500">User not found.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Profile</h1>

      {/* Full Profile Details */}
      <div className="mb-6 space-y-2 p-4 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Bio:</strong> {profile.bio || "No bio yet."}</p>
        <p><strong>Skills:</strong> {(profile.skills || []).join(", ") || "None listed"}</p>
        <p><strong>Goals:</strong> {profile.goals || "Not specified"}</p>
      </div>

      {/* Edit Profile */}
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <div className="space-y-4">
        <div>
          <label>Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label>Skills (comma-separated):</label>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label>Goals:</label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full p-3 bg-blue-600 text-white rounded"
        >
          Update Profile
        </button>

        {message && <p className="mt-4 text-green-600">{message}</p>}
      </div>
    </div>
  );
}
