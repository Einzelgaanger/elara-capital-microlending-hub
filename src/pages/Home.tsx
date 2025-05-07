import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <h1 className="text-2xl font-bold">Elara Capital</h1>
          <nav className="nav">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gray-100">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Your Trusted Financial Partner</h2>
            <p className="text-xl text-gray-600 mb-8">
              Empowering individuals and businesses with accessible financial solutions
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="btn btn-primary">Get Started</Link>
              <Link to="/about" className="btn btn-outline">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Elara Capital?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Competitive Rates</h3>
              <p className="text-gray-600">
                Enjoy some of the most competitive interest rates in the market
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Quick Process</h3>
              <p className="text-gray-600">
                Fast approval and disbursement within 24-48 hours
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Your financial security is our top priority
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-100">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Elara Capital</h2>
            <p className="text-lg text-gray-600 mb-8">
              Elara Capital is a leading financial institution dedicated to providing accessible
              and reliable financial solutions. We believe in empowering our clients through
              transparent and efficient services.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To provide accessible financial solutions that empower individuals and
                  businesses to achieve their goals.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
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
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Elara Capital</h3>
              <p className="text-gray-400">
                Your trusted partner in financial growth and success.
              </p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <ul>
                <li>Email: info@elaracapital.com</li>
                <li>Phone: +254 123 456 789</li>
                <li>Address: Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Elara Capital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
