"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Wallet, 
  Copy, 
  CheckCircle2, 
  Clock,
  AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
}

interface DepositResponse {
  payment_id: string;
  payment_address: string;
  amount: number;
  currency: string;
  pay_amount: number;
  expiration_time: string;
  status: string;
}

const SUPPORTED_CURRENCIES = [
  { value: 'btc', label: 'Bitcoin (BTC)', icon: '₿' },
  { value: 'eth', label: 'Ethereum (ETH)', icon: 'Ξ' },
  { value: 'usdt', label: 'Tether (USDT)', icon: '₮' },
  { value: 'usdc', label: 'USD Coin (USDC)', icon: '$' },
  { value: 'ltc', label: 'Litecoin (LTC)', icon: 'Ł' },
  { value: 'trx', label: 'TRON (TRX)', icon: 'TRX' },
  { value: 'bnb', label: 'Binance Coin (BNB)', icon: 'BNB' },
];

export default function TradingDepositPage() {
  const router = useRouter();
  const { toast } = useToast();
  const sounds = useUISounds();
  const haptics = useUIHaptics();

  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usdt');
  const [loading, setLoading] = useState(false);
  const [depositInfo, setDepositInfo] = useState<DepositResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAccounts();
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

  const handleCopyAddress = () => {
    if (depositInfo) {
      navigator.clipboard.writeText(depositInfo.payment_address);
      setCopied(true);
      sounds.onClick();
      haptics.onSuccess();
      toast({
        title: 'Copied!',
        description: 'Payment address copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trading/deposits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          trading_account_id: selectedAccountId,
          amount: parseFloat(amount),
          currency: currency,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDepositInfo(data);
        sounds.onSuccess();
        haptics.onSuccess();
      } else {
        throw new Error('Failed to create deposit');
      }
    } catch (error) {
      console.error('Error creating deposit:', error);
      sounds.onError();
      haptics.onError();
      toast({
        title: 'Error',
        description: 'Failed to create deposit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  if (depositInfo) {
    const expirationDate = new Date(depositInfo.expiration_time);
    const timeRemaining = Math.max(0, Math.floor((expirationDate.getTime() - Date.now()) / 1000 / 60));

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => {
            setDepositInfo(null);
            setAmount('');
          }}
          className="mb-6 touch-interactive"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          New Deposit
        </Button>

        <div className="space-y-6 animate-scale-in">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full glass-strong flex items-center justify-center">
              <Clock className="h-8 w-8 text-accent-cyan animate-glow" />
            </div>
            <h1 className="text-3xl font-bold">
              <span className="gradient-text-animated">Payment Details</span>
            </h1>
            <p className="text-foreground-dimmed">
              Send exactly <span className="text-accent-cyan font-semibold">{depositInfo.pay_amount} {depositInfo.currency.toUpperCase()}</span> to the address below
            </p>
          </div>

          {/* Payment Address */}
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payment Address
              </CardTitle>
              <CardDescription className="text-foreground-dimmed">
                {depositInfo.currency.toUpperCase()} Network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl glass border border-white/20 break-all font-mono text-sm text-center">
                {depositInfo.payment_address}
              </div>
              <Button
                onClick={handleCopyAddress}
                variant="outline"
                className="w-full glass border-white/20 hover:bg-white/10 touch-interactive"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Address
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="glass border-white/10">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground-dimmed">Amount (USD)</span>
                <span className="font-semibold text-foreground">${depositInfo.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-dimmed">Amount ({depositInfo.currency.toUpperCase()})</span>
                <span className="font-semibold text-foreground">{depositInfo.pay_amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-dimmed">Status</span>
                <span className="px-3 py-1 rounded-full bg-warning/20 text-warning text-sm font-medium">
                  Pending
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-dimmed">Time Remaining</span>
                <span className="font-semibold text-accent-cyan">{timeRemaining} minutes</span>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Alert className="glass-strong border-accent-cyan/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Important:</strong> Send exactly the amount shown. Your account will be 
              credited automatically once the transaction is confirmed on the blockchain (usually 10-30 minutes).
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => router.push('/dashboard/trading')}
            variant="outline"
            className="w-full glass border-white/20 hover:bg-white/10 touch-interactive"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 touch-interactive"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6 animate-slide-up">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full glass-strong flex items-center justify-center">
            <Wallet className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text-animated">Deposit Funds</span>
          </h1>
          <p className="text-foreground-dimmed text-lg">
            Fund your trading account with cryptocurrency
          </p>
        </div>

        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle>Deposit Details</CardTitle>
            <CardDescription className="text-foreground-dimmed">
              Choose account, amount, and payment method
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
                        {account.name} ({account.account_number}) - ${account.balance.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="10"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100.00"
                  required
                  className="glass border-white/20 focus:border-primary"
                />
                <p className="text-xs text-foreground-dimmed">
                  Minimum deposit: $10
                </p>
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">Payment Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="glass-strong">
                    {SUPPORTED_CURRENCIES.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.icon} {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-foreground-dimmed">
                  Payment will be processed on the blockchain
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !amount || parseFloat(amount) < 10}
                className="btn-futuristic gradient-cyber w-full touch-interactive"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Alert className="glass-strong border-white/10">
          <AlertDescription className="text-xs text-foreground-dimmed">
            ✓ Instant credit after blockchain confirmation<br />
            ✓ No additional fees (network fees apply)<br />
            ✓ Secure crypto payment processing
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
