import { useAuth } from "~/context/AuthContext";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

type Session = {
  id: number;
  date: string;
  time: string;
  status: string;
  mentor: { id: number; name: string };
  mentee: { id: number; name: string };
  menteeFeedback?: string | null;
  menteeRating?: number | null;
  mentorFeedback?: string | null;
};

export default function SessionsPage() {
  const { isLoggedIn, userRole } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    const endpoint = userRole === "mentor" ? "mentor" : "mentee";
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sessions/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
        else console.error("Invalid sessions data:", data);
      })
      .catch(console.error);
  }, [isLoggedIn, userRole]);

  const handleFeedbackSubmit = (sessionId: number) => {
    const payload: any = {};
    if (userRole === "mentee") {
      payload.menteeFeedback = feedback;
      payload.menteeRating = rating;
    } else {
      payload.mentorFeedback = feedback;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sessions/${sessionId}/feedback`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        alert("Feedback submitted!");
        setSelectedSession(null);
        window.location.reload();
      })
      .catch(console.error);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Sessions</h1>

      {sessions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No sessions found.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className="p-4 border rounded bg-white dark:bg-gray-800 shadow hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-2">
                {session.date} at {session.time}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">Status: {session.status}</p>
              <p className="text-sm text-gray-500">Session ID: {session.id}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={!!selectedSession} onClose={() => setSelectedSession(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded shadow-lg max-w-lg w-full">
            <Dialog.Title className="text-xl font-bold mb-3 text-blue-600">
              Session Details
            </Dialog.Title>

            {selectedSession && (
              <>
                <p>Date: {selectedSession.date}</p>
                <p>Time: {selectedSession.time}</p>
                <p>Status: {selectedSession.status}</p>
                <p>Mentee: {selectedSession.mentee.name}</p>
                <p>Mentor: {selectedSession.mentor.name}</p>

                <div className="mt-4 space-y-2">
                  {selectedSession.menteeFeedback && (
                    <div>
                      <strong>Mentee Feedback:</strong>
                      <p>{selectedSession.menteeFeedback}</p>
                      <p className="text-sm text-gray-500">Rating: {selectedSession.menteeRating}/5</p>
                    </div>
                  )}
                  {selectedSession.mentorFeedback && (
                    <div>
                      <strong>Mentor Feedback:</strong>
                      <p>{selectedSession.mentorFeedback}</p>
                    </div>
                  )}
                </div>

                {/* Feedback form */}
                {((userRole === "mentee" && !selectedSession.menteeFeedback) ||
                  (userRole === "mentor" && !selectedSession.mentorFeedback)) && (
                  <div className="mt-6">
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Write your feedback..."
                      className="w-full p-2 mb-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    {userRole === "mentee" && (
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-20 p-2 mb-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    )}
                    <button
                      onClick={() => handleFeedbackSubmit(selectedSession.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                      disabled={!feedback}
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setSelectedSession(null)}
                  className="mt-6 text-sm text-red-600"
                >
                  Close
                </button>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
