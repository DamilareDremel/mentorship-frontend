import { useAuth } from "~/context/AuthContext";

export default function Footer() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return null;
  
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About */}
        <div>
          <h3 className="text-xl font-semibold mb-3">About Mentorship Connect</h3>
          <p className="text-sm leading-relaxed">
            Mentorship Connect is a platform designed to link aspiring professionals
            with experienced mentors in various industries to guide and support them.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/mentors" className="hover:underline">Find a Mentor</a></li>
            <li><a href="/login" className="hover:underline">Become a Mentor</a></li>
            <li><a href="/login" className="hover:underline">Login</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>
          <p className="text-sm">Email: support@mentorshipconnect.com</p>
          <p className="text-sm">Phone: +234 123 456 7890</p>
        </div>
      </div>
      <div className="text-center mt-8 text-sm text-gray-400">
        © {new Date().getFullYear()} Damilare Fagbenro. All rights reserved.
        <br />
        Mentorship Platform — Built with Remix, Node, Sequelize & ❤️
      </div>
    </footer>
  );
}
