import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';

type PaymentMethod = 'credit-card' | 'bank-transfer' | 'mobile-wallet';

interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const methods = [
  {
    id: 'credit-card',
    label: 'Credit Card',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCard,
  },
  {
    id: 'bank-transfer',
    label: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: Banknote,
  },
  {
    id: 'mobile-wallet',
    label: 'Mobile Wallet',
    description: 'Apple Pay, Google Pay',
    icon: Smartphone,
  },
];

export default function PaymentMethodSelect({
  value,
  onChange,
}: PaymentMethodSelectProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Select Payment Method</h3>
      <RadioGroup value={value} onValueChange={(val) => onChange(val as PaymentMethod)}>
        <div className="space-y-3">
          {methods.map((method) => {
            const Icon = method.icon;
            return (
              <div key={method.id} className="flex items-center space-x-3">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label
                  htmlFor={method.id}
                  className="flex-1 cursor-pointer rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{method.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {method.description}
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
}
