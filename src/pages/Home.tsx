
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
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

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Fast and Reliable Loans for Your Needs</h1>
          <p className="text-xl text-gray-600 mb-8">
            Elara Capital offers quick loans with competitive rates and flexible repayment options.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="px-8 py-6 text-lg" asChild>
              <Link to="/register">Apply Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
              <Link to="/calculator">Loan Calculator</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">© 2025 Elara Capital. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/about" className="text-gray-600 hover:text-elara-primary">About</Link>
              <Link to="/terms" className="text-gray-600 hover:text-elara-primary">Terms</Link>
              <Link to="/privacy" className="text-gray-600 hover:text-elara-primary">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
