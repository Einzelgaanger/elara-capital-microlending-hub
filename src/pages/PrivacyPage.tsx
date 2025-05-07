
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-elara-primary text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">Elara Capital</Link>
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
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="mb-4">Placeholder for privacy policy content</p>
        <Button asChild className="mt-4">
          <Link to="/">Back to Home</Link>
        </Button>
      </main>
    </div>
  );
}
