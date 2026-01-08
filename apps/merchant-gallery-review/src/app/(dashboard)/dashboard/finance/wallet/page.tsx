import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust import if needed
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowUpRight,
  Building2,
  Copy,
  AlertCircle,
} from "lucide-react";
import { EmptyState } from "@vayva/ui";


async function getWallet(storeId: string) {
  const wallet = await prisma.wallet.findUnique({
    where: { storeId },
  });
  return wallet;
}

export default async function WalletPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <div>Please login</div>;
  // Assuming session has storeId or we fetch it.
  // For demo, let's fetch the membership to get storeId like in other pages
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    select: { storeId: true },
  });

  if (!membership) return <div>No store found</div>;

  const wallet = await getWallet(membership.storeId);

  // Format currency
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  const balance = wallet ? Number(wallet.availableKobo) / 100 : 0;
  const pending = wallet ? Number(wallet.pendingKobo) / 100 : 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Wallet & Payouts</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">History</Button>
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw Funds
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Available Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatter.format(balance)}
            </div>
            <p className="text-xs text-gray-400">
              + {formatter.format(pending)} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Virtual Account
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {wallet && wallet.vaStatus === "CREATED" ? (
              <div className="space-y-1">
                <div className="text-xl font-bold flex items-center gap-2">
                  {wallet.vaAccountNumber}
                  <Copy className="h-3 w-3 cursor-pointer text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {wallet.vaBankName} • {wallet.vaAccountName}
                </p>
                <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-1 rounded inline-block">
                  Send money here to fund wallet
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">
                  No active account. Complete KYC.
                </span>
                <Button size="sm" variant="secondary">
                  Setup Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your recent inflows and payouts.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Standardized Empty State */}
            <EmptyState
              title="No recent transactions"
              icon="AlertCircle"
              description="Your recent inflows and payouts will appear here."
            // No action needed for history
            />
          </CardContent>

        </Card>
      </div>
    </div>
  );
}
