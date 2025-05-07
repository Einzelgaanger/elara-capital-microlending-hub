import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Elara Capital</h1>
            <div className="space-x-4">
              <Link to="/login" className="px-4 py-2 rounded-md border border-white text-white hover:bg-white hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 rounded-md bg-white text-blue-600 hover:bg-gray-100 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Your Trusted Financial Partner</h2>
            <p className="text-xl text-gray-600 mb-8">
              Empowering individuals and businesses with accessible financial solutions
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
              <Link to="/about" className="px-6 py-3 rounded-md border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Elara Capital?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Competitive Rates</h3>
              <p className="text-gray-600">
                Enjoy some of the most competitive interest rates in the market
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Quick Process</h3>
              <p className="text-gray-600">
                Fast approval and disbursement within 24-48 hours
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Secure & Reliable</h3>
              <p className="text-gray-600">
                Your financial security is our top priority
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">About Elara Capital</h2>
            <p className="text-lg text-gray-600 mb-8">
              Elara Capital is a leading financial institution dedicated to providing accessible
              and reliable financial solutions. We believe in empowering our clients through
              transparent and efficient services.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Our Mission</h3>
                <p className="text-gray-600">
                  To provide accessible financial solutions that empower individuals and
                  businesses to achieve their goals.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Our Vision</h3>
                <p className="text-gray-600">
                  To be the most trusted financial partner, known for our integrity,
                  innovation, and customer-centric approach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Elara Capital</h3>
              <p className="text-gray-400">
                Your trusted partner in financial growth and success.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@elaracapital.com</li>
                <li>Phone: +254 123 456 789</li>
                <li>Address: Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Elara Capital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
