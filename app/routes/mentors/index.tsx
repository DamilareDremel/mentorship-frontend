import { useAuth } from "~/context/AuthContext";
import { useEffect, useState } from "react";

type Mentor = {
  id: number;
  name: string;
  bio: string | null;
  email: string | null;
  goals: string | null;
  skills: string[] | null;
};

type Availability = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
};

export default function MentorsPage() {
  const { isLoggedIn, userRole } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/mentors`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMentors(data));
  }, [isLoggedIn]);

  const filteredMentors = filter.trim() === ""
    ? mentors
    : mentors.filter((mentor) =>
        (mentor.skills || []).some((skill) =>
          skill.toLowerCase().includes(filter.toLowerCase())
        )
      );

  const openMentorModal = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    fetchAvailability(mentor.id);
    setIsModalOpen(true);
  };

  const fetchAvailability = (mentorId: number) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/availability/${mentorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAvailability)
      .catch(console.error);
  };

  const handleRequestMentorship = (mentorId: number) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/sent`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((requests) => {
        const existing = requests.find(
          (r: any) =>
            r.mentorId === mentorId &&
            (r.status === "PENDING" || r.status === "ACCEPTED")
        );
        if (existing) {
          alert("You already have a pending or active mentorship request.");
          return;
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mentorId }),
        })
          .then((res) => res.json())
          .then(() => alert("Mentorship request sent successfully!"))
          .catch(console.error);
      });
  };

  const handleBookSession = (mentorId: number, day: string, startTime: string) => {
    const today = new Date();
    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const dayIndex = daysOfWeek.indexOf(day);
    const diff = (dayIndex + 7 - today.getDay()) % 7 || 7;
    const sessionDate = new Date(today);
    sessionDate.setDate(today.getDate() + diff);
    const formattedDate = sessionDate.toISOString().split("T")[0];

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mentorId,
        date: formattedDate,
        time: startTime,
      }),
    })
      .then((res) => res.json())
      .then(() => alert(`Session booked for ${day} at ${startTime}`))
      .catch(console.error);
  };

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
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            onClick={() => openMentorModal(mentor)}
            className="cursor-pointer p-4 border rounded bg-white dark:bg-gray-800 shadow hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold text-blue-600">{mentor.name}</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              {mentor.bio || "No bio yet."}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Skills: {(mentor.skills || []).join(", ") || "None listed"}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedMentor && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full relative overflow-y-auto max-h-[90vh]">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-3 text-blue-600">{selectedMentor.name}</h2>
      <p className="mb-2"><strong>Bio:</strong> {selectedMentor.bio || "No bio available."}</p>
      <p className="mb-2"><strong>Email:</strong> {selectedMentor.email || "N/A"}</p>
      <p className="mb-2"><strong>Goals:</strong> {selectedMentor.goals || "N/A"}</p>
      <p className="mb-2"><strong>Skills:</strong> {(selectedMentor.skills || []).join(", ") || "None listed"}</p>

      {userRole === "mentee" && (
        <button
          onClick={() => handleRequestMentorship(selectedMentor.id)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Request Mentorship
        </button>
      )}
    </div>
  </div>
)}
    </div>
  );
}
