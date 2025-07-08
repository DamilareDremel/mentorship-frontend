import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/ThemeContext";
import { useNavigate } from "@remix-run/react";
import {
  NotificationProvider,
  useNotification,
} from "./context/NotificationContext";

import "./tailwind.css";
import Footer from "~/components/Footer";

import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Mentorship Connect" },
    {
      name: "Find Mentors & Grow",
      content: "A mentorship platform connecting mentees with mentors for career and personal growth.",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <head>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Mentorship Connect | Find Mentors & Grow" />
        <meta property="og:description" content="A mentorship platform connecting mentees with mentors for career and personal growth." />
        <meta property="og:image" content="/preview.png" />
        <meta property="og:url" content="https://mentorship-connect-alpha.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <Meta />
        <Links />
    </head>

      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


export default function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}

function MainApp() {
  const { isLoggedIn, userName, userRole, logout, isAuthReady } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { showMessage } = useNotification();

  // Wait for auth context to initialize before rendering nav + pages
  if (!isAuthReady) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        Loading application...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="flex flex-wrap justify-between p-4 bg-blue-600 text-white">
      <div className="flex flex-wrap gap-2">
          {!isLoggedIn && <Link to="/">Home</Link>}
          {/*!isLoggedIn && <Link to="/register">Register</Link>*/}
          {isLoggedIn && userRole === "mentee" && <Link to="/mentors">Mentors |</Link>}
          {isLoggedIn && userRole === "mentor" && (
          <Link to="/availabilities">My Availability |</Link>)}
          {isLoggedIn && userRole === "mentor" && (
          <Link to="/mentor-requests">Requests |</Link>)}
          {isLoggedIn && userRole === "mentee" && (
          <Link to="/requests">My Requests |</Link>)}
          {isLoggedIn && userRole !== "admin" && <Link to="/sessions">Sessions |</Link>}
      
          {userRole === "admin" && (
          <>
            <Link to="/admin/index" className="...">Admin Dashboard |</Link>
            <a href="/admin/users" className="...">Manage Users |</a>
            <a href="/admin/requests" className="...">All Requests |</a>
            <a href="/admin/sessions" className="...">All Sessions |</a>
            <a href="/admin/assign" className="...">Assign Match |</a>
          </>
      )}
          {isLoggedIn && <Link to="/profile">View Profile</Link>}
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={toggleTheme}>
            {theme === "light" ? "🌞 Light" : "🌙 Dark"}
          </button>
          {isLoggedIn && <span>Hello, {userName}</span>}
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                showMessage("Logged out successfully!");
                navigate("/login");
              }}
              className="bg-red-600 px-3 py-1 rounded text-white"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-green-600 px-3 py-1 rounded text-white">
              Login
            </Link>
          )}
        </div>
      </nav>

      <Outlet />
      <Footer />
    </div>
  );
}
