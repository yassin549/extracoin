"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useUISounds } from '@/hooks/use-sound';
import { useUIHaptics } from '@/hooks/use-haptic-feedback';

export default function CreateTradingAccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const sounds = useUISounds();
  const haptics = useUIHaptics();

  const [accountName, setAccountName] = useState('Trading Account');
  const [loading, setLoading] = useState(false);
  const [kycRequired, setKycRequired] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trading/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: accountName }),
      });

      if (response.ok) {
        const data = await response.json();
        sounds.onSuccess();
        haptics.onSuccess();
        
        toast({
          title: 'Success!',
          description: `Trading account ${data.account_number} created successfully`,
        });

        // Redirect to trading dashboard
        setTimeout(() => {
          router.push('/dashboard/trading');
        }, 1500);
      } else if (response.status === 403) {
        const error = await response.json();
        if (error.detail?.includes('KYC')) {
          setKycRequired(true);
          sounds.onError();
          haptics.onError();
        }
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error('Error creating trading account:', error);
      sounds.onError();
      haptics.onError();
      toast({
        title: 'Error',
        description: 'Failed to create trading account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 touch-interactive"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full glass-strong flex items-center justify-center">
            <Shield className="h-8 w-8 text-accent-cyan" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text-animated">Create Trading Account</span>
          </h1>
          <p className="text-foreground-dimmed text-lg">
            Start trading with real money in simulated markets
          </p>
        </div>

        {/* KYC Required Alert */}
        {kycRequired && (
          <Alert variant="warning" className="glass-strong border-warning/30 animate-scale-in">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              KYC verification required to create a trading account.{' '}
              <button
                onClick={() => router.push('/kyc')}
                className="font-semibold underline hover:text-warning transition-colors"
              >
                Complete verification now
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Form Card */}
        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription className="text-foreground-dimmed">
              Choose a name for your trading account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g., Trading Account, Main Portfolio"
                  required
                  maxLength={255}
                  className="glass border-white/20 focus:border-primary"
                />
                <p className="text-xs text-foreground-dimmed">
                  This helps you identify the account in your dashboard
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !accountName.trim()}
                className="btn-futuristic gradient-cyber w-full touch-interactive"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Create Trading Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card className="glass border-white/10">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 text-foreground">What you get:</h3>
            <ul className="space-y-3">
              {[
                'Unique account number (OPT-XXXX-XXXXXX)',
                'Real money trading in simulated markets',
                'Intelligent copy trading to professional broker',
                'Real-time balance synchronization',
                'Professional trading interface',
                'Deposit via crypto (BTC, ETH, USDT, etc.)',
                'Fast payout processing (1% fee)',
                'Zero additional fees',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground-dimmed">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="glass-strong border-white/10">
          <AlertDescription className="text-xs text-foreground-dimmed">
            ⚠️ Trading involves risk of loss. Only deposit funds you can afford to lose. 
            OptCoin is a licensed and regulated trading platform. All trades are monitored 
            and copied to our professional broker in real-time.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
