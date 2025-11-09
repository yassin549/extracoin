'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Wallet,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Deposit {
  id: string;
  investment_account_id: string;
  user_email?: string;
  user_name?: string;
  amount: number;
  currency: string;
  payment_id: string;
  payment_address?: string;
  status: string;
  confirmation_date?: string;
  created_at: string;
}

export default function AdminDepositsPage() {
  const { toast } = useToast();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCurrency, setFilterCurrency] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [stats, setStats] = useState({
    total_deposits: 0,
    total_amount: 0,
    pending_count: 0,
    confirmed_count: 0,
  });

  useEffect(() => {
    fetchDeposits();
    fetchStats();
  }, [page, filterStatus, filterCurrency]);

  const fetchDeposits = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/admin/deposits', {
        params: {
          status: filterStatus === 'all' ? undefined : filterStatus,
          currency: filterCurrency === 'all' ? undefined : filterCurrency,
          limit,
          offset: page * limit,
        },
      });
      setDeposits(response.data.deposits);
      setTotal(response.data.total);
    } catch (error: any) {
      console.error('Failed to fetch deposits:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to load deposits',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/admin/deposits/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch deposit stats:', error);
    }
  };

  const handleViewDeposit = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
  };

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch =
      searchQuery === '' ||
      deposit.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deposit.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deposit.payment_id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(total / limit);

  const getStatusBadge = (status: string) => {
    const config = {
      confirmed: { label: 'Confirmed', className: 'bg-green-600' },
      pending: { label: 'Pending', className: 'bg-yellow-600' },
      confirming: { label: 'Confirming', className: 'bg-blue-600' },
      failed: { label: 'Failed', className: 'bg-red-600' },
      cancelled: { label: 'Cancelled', className: 'bg-gray-600' },
    };

    const badge = config[status as keyof typeof config] || config.pending;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  const getCurrencyIcon = (currency: string) => {
    const icons: Record<string, string> = {
      BTC: '₿',
      ETH: 'Ξ',
      USDT: '₮',
      USDC: '$',
      LTC: 'Ł',
      TRX: 'T',
      BNB: 'B',
    };
    return icons[currency] || currency;
  };

  const currencies = ['BTC', 'ETH', 'USDT', 'USDC', 'LTC', 'TRX', 'BNB'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Deposit Management</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage all investment deposits
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_deposits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.total_amount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending_count}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.confirmed_count}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, name, or payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All Status
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === 'confirming' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('confirming')}
                >
                  Confirming
                </Button>
                <Button
                  variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('confirmed')}
                >
                  Confirmed
                </Button>
              </div>

              {/* Currency Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterCurrency === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCurrency('all')}
                >
                  All Currencies
                </Button>
                {currencies.map((curr) => (
                  <Button
                    key={curr}
                    variant={filterCurrency === curr ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCurrency(curr)}
                  >
                    {getCurrencyIcon(curr)} {curr}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposits List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Deposits ({total})</CardTitle>
              <CardDescription>
                Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total}{' '}
                deposits
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredDeposits.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No deposits found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDeposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Wallet className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">
                          ${deposit.amount.toFixed(2)}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          {getCurrencyIcon(deposit.currency)} {deposit.currency}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {deposit.user_email || deposit.user_name || 'Unknown User'}
                      </p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {getStatusBadge(deposit.status)}
                        <span className="text-xs text-muted-foreground font-mono">
                          {deposit.payment_id.substring(0, 16)}...
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(deposit.created_at), 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDeposit(deposit)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
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

      {/* Deposit Details Modal */}
      {selectedDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Deposit Details</CardTitle>
                  <CardDescription>
                    Payment ID: {selectedDeposit.payment_id}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDeposit(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(selectedDeposit.status)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Created: {format(new Date(selectedDeposit.created_at), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>

                {/* Payment Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Amount (USD)</p>
                      <p className="font-medium text-lg">
                        ${selectedDeposit.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Currency</p>
                      <p className="font-medium text-lg">
                        {getCurrencyIcon(selectedDeposit.currency)} {selectedDeposit.currency}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Payment ID</p>
                      <p className="font-mono text-xs break-all">
                        {selectedDeposit.payment_id}
                      </p>
                    </div>
                    {selectedDeposit.payment_address && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Payment Address</p>
                        <p className="font-mono text-xs break-all">
                          {selectedDeposit.payment_address}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-3 border-t pt-6">
                  <h3 className="font-semibold text-lg">User Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {selectedDeposit.user_email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {selectedDeposit.user_name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Account ID</p>
                      <p className="font-mono text-xs">
                        {selectedDeposit.investment_account_id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirmation */}
                {selectedDeposit.confirmation_date && (
                  <div className="space-y-3 border-t pt-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Confirmation Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Confirmed At</p>
                        <p className="font-medium">
                          {format(
                            new Date(selectedDeposit.confirmation_date),
                            'MMM d, yyyy HH:mm:ss'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Link */}
                {selectedDeposit.payment_id && (
                  <div className="border-t pt-6">
                    <a
                      href={`https://nowpayments.io/payment/${selectedDeposit.payment_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View payment on NOWPayments
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
