import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Mentorship Connect | Find Mentors & Grow" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function HomePage() {
  return (
    <div className="text-gray-800 dark:text-gray-100">
      {/* Hero Section */}
      <section
        className="text-white text-center py-24 bg-cover bg-center"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Unlock Your Potential</h1>
        <p className="max-w-xl mx-auto text-lg mb-8">
          Connect with experienced mentors to accelerate your career and personal growth.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/mentors">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded">Find a Mentor</button>
          </Link>
          <Link to="/login">
            <button className="border border-white px-6 py-3 rounded">Become a Mentor</button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-blue-600">500+</h2>
              <p className="mt-2">Active Mentors</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-blue-600">2000+</h2>
              <p className="mt-2">Successful Matches</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-blue-600">95%</h2>
              <p className="mt-2">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Why Choose Our Platform?</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-5xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold mb-2">Expert Mentors</h3>
            <p>Work with industry experts who've walked the path you’re taking.</p>
          </div>
          <div>
            <div className="text-5xl mb-4">🗓️</div>
            <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
            <p>Book sessions that fit your schedule with our flexible options.</p>
          </div>
          <div>
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
            <p>Thousands of mentees have reached their goals through us.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
