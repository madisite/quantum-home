import DataTable from '@/components/DataTable';
import { User } from '@/data/mockData';

interface IndexProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

export default function Index({ users, setUsers }: IndexProps) {
  return <DataTable users={users} setUsers={setUsers} />;
}
