import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  fetchLoanById,
  fetchUserProfile,
  updateLoanStatus,
  recordPayment,
  fetchPaymentsForLoan,
} from "@/lib/api";
import { Loan, Payment, UserProfile, LoanStatus } from "@/types";
import { format } from "date-fns";

export default function AdminLoanDetailsPage() {
  const { loanId } = useParams<{ loanId: string }>();
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [loan, setLoan] = useState<Loan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [allocateDialogOpen, setAllocateDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    const loadLoanData = async () => {
      if (!user || !loanId) return;

      try {
        const loanData = await fetchLoanById(loanId);
        // Type assertion to ensure data is compatible with Loan type
        setLoan({
          ...loanData,
          status: loanData.status as LoanStatus
        });
        
        const profileData = await fetchUserProfile(loanData.user_id);
        setProfile(profileData);
        
        if (['allocated', 'repaid'].includes(loanData.status)) {
          const paymentData = await fetchPaymentsForLoan(loanId);
          setPayments(paymentData);
        }
      } catch (error) {
        console.error("Error loading loan data:", error);
        toast.error("Failed to load loan data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !loading) {
      loadLoanData();
    }
  }, [user, loanId, loading]);

  const handleApproveLoan = async () => {
    if (!loan || !user) return;
    
    try {
      const updatedLoan = await updateLoanStatus(loan.id, "approved", user.id);
      // Type assertion to ensure data is compatible with Loan type
      setLoan({
        ...updatedLoan,
        status: updatedLoan.status as LoanStatus
      });
      toast.success("The loan application has been approved successfully.");
      setApproveDialogOpen(false);
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve the loan. Please try again.");
    }
  };

  const handleRejectLoan = async () => {
    if (!loan) return;
    
    try {
      const updatedLoan = await updateLoanStatus(loan.id, "rejected");
      // Type assertion to ensure data is compatible with Loan type
      setLoan({
        ...updatedLoan,
        status: updatedLoan.status as LoanStatus
      });
      toast.success("The loan application has been rejected.");
      setRejectDialogOpen(false);
    } catch (error) {
      console.error("Error rejecting loan:", error);
      toast.error("Failed to reject the loan. Please try again.");
    }
  };

  const handleAllocateLoan = async () => {
    if (!loan) return;
    
    try {
      // Update loan status to allocated and set the remaining amount
      const updatedLoan = await updateLoanStatus(loan.id, "allocated", undefined, {
        remaining_amount: loan.amount + (loan.amount * 0.3)
      });
      // Type assertion to ensure data is compatible with Loan type
      setLoan({
        ...updatedLoan,
        status: updatedLoan.status as LoanStatus
      });
      toast.success("The loan has been marked as allocated successfully.");
      setAllocateDialogOpen(false);
    } catch (error) {
      console.error("Error allocating loan:", error);
      toast.error("Failed to allocate the loan. Please try again.");
    }
  };

  const handleRecordPayment = async () => {
    if (!loan || !user) return;
    
    const amount = Number(paymentAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid payment amount greater than 0.");
      return;
    }
    
    try {
      // Record the payment
      await recordPayment({
        loan_id: loan.id,
        user_id: loan.user_id,
        amount: amount,
        date: new Date().toISOString(),
      });
      
      // Refresh the loan and payments data
      const updatedLoan = await fetchLoanById(loan.id);
      // Type assertion to ensure data is compatible with Loan type
      setLoan({
        ...updatedLoan,
        status: updatedLoan.status as LoanStatus
      });
      
      const updatedPayments = await fetchPaymentsForLoan(loan.id);
      setPayments(updatedPayments);
      
      toast.success(`Payment of KSh ${amount.toLocaleString()} has been recorded successfully.`);
      setPaymentDialogOpen(false);
      setPaymentAmount("");
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record the payment. Please try again.");
    }
  };

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
      <Badge variant="outline" className={`${statusClasses[status]} capitalize px-3 py-1 text-sm`}>
        {status}
      </Badge>
    );
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elara-primary"></div>
        <p className="mt-4 text-gray-600">Loading loan details...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" />;
  }

  if (!loan || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-elara-primary text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Elara Capital Admin</h1>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-elara-primary"
                onClick={() => navigate("/admin/dashboard")}
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
            <Button onClick={() => navigate("/admin/dashboard")}>
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
            <h1 className="text-xl font-bold">Elara Capital Admin</h1>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-elara-primary"
              onClick={() => navigate("/admin/dashboard")}
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
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-elara-primary">Borrower Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="text-lg">
                      {profile.title}. {profile.first_name} {profile.middle_name} {profile.last_name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">National ID</h3>
                    <p className="text-lg">{profile.national_id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                    <p className="text-lg">{format(new Date(profile.date_of_birth), 'PPP')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Occupation</h3>
                    <p className="text-lg">{profile.occupation}</p>
                  </div>
                  {profile.employer_name && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Employer</h3>
                        <p className="text-lg">{profile.employer_name}</p>
                      </div>
                      {profile.designation && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Designation</h3>
                          <p className="text-lg">{profile.designation}</p>
                        </div>
                      )}
                    </>
                  )}
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Residential Address</h3>
                    <p className="text-lg">{profile.residential_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-elara-primary">Loan Information</CardTitle>
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
                    <p className="text-lg capitalize">{loan.payment_method}: {loan.payment_details}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Loan Purpose</h3>
                    <p className="text-lg">{loan.purpose}</p>
                  </div>
                </div>

                <div className="mt-6">
                  {loan.status === "pending" && (
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => setApproveDialogOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve Loan
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => setRejectDialogOpen(true)}
                      >
                        Reject Loan
                      </Button>
                    </div>
                  )}

                  {loan.status === "approved" && (
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => setAllocateDialogOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Mark as Allocated
                      </Button>
                    </div>
                  )}

                  {loan.status === "allocated" && (
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => setPaymentDialogOpen(true)}
                        variant="outline"
                      >
                        Record Payment
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {payments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-elara-primary">Payment History</CardTitle>
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
                <CardTitle className="text-xl text-elara-primary">Repayment Summary</CardTitle>
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

                  {loan.remaining_amount !== undefined && (
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

                  {loan.status === "allocated" && loan.remaining_amount !== undefined && loan.remaining_amount <= 0 && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <h3 className="font-medium text-green-800">Loan Fully Repaid</h3>
                      <p className="text-sm text-green-700 mt-1">
                        This loan has been fully repaid.
                      </p>
                    </div>
                  )}
                </div>

                {loan.status === "allocated" && loan.remaining_amount !== undefined && loan.remaining_amount > 0 && (
                  <div className="mt-6">
                    <Button 
                      onClick={() => setPaymentDialogOpen(true)}
                      className="w-full"
                    >
                      Record Payment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl text-elara-primary">Next of Kin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="text-lg">{profile.next_of_kin_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                    <p className="text-lg">{profile.next_of_kin_phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Relationship</h3>
                    <p className="text-lg">{profile.next_of_kin_relationship}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Loan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this loan application? This will make the loan available for disbursement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApproveLoan}
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Loan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this loan application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleRejectLoan}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Allocate Dialog */}
      <AlertDialog open={allocateDialogOpen} onOpenChange={setAllocateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Loan as Allocated</AlertDialogTitle>
            <AlertDialogDescription>
              This indicates that you have disbursed the loan funds to the borrower. 
              The loan will be marked as active, and repayments can be recorded against it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAllocateLoan}
            >
              Confirm Allocation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Dialog */}
      <AlertDialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the amount paid by the borrower. This will be recorded as a payment against the loan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label htmlFor="payment-amount" className="text-sm font-medium">
                Payment Amount (KSh)
              </label>
              <Input
                id="payment-amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleRecordPayment}
            >
              Record Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
