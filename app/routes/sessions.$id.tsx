import { useAuth } from "~/context/AuthContext";
import { useLoaderData, json, redirect } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useState } from "react";

type Session = {
  id: number;
  date: string;
  time: string;
  status: string;
  menteeId: number;
  mentorId: number;
  menteeFeedback?: string;
  mentorFeedback?: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = params;
  const cookie = request.headers.get("cookie") || "";
const rawToken = cookie.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

if (!rawToken) {
  throw new Response("Unauthorized", { status: 401 });
}

const token = decodeURIComponent(rawToken); // 👈 decode URL-encoded string
console.log("DECODED TOKEN:", token);

  const res = await fetch(`${process.env.VITE_API_BASE_URL}/api/sessions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
console.log("headers:", request.headers);

  if (!res.ok) {
    throw new Response("Session not found", { status: 404 });
  }

  const data = await res.json();
  return json(data);
};


export default function SessionDetails() {
  const { userRole } = useAuth();
  const session = useLoaderData<Session>();

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const token = localStorage.getItem("token");

  const handleSubmit = () => {
    const payload: any = {};
    if (userRole === "mentee") {
      payload.menteeFeedback = feedback;
      payload.menteeRating = rating;
    } else {
      payload.mentorFeedback = feedback;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sessions/${session.id}/feedback`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        window.location.href = "/sessions";
      })
      .catch(console.error);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Session Details</h1>
      <p>Date: {session.date}</p>
      <p>Time: {session.time}</p>
      <p>Status: {session.status}</p>
      <p>Mentee ID: {session.menteeId}</p>
      <p>Mentor ID: {session.mentorId}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Submit Feedback</h2>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full p-3 mb-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        {userRole === "mentee" && (
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-16 p-2 mb-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
