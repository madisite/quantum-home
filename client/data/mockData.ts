export type UserStatus = 'Active' | 'Inactive';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Overdue';

export interface User {
  id: string;
  name: string;
  email: string;
  userStatus: UserStatus;
  lastLogin: string;
  paymentStatus: PaymentStatus;
  dueDate: string;
  amount: number;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Erin Levin',
    email: 'example@email.com',
    userStatus: 'Active',
    lastLogin: '14/APR/2020',
    paymentStatus: 'Paid',
    dueDate: '10/APR/2020',
    amount: 200,
  },
  {
    id: '2',
    name: 'Jaxson Siphon',
    email: 'example@email.com',
    userStatus: 'Inactive',
    lastLogin: '14/APR/2020',
    paymentStatus: 'Paid',
    dueDate: '10/APR/2020',
    amount: 750,
  },
  {
    id: '3',
    name: 'Mira Levin',
    email: 'example@email.com',
    userStatus: 'Active',
    lastLogin: '14/APR/2020',
    paymentStatus: 'Unpaid',
    dueDate: '10/APR/2020',
    amount: 200,
  },
  {
    id: '4',
    name: 'Phillip Saris',
    email: 'example@email.com',
    userStatus: 'Inactive',
    lastLogin: '14/APR/2020',
    paymentStatus: 'Paid',
    dueDate: '10/APR/2020',
    amount: 370,
  },
  {
    id: '5',
    name: 'Phillip Saris',
    email: 'example@email.com',
    userStatus: 'Inactive',
    lastLogin: '14/APR/2020',
    paymentStatus: 'Unpaid',
    dueDate: '10/APR/2020',
    amount: 200,
  },
  {
    id: '6',
    name: 'Cheyenne Ekstrom Bothman',
    email: 'example@email.com',
    userStatus: 'Inactive',
    lastLogin: '14/APR/2020',
    paymentStatus: 'Paid',
    dueDate: '10/APR/2020',
    amount: 150,
  },
  {
    id: '7',
    name: 'Makenna Stanton',
    email: 'example@email.com',
    userStatus: 'Active',
    lastLogin: '14/APR/2020',
    paymentStatus: 'Overdue',
    dueDate: '10/APR/2020',
    amount: 300,
  },
  {
    id: '8',
    name: 'James Anderson',
    email: 'example@email.com',
    userStatus: 'Active',
    lastLogin: '14/APR/2020',
    paymentStatus: 'Paid',
    dueDate: '10/APR/2020',
    amount: 250,
  },
  {
    id: '9',
    name: 'Sarah Mitchell',
    email: 'example@email.com',
    userStatus: 'Inactive',
    lastLogin: '14/APR/2020',
    paymentStatus: 'Unpaid',
    dueDate: '10/APR/2020',
    amount: 180,
  },
  {
    id: '10',
    name: 'David Thompson',
    email: 'example@email.com',
    userStatus: 'Active',
    lastLogin: '14/APR/2020',
    paymentStatus: 'Paid',
    dueDate: '10/APR/2020',
    amount: 420,
  },
];
