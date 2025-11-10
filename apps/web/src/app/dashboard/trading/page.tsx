"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Wallet, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUISounds } from '@/hooks/use-sound';
import { useUIHaptics } from '@/hooks/use-haptic-feedback';

interface TradingAccount {
  id: string;
  account_number: string;
  name: string;
  status: string;
  balance: number;
  available_balance: number;
  reserved_balance: number;
  total_deposited: number;
  total_withdrawn: number;
  total_profit_loss: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  copy_trading_enabled: boolean;
  created_at: string;
}

interface PerformanceMetrics {
  period: string;
  profit_loss: number;
  profit_loss_percentage: number;
  total_trades: number;
  win_rate: number;
}

export default function TradingDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const sounds = useUISounds();
  const haptics = useUIHaptics();
  
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');

  useEffect(() => {
    loadTradingAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      loadPerformance();
    }
  }, [selectedAccount, selectedPeriod]);

  const loadTradingAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trading/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
        if (data.length > 0 && !selectedAccount) {
          setSelectedAccount(data[0]);
        }
      } else if (response.status === 401) {
        router.push('/auth/signin');
      }
    } catch (error) {
      console.error('Error loading trading accounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trading accounts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPerformance = async () => {
    if (!selectedAccount) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trading/accounts/${selectedAccount.id}/performance?period=${selectedPeriod}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPerformance(data);
      }
    } catch (error) {
      console.error('Error loading performance:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    sounds.onClick();
    haptics.onToggle();
    
    await loadTradingAccounts();
    if (selectedAccount) {
      await loadPerformance();
    }
    
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Account data updated',
    });
  };

  const handleCreateAccount = () => {
    sounds.onClick();
    haptics.onButtonPress();
    router.push('/dashboard/trading/create');
  };

  const handleDeposit = () => {
    sounds.onClick();
    haptics.onSuccess();
    router.push('/dashboard/trading/deposit');
  };

  const handleWithdraw = () => {
    sounds.onClick();
    haptics.onSuccess();
    router.push('/dashboard/trading/withdraw');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-foreground-dimmed">Loading trading accounts...</p>
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full glass-strong flex items-center justify-center">
              <Wallet className="h-12 w-12 text-accent-cyan" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text-animated">Start Trading</span>
            </h1>
            <p className="text-lg text-foreground-dimmed">
              Create your first trading account to start trading with real money 
              in simulated markets with intelligent copy trading.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleCreateAccount}
              className="btn-futuristic gradient-cyber touch-interactive"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Trading Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/kyc')}
              className="glass border-white/20 hover:bg-white/10 touch-interactive"
            >
              Verify KYC First
            </Button>
          </div>

          <div className="pt-8 space-y-3 text-sm text-foreground-dimmed">
            <p>✓ Licensed & regulated platform</p>
            <p>✓ Instant KYC approval</p>
            <p>✓ Zero setup fees</p>
          </div>
        </div>
      </div>
    );
  }

  const winRate = selectedAccount 
    ? selectedAccount.total_trades > 0 
      ? (selectedAccount.winning_trades / selectedAccount.total_trades * 100).toFixed(1)
      : '0.0'
    : '0.0';

  const isProfitable = selectedAccount ? selectedAccount.total_profit_loss >= 0 : false;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text-animated mb-2">
            Trading Dashboard
          </h1>
          <p className="text-sm text-foreground-dimmed">
            Real-time account overview and performance metrics
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="glass border-white/20 hover:bg-white/10 touch-interactive"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleCreateAccount}
            className="btn-futuristic gradient-cyber touch-interactive"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Account
          </Button>
        </div>
      </div>

      {/* Account Selector */}
      {accounts.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => {
                setSelectedAccount(account);
                sounds.onClick();
              }}
              className={`
                flex-shrink-0 px-4 py-2 rounded-xl transition-all touch-interactive
                ${selectedAccount?.id === account.id 
                  ? 'glass-strong border border-primary glow-blue' 
                  : 'glass border border-white/10 hover:border-white/20'
                }
              `}
            >
              <div className="text-sm font-semibold">{account.name}</div>
              <div className="text-xs text-foreground-dimmed">{account.account_number}</div>
            </button>
          ))}
        </div>
      )}

      {selectedAccount && (
        <>
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Balance */}
            <Card className="glass-strong border-white/10 card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground-dimmed flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Total Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold gradient-text">
                  ${selectedAccount.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-foreground-dimmed mt-1">
                  Available: ${selectedAccount.available_balance.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            {/* Total P/L */}
            <Card className="glass-strong border-white/10 card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground-dimmed flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total P/L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl md:text-3xl font-bold ${isProfitable ? 'text-success' : 'text-destructive'}`}>
                  {isProfitable ? '+' : ''}${selectedAccount.total_profit_loss.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {isProfitable ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`text-xs ${isProfitable ? 'text-success' : 'text-destructive'}`}>
                    {((selectedAccount.total_profit_loss / selectedAccount.total_deposited) * 100).toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Total Trades */}
            <Card className="glass-strong border-white/10 card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground-dimmed flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Total Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {selectedAccount.total_trades}
                </div>
                <p className="text-xs text-foreground-dimmed mt-1">
                  Win Rate: {winRate}%
                </p>
              </CardContent>
            </Card>

            {/* Copy Trading Status */}
            <Card className="glass-strong border-white/10 card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground-dimmed">
                  Copy Trading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant={selectedAccount.copy_trading_enabled ? "default" : "secondary"}
                  className={`text-sm ${selectedAccount.copy_trading_enabled ? 'bg-success' : 'bg-muted'}`}
                >
                  {selectedAccount.copy_trading_enabled ? 'Active' : 'Inactive'}
                </Badge>
                <p className="text-xs text-foreground-dimmed mt-2">
                  {selectedAccount.copy_trading_enabled 
                    ? 'Trades copied to broker' 
                    : 'Enable in settings'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              size="lg"
              onClick={handleDeposit}
              className="btn-futuristic gradient-cyber touch-interactive w-full"
            >
              <Plus className="h-5 w-5 mr-2" />
              Deposit Funds
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWithdraw}
              className="glass border-white/20 hover:bg-white/10 touch-interactive w-full"
            >
              <ArrowUpRight className="h-5 w-5 mr-2" />
              Request Payout
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push(`/dashboard/trading/${selectedAccount.id}`)}
              className="glass border-white/20 hover:bg-white/10 touch-interactive w-full"
            >
              <Activity className="h-5 w-5 mr-2" />
              View Details
            </Button>
          </div>

          {/* Performance Period Selector */}
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
                <div className="flex gap-2">
                  {(['7d', '30d', '90d', '1y', 'all'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setSelectedPeriod(period);
                        sounds.onClick();
                      }}
                      className={`
                        px-3 py-1 rounded-lg text-xs font-medium transition-all touch-interactive
                        ${selectedPeriod === period
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/5 hover:bg-white/10 text-foreground-dimmed'
                        }
                      `}
                    >
                      {period.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {performance && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-foreground-dimmed mb-1">P/L</p>
                    <p className={`text-xl font-bold ${performance.profit_loss >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {performance.profit_loss >= 0 ? '+' : ''}${performance.profit_loss.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-dimmed mb-1">P/L %</p>
                    <p className={`text-xl font-bold ${performance.profit_loss_percentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {performance.profit_loss_percentage >= 0 ? '+' : ''}{performance.profit_loss_percentage.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-dimmed mb-1">Trades</p>
                    <p className="text-xl font-bold text-foreground">
                      {performance.total_trades}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-dimmed mb-1">Win Rate</p>
                    <p className="text-xl font-bold text-accent-cyan">
                      {performance.win_rate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
