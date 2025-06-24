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
import { NotificationProvider, useNotification } from "./context/NotificationContext";


import "./tailwind.css";

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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
  const { isLoggedIn, userName, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { showMessage } = useNotification();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="flex justify-between p-4 bg-blue-600 text-white">
        <div className="flex gap-4">
          {!isLoggedIn && <Link to="/">Home</Link>}
          {!isLoggedIn && <Link to="/register">Register</Link>}
          <Link to="/mentors">Mentors</Link>
          <Link to="/sessions">Sessions</Link>
          <Link to="/admin">Admin</Link>
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
  <Link
    to="/login"
    className="bg-green-600 px-3 py-1 rounded text-white"
  >
    Login
  </Link>
)}
        </div>
      </nav>

      <Outlet />
    </div>
  );
}
