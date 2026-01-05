import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import PaymentMethodSelect from '@/components/PaymentMethodSelect';

interface PayDuesPageProps {
  users: User[];
  onPaymentSuccess?: (paidUserIds: string[]) => void;
}

type PaymentMethod = 'credit-card' | 'bank-transfer' | 'mobile-wallet';

export default function PayDues({ users, onPaymentSuccess }: PayDuesPageProps) {
  const navigate = useNavigate();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get unpaid and overdue users
  const unpaidUsers = useMemo(() => {
    return users.filter(user => 
      user.paymentStatus === 'Unpaid' || user.paymentStatus === 'Overdue'
    );
  }, [users]);

  // Calculate total amount based on selected users
  const totalAmount = useMemo(() => {
    return selectedUserIds.reduce((sum, userId) => {
      const user = unpaidUsers.find(u => u.id === userId);
      return sum + (user?.amount || 0);
    }, 0);
  }, [selectedUserIds, unpaidUsers]);

  const handleSelectAll = () => {
    if (selectedUserIds.length === unpaidUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(unpaidUsers.map(u => u.id));
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUserIds.length === 0) {
      toast.error('Please select at least one user to pay');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success(`Payment of $${totalAmount.toFixed(2)} processed successfully via ${paymentMethod.replace('-', ' ')}`);
    onPaymentSuccess?.(selectedUserIds);
    
    setIsProcessing(false);
    
    // Redirect back to main page after 2 seconds
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Pay Dues</h1>
          <p className="text-muted-foreground">
            Select users with unpaid or overdue amounts and complete the payment
          </p>
        </div>

        {/* Main Content */}
        {unpaidUsers.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">No Due Payments</h3>
            <p className="text-muted-foreground mb-4">
              All users have paid their dues. Great job!
            </p>
            <Button onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </Card>
        ) : (
          <form onSubmit={handlePayment} className="space-y-6">
            {/* Users Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Select Users to Pay ({selectedUserIds.length} of {unpaidUsers.length})
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 p-3 bg-accent/50 rounded-lg">
                  <Checkbox
                    id="select-all"
                    checked={selectedUserIds.length === unpaidUsers.length && unpaidUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="font-medium cursor-pointer flex-1">
                    Select All Users
                  </Label>
                </div>

                <div className="space-y-2">
                  {unpaidUsers.map(user => (
                    <div
                      key={user.id}
                      className={cn(
                        "flex items-center space-x-3 p-3 border border-border rounded-lg transition-colors hover:bg-accent/50",
                        selectedUserIds.includes(user.id) && "bg-primary/5 border-primary"
                      )}
                    >
                      <Checkbox
                        id={user.id}
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground">
                          {user.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-sm">
                          ${user.amount.toFixed(2)}
                        </div>
                        <div className={cn(
                          "text-xs font-medium",
                          user.paymentStatus === 'Overdue' ? "text-destructive" : "text-status-unpaid"
                        )}>
                          {user.paymentStatus}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Amount Summary */}
            <Card className="p-6 bg-primary/5 border-primary">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Fees:</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t border-primary/20 pt-3 flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Payment Method Selection */}
            <Card className="p-6">
              <PaymentMethodSelect
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </Card>

            {/* Payment Details Form */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Payment Details</h3>
              
              {paymentMethod === 'credit-card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-name" className="text-sm font-medium mb-1 block">
                      Cardholder Name
                    </Label>
                    <Input
                      id="card-name"
                      placeholder="John Doe"
                      required
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-number" className="text-sm font-medium mb-1 block">
                      Card Number
                    </Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength={19}
                      className="h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-sm font-medium mb-1 block">
                        Expiry Date
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        required
                        maxLength={5}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-sm font-medium mb-1 block">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        required
                        maxLength={3}
                        type="password"
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank-transfer' && (
                <div className="space-y-4 p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Bank transfer details will be sent to your email. Please transfer the amount to:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Bank:</span> National Bank</div>
                    <div><span className="font-medium">Account Name:</span> Company Ltd</div>
                    <div><span className="font-medium">Account Number:</span> 1234567890</div>
                    <div><span className="font-medium">Routing Number:</span> 021000021</div>
                  </div>
                </div>
              )}

              {paymentMethod === 'mobile-wallet' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wallet-email" className="text-sm font-medium mb-1 block">
                      Email / Phone Number
                    </Label>
                    <Input
                      id="wallet-email"
                      placeholder="user@example.com or +1234567890"
                      required
                      className="h-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground p-3 bg-accent/50 rounded">
                    You'll receive a payment prompt on your registered device
                  </p>
                </div>
              )}
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1 h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing || selectedUserIds.length === 0}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-10 gap-2"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                {isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
