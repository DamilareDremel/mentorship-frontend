import { Outlet } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

type Mentor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  skills: string[] | null;
  goals: string | null;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = params;
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

  if (!token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{mentor.name}</h1>
      <p className="mb-2">Bio: {mentor.bio || "No bio yet."}</p>
      <p className="mb-2">Skills: {(mentor.skills || []).join(", ") || "None listed"}</p>
      <p className="text-sm text-gray-500">Email: {mentor.email}</p>
      <p className="text-sm text-gray-500">Goals: {mentor.goals}</p>
      <button onClick={() => navigate("/mentors")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Back to Mentors</button>
      <Outlet />
    </div>
  );
}
