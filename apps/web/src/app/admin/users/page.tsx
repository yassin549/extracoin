'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Users,
  Eye,
  Ban,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Calendar,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  kyc_status?: string;
}

interface UserDetails extends User {
  investment_accounts?: any[];
  kyc_submission?: any;
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);

  useEffect(() => {
    fetchUsers();
  }, [page, filterStatus]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/admin/users', {
        params: {
          limit,
          offset: page * limit,
        },
      });
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      setIsLoadingDetails(true);
      const response = await apiClient.get(`/api/admin/users/${userId}`);
      setSelectedUser(response.data.user);
    } catch (error: any) {
      console.error('Failed to fetch user details:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to load user details',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(`/api/admin/users/${userId}/status`, {
        is_active: !currentStatus,
      });
      toast({
        title: 'Success',
        description: `User ${!currentStatus ? 'activated' : 'suspended'} successfully`,
      });
      fetchUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    } catch (error: any) {
      console.error('Failed to update user status:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active);

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(total / limit);

  const getStatusBadge = (user: User) => {
    if (!user.is_active) {
      return <Badge variant="destructive">Suspended</Badge>;
    }
    if (!user.is_verified) {
      return <Badge variant="outline">Unverified</Badge>;
    }
    return <Badge className="bg-green-600">Active</Badge>;
  };

  const getKYCBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Not Submitted</Badge>;
    
    const config = {
      approved: { label: 'Approved', className: 'bg-green-600' },
      pending: { label: 'Pending', className: 'bg-yellow-600' },
      rejected: { label: 'Rejected', className: 'bg-red-600' },
      needs_review: { label: 'Needs Review', className: 'bg-orange-600' },
    };

    const badge = config[status as keyof typeof config] || config.pending;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All Users
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('inactive')}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users ({total})</CardTitle>
              <CardDescription>
                Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total}{' '}
                users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {user.is_admin ? (
                        <Shield className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Users className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground truncate">
                          {user.full_name || 'No name'}
                        </p>
                        {user.is_admin && (
                          <Badge variant="outline" className="text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(user)}
                        {getKYCBadge(user.kyc_status)}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(user.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUserDetails(user.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {!user.is_admin && (
                      <Button
                        variant={user.is_active ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                      >
                        {user.is_active ? (
                          <>
                            <Ban className="h-4 w-4 mr-1" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Details</CardTitle>
                  <CardDescription>{selectedUser.email}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingDetails ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Account Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Full Name</p>
                        <p className="font-medium">{selectedUser.full_name || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">KYC Status</p>
                        <div className="mt-1">{getKYCBadge(selectedUser.kyc_status)}</div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Verified</p>
                        <p className="font-medium">
                          {selectedUser.is_verified ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Admin</p>
                        <p className="font-medium">{selectedUser.is_admin ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">User ID</p>
                        <p className="font-mono text-xs">{selectedUser.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Joined</p>
                        <p className="font-medium">
                          {format(new Date(selectedUser.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Investment Accounts */}
                  {selectedUser.investment_accounts && selectedUser.investment_accounts.length > 0 && (
                    <div className="space-y-3 border-t pt-6">
                      <h3 className="font-semibold">Investment Accounts</h3>
                      <div className="space-y-2">
                        {selectedUser.investment_accounts.map((account: any) => (
                          <div
                            key={account.id}
                            className="p-3 border rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  Balance: ${account.balance?.toFixed(2) || '0.00'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Status: {account.status}
                                </p>
                              </div>
                              <Badge>{account.tier_name || 'No Tier'}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KYC Info */}
                  {selectedUser.kyc_submission && (
                    <div className="space-y-3 border-t pt-6">
                      <h3 className="font-semibold">KYC Submission</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <div className="mt-1">
                            {getKYCBadge(selectedUser.kyc_submission.status)}
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Submitted</p>
                          <p className="font-medium">
                            {format(
                              new Date(selectedUser.kyc_submission.created_at),
                              'MMM d, yyyy'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
