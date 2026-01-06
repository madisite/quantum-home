import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PayDues() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1300));
    setIsProcessing(false);
    toast.success('Payment initiated — thank you!');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-sm p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-foreground mb-2">Pay Dues</h1>
            <p className="text-muted-foreground mb-6">
              Securely collect membership dues with a simple, modern payment experience.
            </p>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Amount due</p>
              <div className="text-3xl font-bold text-primary">$120.00</div>
            </div>
          </div>

          <div className="flex-shrink-0 self-center">
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 py-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-9 whitespace-nowrap"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              PAY DUES
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Dashboard
          </button>
          <div className="text-xs text-muted-foreground">Powered by the app</div>
        </div>
      </div>
    </div>
  );
}
