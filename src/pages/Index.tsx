
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-elara-primary text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Elara Capital</h1>
            <div className="space-x-4">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-elara-primary" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-white text-elara-primary hover:bg-gray-100" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pt-16 pb-32 bg-gradient-to-b from-elara-primary to-elara-primary-dark text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Trusted Partner for Financial Growth</h1>
                <p className="text-xl mb-8">
                  We help individuals and small businesses access affordable loans to achieve their goals.
                </p>
                <div className="space-x-4">
                  <Button size="lg" className="bg-white text-elara-primary hover:bg-gray-100" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-elara-primary" asChild>
                    <Link to="/calculator">Loan Calculator</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Quick loan approval process</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Competitive interest rates</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Flexible repayment options</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Dedicated customer support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Loan Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Personal Loans</h3>
                <p className="text-gray-600 mb-4">
                  Quick access to funds for personal needs like medical expenses, education, or home improvements.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/register">Apply Now</Link>
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Business Loans</h3>
                <p className="text-gray-600 mb-4">
                  Support your business growth with funding for inventory, equipment, or expansion plans.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/register">Apply Now</Link>
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Emergency Loans</h3>
                <p className="text-gray-600 mb-4">
                  Fast access to emergency funding with same-day approval when you need it most.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/register">Apply Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-elara-primary flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">1</div>
                <h3 className="text-lg font-semibold mb-2">Register</h3>
                <p className="text-gray-600">
                  Create your account with a few simple steps
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-elara-primary flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">2</div>
                <h3 className="text-lg font-semibold mb-2">Apply</h3>
                <p className="text-gray-600">
                  Fill out our easy loan application form
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-elara-primary flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">3</div>
                <h3 className="text-lg font-semibold mb-2">Get Approved</h3>
                <p className="text-gray-600">
                  Receive a decision within 24 hours
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-elara-primary flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">4</div>
                <h3 className="text-lg font-semibold mb-2">Receive Funds</h3>
                <p className="text-gray-600">
                  Get your money deposited directly to your account
                </p>
              </div>
            </div>

            <div className="text-center mt-10">
              <Button size="lg" className="bg-elara-primary hover:bg-elara-primary-dark" asChild>
                <Link to="/register">Start Your Application</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Elara Capital</h3>
              <p className="text-gray-400">
                Your trusted partner for financial solutions and loans to help you achieve your goals.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/calculator" className="text-gray-400 hover:text-white">Loan Calculator</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Personal Loans</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Business Loans</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Emergency Loans</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>123 Finance Street</li>
                <li>Nairobi, Kenya</li>
                <li>Email: info@elaracapital.com</li>
                <li>Phone: +254 (0) 700 123 456</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Elara Capital. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm mr-4">Terms of Service</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
