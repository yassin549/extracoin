'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Wallet, DollarSign, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth-context';

export default function InvestmentDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin?redirect=/dashboard/investments');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Investment Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your investments and track performance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome back,</span>
              <span className="font-semibold">{user.full_name || user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* KYC Warning Alert */}
        <Alert className="mb-6 border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-900">
            Your KYC verification is pending. Complete KYC to activate your investment account.
            <Link href="/kyc" className="ml-2 font-semibold underline hover:no-underline">
              Complete KYC Now
            </Link>
          </AlertDescription>
        </Alert>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Balance Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground mt-1">
                Available for withdrawal
              </p>
            </CardContent>
          </Card>

          {/* Total Invested Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground mt-1">
                Initial deposits
              </p>
            </CardContent>
          </Card>

          {/* Total Returns Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+$0.00</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 font-semibold">+0.0%</span> lifetime ROI
              </p>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">Pending</div>
              <p className="text-xs text-muted-foreground mt-1">
                Complete KYC to activate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio & Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Track your investment growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-lg border-2 border-dashed">
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No investment data yet</p>
                    <p className="text-xs mt-1">Make your first deposit to see your portfolio</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deposits History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Deposits</CardTitle>
                <CardDescription>Your deposit transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No deposits yet</p>
                    <p className="text-xs mt-1">Start investing by making your first deposit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Returns History */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Returns</CardTitle>
                <CardDescription>Returns earned from your investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No returns yet</p>
                  <p className="text-xs mt-1">Returns will appear here once generated</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your investments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg" disabled>
                  <DollarSign className="mr-2 h-5 w-5" />
                  Make Deposit
                </Button>
                <Button className="w-full" size="lg" variant="outline" disabled>
                  <Wallet className="mr-2 h-5 w-5" />
                  Request Payout
                </Button>
                <div className="pt-2">
                  <Link href="/kyc">
                    <Button className="w-full" variant="default" size="lg">
                      Complete KYC Verification
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Your investment account info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tier:</span>
                  <span className="font-semibold">No tier selected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">KYC Status:</span>
                  <span className="text-yellow-600 font-semibold">Pending</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Account Status:</span>
                  <span className="text-yellow-600 font-semibold">Inactive</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Member Since:</span>
                  <span className="font-semibold">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Need Help?</CardTitle>
                <CardDescription className="text-blue-700">We're here to assist you</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 mb-4">
                  Have questions about your investments or need assistance?
                </p>
                <Button variant="outline" className="w-full border-blue-300 hover:bg-blue-100">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
