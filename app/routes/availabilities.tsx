import { useState, useEffect } from "react";

type Availability = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
};

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const token = localStorage.getItem("token");

  const loadAvailabilities = () => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/availability/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then(setAvailabilities)
    .catch(console.error);
};


useEffect(() => {
  loadAvailabilities();
}, []);


  const handleAdd = () => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ day, startTime, endTime }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add availability");
      }
      return res.json();
    })
    .then((data) => {
      setAvailabilities((prev) => [...prev, data.availability]);
      setDay("");
      setStartTime("");
      setEndTime("");
    })
    .catch((err) => {
      console.error("Add availability error:", err.message);
      alert(err.message);
    });
};


const handleDelete = (id: number) => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/availability/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(() => {
      loadAvailabilities();
    })
    .catch(console.error);
};


  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Manage Availability</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Start Time</option>
          {timeSlots.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">End Time</option>
          {timeSlots.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <button
          onClick={handleAdd}
          disabled={!day || !startTime || !endTime}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {availabilities.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No availabilities added.</p>
      ) : (
        <div className="space-y-3">
          {availabilities.map((a) => (
            <div
              key={a.id}
              className="p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex justify-between items-center"
            >
              <span>
                {a.day}: {a.startTime} - {a.endTime}
              </span>
              <button
                onClick={() => handleDelete(a.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
