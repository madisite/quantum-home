import { useState, useMemo } from 'react';
import { mockUsers, User, PaymentStatus, UserStatus } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, Search, ChevronLeft, ChevronRight, MoreVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import UserModal from './UserModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

type SortOption = 'default' | 'firstName' | 'lastName' | 'dueDate' | 'lastLogin';
type UserStatusFilter = 'all' | 'active' | 'inactive';
type TabFilter = 'all' | 'paid' | 'unpaid' | 'overdue';

export default function DataTable() {
  // User data state
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  // UI state
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [userStatusFilter, setUserStatusFilter] = useState<UserStatusFilter>('all');
  const [tabFilter, setTabFilter] = useState<TabFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  
  const itemsPerPage = 10;

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Apply tab filter
    if (tabFilter !== 'all') {
      result = result.filter(user => user.paymentStatus.toLowerCase() === tabFilter);
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply user status filter
    if (userStatusFilter !== 'all') {
      result = result.filter(user =>
        user.userStatus.toLowerCase() === userStatusFilter
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'firstName':
        result.sort((a, b) => a.name.split(' ')[0].localeCompare(b.name.split(' ')[0]));
        break;
      case 'lastName':
        result.sort((a, b) => {
          const lastNameA = a.name.split(' ').slice(-1)[0];
          const lastNameB = b.name.split(' ').slice(-1)[0];
          return lastNameA.localeCompare(lastNameB);
        });
        break;
      case 'dueDate':
        result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case 'lastLogin':
        result.sort((a, b) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [users, searchQuery, sortBy, userStatusFilter, tabFilter]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPayable = useMemo(() => {
    return filteredAndSortedUsers
      .filter(user => user.paymentStatus === 'Unpaid' || user.paymentStatus === 'Overdue')
      .reduce((sum, user) => sum + user.amount, 0);
  }, [filteredAndSortedUsers]);

  // CRUD Operations
  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    toast.info(`Viewing ${user.name}'s details`);
  };

  const handleSaveUser = (userData: User) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(u => (u.id === userData.id ? userData : u)));
      toast.success(`User "${userData.name}" updated successfully`);
    } else {
      // Create new user
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
      };
      setUsers(prev => [newUser, ...prev]);
      toast.success(`User "${userData.name}" added successfully`);
    }
  };

  const handleDeleteUser = () => {
    if (deleteUserId) {
      const userToDelete = users.find(u => u.id === deleteUserId);
      setUsers(prev => prev.filter(u => u.id !== deleteUserId));
      toast.success(`User "${userToDelete?.name}" deleted successfully`);
      setDeleteUserId(null);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }
    setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
    toast.success(`${selectedUsers.length} user(s) deleted successfully`);
    setSelectedUsers([]);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  const getStatusBadge = (status: PaymentStatus | UserStatus, type: 'payment' | 'user') => {
    const baseClasses = "inline-flex items-center gap-1.5 text-xs font-medium px-0";
    
    if (type === 'payment') {
      const statusClasses = {
        Paid: "text-status-paid",
        Unpaid: "text-status-unpaid",
        Overdue: "text-status-overdue",
      };
      return (
        <span className={cn(baseClasses, statusClasses[status as PaymentStatus])}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === 'Paid' && "bg-status-paid",
            status === 'Unpaid' && "bg-status-unpaid",
            status === 'Overdue' && "bg-status-overdue"
          )} />
          {status}
        </span>
      );
    } else {
      const statusClasses = {
        Active: "text-status-active",
        Inactive: "text-status-inactive",
      };
      return (
        <span className={cn(baseClasses, statusClasses[status as UserStatus])}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === 'Active' && "bg-status-active",
            status === 'Inactive' && "bg-status-inactive"
          )} />
          {status}
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-16">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-4">
            TABLE HEADING
          </h1>
          
          {/* Tabs and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <Tabs value={tabFilter} onValueChange={(value) => setTabFilter(value as TabFilter)} className="w-full lg:w-auto">
              <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 w-full lg:w-auto justify-start">
                <TabsTrigger 
                  value="all" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="paid"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
                >
                  Paid
                </TabsTrigger>
                <TabsTrigger 
                  value="unpaid"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
                >
                  Unpaid
                </TabsTrigger>
                <TabsTrigger 
                  value="overdue"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
                >
                  Overdue
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ml-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Total payable amount: <span className="font-semibold text-foreground">${totalPayable.toFixed(2)}</span> <span className="text-xs">USD</span>
                </span>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-9 whitespace-nowrap">
                PAY DUES
              </Button>
              {selectedUsers.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteSelected}
                  className="h-9 whitespace-nowrap"
                >
                  Delete ({selectedUsers.length})
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto justify-start gap-2 bg-white border-border h-10"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4" align="start">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wider">
                      SORT BY:
                    </h4>
                    <RadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="default" id="default" />
                        <Label htmlFor="default" className="text-sm font-normal cursor-pointer">Default</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="firstName" id="firstName" />
                        <Label htmlFor="firstName" className="text-sm font-normal cursor-pointer">First Name</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="lastName" id="lastName" />
                        <Label htmlFor="lastName" className="text-sm font-normal cursor-pointer">Last Name</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="dueDate" id="dueDate" />
                        <Label htmlFor="dueDate" className="text-sm font-normal cursor-pointer">Due Date</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lastLogin" id="lastLogin" />
                        <Label htmlFor="lastLogin" className="text-sm font-normal cursor-pointer">Last Login</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wider">
                      USERS:
                    </h4>
                    <RadioGroup value={userStatusFilter} onValueChange={(value) => setUserStatusFilter(value as UserStatusFilter)}>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="all" id="all-users" />
                        <Label htmlFor="all-users" className="text-sm font-normal cursor-pointer">All</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="active" id="active-users" />
                        <Label htmlFor="active-users" className="text-sm font-normal cursor-pointer">Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inactive" id="inactive-users" />
                        <Label htmlFor="inactive-users" className="text-sm font-normal cursor-pointer">Inactive</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Aspen Weerd"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-border h-10"
              />
            </div>

            <Button 
              onClick={handleAddUser}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 w-12">
                    <Checkbox
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {/* Empty for user avatar/name column */}
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    USER STATUS
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    PAYMENT STATUS
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    AMOUNT
                  </th>
                  <th className="text-left p-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={cn(
                      "border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors",
                      selectedUsers.includes(user.id) && "bg-accent/30"
                    )}
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-foreground truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {getStatusBadge(user.userStatus, 'user')}
                        <div className="text-xs text-muted-foreground">
                          Last login: {user.lastLogin}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {getStatusBadge(user.paymentStatus, 'payment')}
                        <div className="text-xs text-muted-foreground">
                          {user.paymentStatus === 'Paid' ? 'Paid' : 'Dues'} on {user.dueDate}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-sm">
                          ${user.amount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          USD
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteUserId(user.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Rows per page: <span className="font-medium">{itemsPerPage}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards - Mobile */}
        <div className="md:hidden space-y-3">
          {paginatedUsers.map((user) => (
            <div 
              key={user.id}
              className={cn(
                "bg-white rounded-lg shadow-sm border border-border p-4",
                selectedUsers.includes(user.id) && "bg-accent/30"
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => toggleUserSelection(user.id)}
                  className="mt-1"
                />
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground mb-1">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {user.email}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                    <div>
                      {getStatusBadge(user.userStatus, 'user')}
                      <div className="text-muted-foreground mt-0.5">
                        Last login: {user.lastLogin}
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(user.paymentStatus, 'payment')}
                      <div className="text-muted-foreground mt-0.5">
                        {user.paymentStatus === 'Paid' ? 'Paid' : 'Dues'} on {user.dueDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <div className="font-semibold text-sm">
                    ${user.amount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    USD
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewUser(user)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteUserId(user.id)}
                      className="text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pagination */}
        <div className="md:hidden bg-white rounded-lg shadow-sm border border-border p-4 mt-4">
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        initialUser={editingUser}
        isEditing={!!editingUser}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteUser}
        userName={users.find(u => u.id === deleteUserId)?.name}
      />
    </div>
  );
}
