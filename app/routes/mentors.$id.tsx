import { Outlet } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useAuth } from "~/context/AuthContext";
import { useEffect, useState } from "react";

type Mentor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  skills: string[] | null;
  goals: string | null;
};

type Availability = {
  id: number;
  mentorId: number;
  day: string;
  startTime: string;
  endTime: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = params;
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

  if (!token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Response("Mentor not found", { status: 404 });
  }

  const data = await res.json();
  return json(data);
};

export default function MentorDetails() {
  const mentor = useLoaderData<Mentor>();
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const [availability, setAvailability] = useState<Availability[]>([]);
  const token = localStorage.getItem("token");

  // Fetch availability on load
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/availability/${mentor.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAvailability(data);
      });
  }, [mentor.id, token]);

  // Function to handle mentorship request
  const handleRequest = () => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/sent`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((requests) => {
      const existing = requests.find(
        (r: any) =>
          r.mentorId === mentor.id &&
          (r.status === "PENDING" || r.status === "ACCEPTED")
      );

      if (existing) {
        alert("You already have a pending or active mentorship request with this mentor.");
        return;
      }

      // No existing request — send new one
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mentorId: mentor.id }),
      })
        .then((res) => res.json())
        .then(() => {
          alert("Mentorship request sent successfully!");
        })
        .catch(console.error);
    })
    .catch(console.error);
};


  // 📌 New: Book session handler
  const handleBookSession = (day: string, startTime: string) => {
    const today = new Date();
    // Pick next available date for the selected day
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = daysOfWeek.indexOf(day);
    const diff =
      (dayIndex + 7 - today.getDay() + (today.getDay() === dayIndex ? 7 : 0)) % 7 || 7;
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
        mentorId: mentor.id,
        date: formattedDate,
        time: startTime,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session booking failed.");
        return res.json();
      })
      .then(() => {
        alert(`Session booked for ${day} at ${startTime}`);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{mentor.name}</h1>
      <p className="mb-2">Bio: {mentor.bio || "No bio yet."}</p>
      <p className="mb-2">Skills: {(mentor.skills || []).join(", ") || "None listed"}</p>
      <p className="text-sm text-gray-500">Email: {mentor.email}</p>
      <p className="text-sm text-gray-500">Goals: {mentor.goals}</p>

      {userRole === "mentee" && (
        <button
          onClick={handleRequest}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Request Mentorship
        </button>
      )}
<br></br>
      <button
        onClick={() => navigate("/mentors")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back to Mentors
      </button>

      <Outlet />
    </div>
  );
}
