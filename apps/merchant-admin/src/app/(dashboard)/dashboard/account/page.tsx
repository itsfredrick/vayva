"use client";

import useSWR from "swr";
import Link from "next/link";
import { format } from "date-fns";
import {
  Shield, CreditCard, User, HelpCircle,
  LogOut, ExternalLink, CheckCircle2, AlertTriangle,
  LayoutTemplate, MessageSquare, ChevronRight, Mail
} from "lucide-react";
import { Button } from "@vayva/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AccountOverviewPage() {
  const { data, error, isLoading } = useSWR("/api/account/overview", fetcher);

  const handleSignOutAll = async () => {
    if (!confirm("This will sign you out of all devices immediately. Continue?")) return;
    try {
      const res = await fetch("/api/auth/security/signout-all", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Signed out of all devices");
      signOut({ callbackUrl: "/login" });
    } catch (err: any) {
      toast.error("Failed to sign out all devices");
    }
  };

  if (isLoading) return <AccountSkeleton />;
  if (error) return <div className="p-8 text-red-500">Failed to load account data.</div>;
  if (!data) return null;

  const { profile, subscription, kyc, payouts, security, integrations } = data;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Overview</h1>
          <p className="text-muted-foreground">
            Manage your store identity, security settings, and subscriptions.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/control-center">
            <Button variant="outline">
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Storefront
            </Button>
          </Link>
          <Link href="/dashboard/settings/whatsapp">
            <Button variant="primary" className="bg-green-600 hover:bg-green-700">
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Identity & Store */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Identity & Store
            </CardTitle>
            <CardDescription>Your store profile and verification status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Store Name</span>
              <span className="text-sm text-muted-foreground">{profile.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Category</span>
              <span className="text-sm text-muted-foreground">{profile.category}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Identity Verification (KYC)</span>
              {kyc.status === "VERIFIED" ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Verified</Badge>
              ) : (
                <Link href="/dashboard/settings/kyc">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    {kyc.status === "PENDING" ? "In Review" : "Complete Now"} <ChevronRight className="h-3 w-3 ml-1" />
                  </Badge>
                </Link>
              )}
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Status</span>
              <Badge variant={profile.isLive ? "default" : "secondary"}>
                {profile.isLive ? "Live" : "Draft"}
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/settings/profile" className="w-full">
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Security
            </CardTitle>
            <CardDescription>Protect your account and sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Multi-Factor Auth (MFA)</span>
              {security.mfaEnabled ? (
                <Badge className="bg-green-500">Enabled</Badge>
              ) : (
                <Link href="/dashboard/settings/security">
                  <Button variant="link" size="sm" className="h-auto p-0">Enable MFA</Button>
                </Link>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Password</span>
              <Link href="/dashboard/settings/security">
                <Button variant="link" size="sm" className="h-auto p-0">Change Password</Button>
              </Link>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Active Sessions</span>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                ~ {security.recentLogins} detected
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleSignOutAll}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out All Devices
            </Button>
          </CardFooter>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-500" />
              Billing & Payouts
            </CardTitle>
            <CardDescription>Plan management and bank account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Current Plan</span>
              <Badge variant="secondary" className="uppercase">{subscription.plan}</Badge>
            </div>
            {subscription.renewalDate && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Renews On</span>
                <span className="text-sm text-muted-foreground">{format(new Date(subscription.renewalDate), "MMM d, yyyy")}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Payout Account</span>
              {payouts.bankConnected ? (
                <span className="text-sm font-mono">{payouts.maskedAccount}</span>
              ) : (
                <span className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Missing
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/billing" className="w-full">
              <Button variant="outline" className="w-full">Manage Billing</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-teal-500" />
              Support & Help
            </CardTitle>
            <CardDescription>Get help when you need it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="https://help.vayva.ng" target="_blank" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Knowledge Base</div>
                  <div className="text-xs text-muted-foreground">Guides and FAQs</div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/dashboard/support/tickets/new" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-full">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Contact Support</div>
                  <div className="text-xs text-muted-foreground">Open a ticket</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i: any) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}
