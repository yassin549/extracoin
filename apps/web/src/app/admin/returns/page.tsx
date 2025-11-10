'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Loader2,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
  Percent,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface InvestmentAccount {
  id: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  balance: number;
  tier_name: string;
  return_rate: number;
  status: string;
  last_return_date?: string;
}

interface ReturnGeneration {
  account_id: string;
  user_email: string;
  balance: number;
  tier_rate: number;
  custom_rate?: number;
  calculated_return: number;
  selected: boolean;
}

export default function AdminReturnsPage() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<InvestmentAccount[]>([]);
  const [returns, setReturns] = useState<ReturnGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [customRates, setCustomRates] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({
    active_accounts: 0,
    total_balance: 0,
    estimated_returns: 0,
  });

  useEffect(() => {
    fetchAccounts();
    fetchStats();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/admin/returns/eligible-accounts');
      setAccounts(response.data.accounts);
      
      // Initialize returns array
      const initialReturns = response.data.accounts.map((account: InvestmentAccount) => ({
        account_id: account.id,
        user_email: account.user_email,
        balance: account.balance,
        tier_rate: account.return_rate,
        custom_rate: undefined,
        calculated_return: (account.balance * account.return_rate) / 100,
        selected: false,
      }));
      setReturns(initialReturns);
    } catch (error: any) {
      console.error('Failed to fetch accounts:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to load accounts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/admin/returns/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setReturns(returns.map(r => ({ ...r, selected: newSelectAll })));
  };

  const handleSelectAccount = (accountId: string) => {
    setReturns(returns.map(r => 
      r.account_id === accountId ? { ...r, selected: !r.selected } : r
    ));
  };

  const handleCustomRateChange = (accountId: string, rate: string) => {
    const numRate = parseFloat(rate) || 0;
    setCustomRates({ ...customRates, [accountId]: numRate });
    
    setReturns(returns.map(r => {
      if (r.account_id === accountId) {
        const effectiveRate = numRate > 0 ? numRate : r.tier_rate;
        return {
          ...r,
          custom_rate: numRate > 0 ? numRate : undefined,
          calculated_return: (r.balance * effectiveRate) / 100,
        };
      }
      return r;
    }));
  };

  const handleGenerateReturns = async () => {
    const selectedReturns = returns.filter(r => r.selected);
    
    if (selectedReturns.length === 0) {
      toast({
        title: 'No Accounts Selected',
        description: 'Please select at least one account to generate returns',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const returnData = selectedReturns.map(r => ({
        investment_account_id: r.account_id,
        return_percentage: r.custom_rate || r.tier_rate,
      }));

      const response = await apiClient.post('/api/admin/returns/generate-bulk', {
        returns: returnData,
      });

      toast({
        title: 'Success',
        description: `Generated returns for ${response.data.generated_count} accounts. Total: $${response.data.total_amount.toFixed(2)}`,
      });

      // Refresh data
      fetchAccounts();
      fetchStats();
      setSelectAll(false);
      setCustomRates({});
    } catch (error: any) {
      console.error('Failed to generate returns:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to generate returns',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedCount = returns.filter(r => r.selected).length;
  const totalSelectedReturns = returns
    .filter(r => r.selected)
    .reduce((sum, r) => sum + r.calculated_return, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Returns Generation</h1>
        <p className="text-muted-foreground mt-1">
          Generate and process investment returns for active accounts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_accounts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.total_balance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Estimated Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.estimated_returns.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selection Summary */}
      {selectedCount > 0 && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {selectedCount} account{selectedCount !== 1 ? 's' : ''} selected
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalSelectedReturns.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total returns to be generated
                </p>
              </div>
              <Button
                onClick={handleGenerateReturns}
                disabled={isProcessing}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Generate Returns
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Eligible Accounts</CardTitle>
              <CardDescription>
                Active investment accounts ready for return generation
              </CardDescription>
            </div>
            {accounts.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectAll ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No eligible accounts found</p>
              <p className="text-xs mt-1">Active accounts with positive balance will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {returns.map((returnItem, index) => {
                const account = accounts[index];
                return (
                  <div
                    key={returnItem.account_id}
                    className={`p-4 border rounded-lg transition-colors ${
                      returnItem.selected ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={returnItem.selected}
                        onChange={() => handleSelectAccount(returnItem.account_id)}
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />

                      {/* Account Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground truncate">
                            {returnItem.user_email}
                          </p>
                          <Badge>{account.tier_name}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-2">
                          <div>
                            <p className="text-muted-foreground text-xs">Balance</p>
                            <p className="font-medium">${returnItem.balance.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Tier Rate</p>
                            <p className="font-medium">{returnItem.tier_rate}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Custom Rate</p>
                            <Input
                              type="number"
                              placeholder={`${returnItem.tier_rate}%`}
                              value={customRates[returnItem.account_id] || ''}
                              onChange={(e) =>
                                handleCustomRateChange(returnItem.account_id, e.target.value)
                              }
                              className="h-8 w-24"
                              step="0.1"
                              min="0"
                              max="100"
                            />
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Calculated Return</p>
                            <p className="font-bold text-green-600">
                              ${returnItem.calculated_return.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        {account.last_return_date && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Last return: {format(new Date(account.last_return_date), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            How to Generate Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-bold text-foreground">1.</span>
              <span>Select the accounts you want to generate returns for using the checkboxes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-foreground">2.</span>
              <span>
                Optionally, set a custom return percentage for specific accounts (overrides tier rate)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-foreground">3.</span>
              <span>Review the calculated returns in the summary card above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-foreground">4.</span>
              <span>
                Click "Generate Returns" to process. This will credit the calculated amounts to
                selected accounts
              </span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
