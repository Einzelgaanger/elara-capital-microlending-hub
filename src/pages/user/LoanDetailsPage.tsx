
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loan, Payment, LoanStatus } from "@/types";
import { format } from "date-fns";

export default function LoanDetailsPage() {
  const { loanId } = useParams<{ loanId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loan, setLoan] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!user || !loanId) return;

      try {
        // Fetch the loan details
        const { data: loanData, error: loanError } = await supabase
          .from("loans")
          .select("*")
          .eq("id", loanId)
          .eq("user_id", user.id)
          .single();

        if (loanError) throw loanError;
        
        // Type assertion to ensure data is compatible with Loan type
        setLoan({
          ...loanData,
          status: loanData.status as LoanStatus
        });

        // Fetch payments if loan is allocated or repaid
        if (['allocated', 'repaid'].includes(loanData.status)) {
          const { data: paymentsData, error: paymentsError } = await supabase
            .from("payments")
            .select("*")
            .eq("loan_id", loanId)
            .order("date", { ascending: false });

          if (paymentsError) throw paymentsError;
          setPayments(paymentsData);
        }
      } catch (error: any) {
        console.error("Error fetching loan details:", error);
        toast.error("Failed to load loan details. Please try again.");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanDetails();
  }, [user, loanId, navigate]);

  // Helper function to get status badge
  const getStatusBadge = (status: LoanStatus) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      allocated: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      repaid: "bg-purple-100 text-purple-800",
    };

    return (
      <Badge className={`${statusClasses[status]} capitalize px-3 py-1 text-sm`}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elara-primary"></div>
        <p className="mt-4 text-gray-600">Loading loan details...</p>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-elara-primary text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Elara Capital</h1>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-elara-primary"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Loan Not Found</h2>
            <p className="text-gray-600 mb-6">
              The loan you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Calculate interest and total repayment
  const interest = loan.amount * 0.3;
  const totalRepayment = loan.amount + interest;

  // Calculate total payments made
  const totalPaidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-elara-primary text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Elara Capital</h1>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-elara-primary"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Loan Details</h1>
          <div className="flex items-center">
            <span className="mr-2">Status:</span>
            {getStatusBadge(loan.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Loan Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Loan Amount</h3>
                    <p className="text-lg font-semibold">KSh {loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Repayment Period</h3>
                    <p className="text-lg">{loan.repayment_period} days</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Application Date</h3>
                    <p className="text-lg">{format(new Date(loan.created_at), 'PPP')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                    <p className="text-lg capitalize">{loan.payment_method.replace('_', ' ')}: {loan.payment_details}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Loan Purpose</h3>
                  <p className="text-lg mt-1">{loan.purpose}</p>
                </div>

                {loan.status === "rejected" && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <h3 className="font-medium text-red-800">Loan Rejected</h3>
                    <p className="text-sm text-red-700 mt-1">
                      We're sorry, but your loan application has been rejected.
                      Please contact our customer support for more information.
                    </p>
                  </div>
                )}

                {loan.status === "pending" && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h3 className="font-medium text-yellow-800">Under Review</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your loan application is currently under review.
                      We'll notify you once a decision has been made.
                    </p>
                  </div>
                )}

                {loan.status === "approved" && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h3 className="font-medium text-blue-800">Loan Approved</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Congratulations! Your loan has been approved.
                      Funds will be disbursed shortly.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {payments.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {payments.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-4 py-3 text-sm">{format(new Date(payment.date), 'PPP')}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium">KSh {payment.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">Total Paid</td>
                          <td className="px-4 py-3 text-sm text-right font-bold">KSh {totalPaidAmount.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Repayment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Principal Amount</h3>
                    <p className="text-lg font-semibold">KSh {loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Interest (30%)</h3>
                    <p className="text-lg font-semibold">KSh {interest.toLocaleString()}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Total Repayment</h3>
                    <p className="text-xl font-bold text-elara-primary">KSh {totalRepayment.toLocaleString()}</p>
                  </div>

                  {loan.status === "allocated" && loan.remaining_amount !== undefined && (
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500">Remaining Balance</h3>
                      <p className="text-xl font-bold text-elara-primary">KSh {loan.remaining_amount.toLocaleString()}</p>
                    </div>
                  )}

                  {payments.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
                      <p className="text-xl font-bold text-green-600">KSh {totalPaidAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {loan.status === "allocated" && loan.remaining_amount !== undefined && loan.remaining_amount <= 0 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="font-medium text-green-800">Loan Fully Repaid</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Congratulations! You have fully repaid this loan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {loan.status === "allocated" && loan.allocated_at && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Allocation Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Allocation Date</h3>
                    <p className="text-lg">{format(new Date(loan.allocated_at), 'PPP')}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
