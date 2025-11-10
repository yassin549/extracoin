"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  DollarSign,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUISounds } from '@/hooks/use-sound';
import { useUIHaptics } from '@/hooks/use-haptic-feedback';

interface TradingAccount {
  id: string;
  account_number: string;
  name: string;
  balance: number;
  available_balance: number;
}

interface Payout {
  id: string;
  amount: number;
  payout_method: string;
  destination: string;
  status: string;
  created_at: string;
  net_amount: number;
  fee_amount: number;
}

const PAYOUT_METHODS = [
  { value: 'crypto', label: 'Cryptocurrency', icon: '₿' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'stripe', label: 'Card/Stripe', icon: '💳' },
];

export default function TradingWithdrawPage() {
  const router = useRouter();
  const { toast } = useToast();
  const sounds = useUISounds();
  const haptics = useUIHaptics();

  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('crypto');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadAccounts();
    loadPayouts();
  }, []);

  const loadAccounts = async () => {
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
        if (data.length > 0) {
          setSelectedAccountId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const loadPayouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trading/payouts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayouts(data);
      }
    } catch (error) {
      console.error('Error loading payouts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trading/payouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          trading_account_id: selectedAccountId,
          amount: parseFloat(amount),
          payout_method: payoutMethod,
          destination: destination,
          currency: 'USD',
        }),
      });

      if (response.ok) {
        sounds.onSuccess();
        haptics.onSuccess();
        setSuccess(true);
        toast({
          title: 'Payout Requested',
          description: 'Your withdrawal request is being reviewed. You will be notified once processed.',
        });
        
        // Reset form
        setAmount('');
        setDestination('');
        await loadPayouts();
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to request payout');
      }
    } catch (error: any) {
      console.error('Error requesting payout:', error);
      sounds.onError();
      haptics.onError();
      toast({
        title: 'Error',
        description: error.message || 'Failed to request payout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  const feeAmount = amount ? (parseFloat(amount) * 0.01).toFixed(2) : '0.00';
  const netAmount = amount ? (parseFloat(amount) - parseFloat(feeAmount)).toFixed(2) : '0.00';

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-warning/20 text-warning', label: 'Pending Review' },
      approved: { color: 'bg-success/20 text-success', label: 'Approved' },
      completed: { color: 'bg-success/20 text-success', label: 'Completed' },
      rejected: { color: 'bg-destructive/20 text-destructive', label: 'Rejected' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-6 animate-scale-in">
          <div className="w-20 h-20 mx-auto rounded-full glass-strong flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-success animate-glow" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text-animated">Payout Requested!</span>
          </h1>
          
          <p className="text-lg text-foreground-dimmed max-w-md mx-auto">
            Your withdrawal request has been submitted and is being reviewed by our team. 
            You'll receive a notification once it's processed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={() => setSuccess(false)}
              className="btn-futuristic gradient-cyber touch-interactive"
            >
              Request Another Payout
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/trading')}
              className="glass border-white/20 hover:bg-white/10 touch-interactive"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 touch-interactive"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Request Form */}
        <div className="space-y-6 animate-slide-up">
          <div className="text-center lg:text-left space-y-4">
            <div className="w-16 h-16 mx-auto lg:mx-0 rounded-full glass-strong flex items-center justify-center">
              <Send className="h-8 w-8 text-accent-cyan" />
            </div>
            <h1 className="text-3xl font-bold">
              <span className="gradient-text-animated">Request Payout</span>
            </h1>
            <p className="text-foreground-dimmed">
              Withdraw funds from your trading account
            </p>
          </div>

          <Card className="glass-strong border-white/10">
            <CardHeader>
              <CardTitle>Payout Details</CardTitle>
              <CardDescription className="text-foreground-dimmed">
                Choose account, amount, and withdrawal method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Selection */}
                <div className="space-y-2">
                  <Label htmlFor="account">Trading Account</Label>
                  <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent className="glass-strong">
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} - ${account.available_balance.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedAccount && (
                    <p className="text-xs text-foreground-dimmed">
                      Available: ${selectedAccount.available_balance.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="10"
                    max={selectedAccount?.available_balance || 0}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100.00"
                    required
                    className="glass border-white/20 focus:border-primary"
                  />
                  <p className="text-xs text-foreground-dimmed">
                    Minimum payout: $10 | Fee: 1%
                  </p>
                </div>

                {/* Fee Breakdown */}
                {amount && parseFloat(amount) >= 10 && (
                  <Card className="glass border-white/10">
                    <CardContent className="pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground-dimmed">Request Amount</span>
                        <span className="font-semibold">${parseFloat(amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-dimmed">Fee (1%)</span>
                        <span className="text-warning">-${feeAmount}</span>
                      </div>
                      <div className="h-px bg-white/10 my-2" />
                      <div className="flex justify-between">
                        <span className="font-semibold">You Receive</span>
                        <span className="font-bold text-success">${netAmount}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payout Method */}
                <div className="space-y-2">
                  <Label htmlFor="method">Payout Method</Label>
                  <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="glass-strong">
                      {PAYOUT_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.icon} {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination">
                    {payoutMethod === 'crypto' ? 'Wallet Address' : 
                     payoutMethod === 'bank_transfer' ? 'Bank Account' : 'Email'}
                  </Label>
                  <Input
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={
                      payoutMethod === 'crypto' ? '0x...' :
                      payoutMethod === 'bank_transfer' ? 'Account Number' :
                      'email@example.com'
                    }
                    required
                    className="glass border-white/20 focus:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !amount || parseFloat(amount) < 10 || !destination}
                  className="btn-futuristic gradient-cyber w-full touch-interactive"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Request Payout
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Alert className="glass-strong border-warning/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Payout requests are reviewed manually for security. Processing typically takes 1-3 business days.
            </AlertDescription>
          </Alert>
        </div>

        {/* Recent Payouts */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div>
            <h2 className="text-2xl font-bold mb-2">
              <span className="gradient-text">Recent Payouts</span>
            </h2>
            <p className="text-sm text-foreground-dimmed">
              Track your withdrawal requests
            </p>
          </div>

          <div className="space-y-4">
            {payouts.length === 0 ? (
              <Card className="glass border-white/10">
                <CardContent className="pt-6 text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-foreground-dimmed mb-4" />
                  <p className="text-foreground-dimmed">No payout requests yet</p>
                </CardContent>
              </Card>
            ) : (
              payouts.map((payout) => (
                <Card key={payout.id} className="glass border-white/10 card-hover">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">
                          ${payout.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-foreground-dimmed">
                          Net: ${payout.net_amount.toFixed(2)} (Fee: ${payout.fee_amount.toFixed(2)})
                        </p>
                      </div>
                      {getStatusBadge(payout.status)}
                    </div>
                    <div className="space-y-1 text-xs text-foreground-dimmed">
                      <p>Method: <span className="text-foreground">{payout.payout_method}</span></p>
                      <p>Destination: <span className="text-foreground font-mono text-xs break-all">{payout.destination}</span></p>
                      <p>Requested: <span className="text-foreground">{new Date(payout.created_at).toLocaleDateString()}</span></p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
