import { useState, useEffect } from 'react';
import { User, UserStatus, PaymentStatus } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  initialUser?: User | null;
  isEditing?: boolean;
}

const statusOptions: UserStatus[] = ['Active', 'Inactive'];
const paymentStatusOptions: PaymentStatus[] = ['Paid', 'Unpaid', 'Overdue'];

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  initialUser,
  isEditing = false,
}: UserModalProps) {
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    email: '',
    userStatus: 'Active',
    lastLogin: new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '/'),
    paymentStatus: 'Unpaid',
    dueDate: new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '/'),
    amount: 0,
  });

  useEffect(() => {
    if (initialUser) {
      setFormData(initialUser);
    } else {
      setFormData({
        id: Date.now().toString(),
        name: '',
        email: '',
        userStatus: 'Active',
        lastLogin: new Date().toLocaleDateString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).replace(/\//g, '/'),
        paymentStatus: 'Unpaid',
        dueDate: new Date().toLocaleDateString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).replace(/\//g, '/'),
        amount: 0,
      });
    }
  }, [initialUser, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value as UserStatus | PaymentStatus,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit User' : 'Add New User'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userStatus" className="text-sm font-medium">
              User Status
            </Label>
            <Select
              value={formData.userStatus}
              onValueChange={(value) => handleSelectChange('userStatus', value)}
            >
              <SelectTrigger id="userStatus" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentStatus" className="text-sm font-medium">
              Payment Status
            </Label>
            <Select
              value={formData.paymentStatus}
              onValueChange={(value) => handleSelectChange('paymentStatus', value)}
            >
              <SelectTrigger id="paymentStatus" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentStatusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (USD)
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="h-9"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="text"
              value={formData.dueDate}
              onChange={handleChange}
              placeholder="DD/MMM/YYYY"
              className="h-9"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-9"
            >
              {isEditing ? 'Update' : 'Add'} User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
