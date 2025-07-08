import { useAuth } from "~/context/AuthContext";

export default function Footer() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return null;

  return (
    <footer className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-purple-800 to-blue-800 opacity-95 animate-gradient z-0"></div>

      {/* Floating bubbles scattered */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, idx) => (
          <span
            key={idx}
            className="absolute w-3 h-3 bg-white bg-opacity-20 rounded-full animate-bubble"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          ></span>
        ))}
      </div>

      <div className="relative z-10 text-white py-12 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-semibold mb-3">About Mentorship Connect</h3>
          <p className="text-sm leading-relaxed text-gray-100">
            Mentorship Connect is a platform designed to link aspiring professionals
            with experienced mentors in various industries to guide and support them.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/mentors" className="hover:underline text-gray-100">Find a Mentor</a></li>
            <li><a href="/login" className="hover:underline text-gray-100">Become a Mentor</a></li>
            <li><a href="/login" className="hover:underline text-gray-100">Login</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-100">Email: support@mentorshipconnect.com</p>
          <p className="text-sm text-gray-100">Phone: +234 123 456 7890</p>
        </div>
      </div>

      <div className="relative z-10 text-center py-6 text-xs text-gray-200">
        © {new Date().getFullYear()} Damilare Fagbenro. All rights reserved.
        <br />
        Mentorship Platform — Built with Remix, Node, Sequelize & ❤️
      </div>
    </footer>
  );
}
