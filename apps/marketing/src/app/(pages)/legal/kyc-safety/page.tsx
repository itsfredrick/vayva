"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileCheck,
  Info,
  ArrowLeft,
} from "lucide-react";
import { Button, Card } from "@vayva/ui";
import Link from "next/link";

export default function KycSafetyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/help">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Help
          </Button>
        </Link>

        <div className="space-y-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Identity Verification & Compliance
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
            At Vayva, your data security and regulatory compliance are our top
            priorities. Here's how we handle your identity information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-3">
            <div className="p-2 bg-slate-100 rounded-lg w-fit">
              <Info className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="font-bold">Why we ask for BVN/NIN</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Under Central Bank of Nigeria (CBN) regulations, we are required
              to verify the identity of all merchants facilitating financial
              transactions to prevent fraud and money laundering (AML/KYC).
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="p-2 bg-slate-100 rounded-lg w-fit">
              <Lock className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="font-bold">Encryption & Storage</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your full ID numbers are never stored in our primary database. We
              use bank-grade AES-256 encryption and only store the last 4 digits
              for reference and audit purposes.
            </p>
          </Card>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Data Privacy Principles</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="p-3 bg-primary/5 rounded-full h-fit">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Strict Access Control</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Only authorized Vayva compliance officers can view
                  verification status. No technical staff has access to your
                  identity data.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-primary/5 rounded-full h-fit">
                <FileCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Third-Party Verification</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We verify your data against government databases through
                  licensed Tier-1 partners. We never sell your data to any third
                  party.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Card className="p-8 bg-slate-900 text-white space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold italic uppercase tracking-tight">
              Consent Acknowledgement
            </h3>
            <p className="text-sm text-slate-400">
              By initiating identity verification, you agree to the following:
            </p>
          </div>

          <ul className="text-xs space-y-3 text-slate-300 list-disc pl-5 font-medium leading-relaxed">
            <li>
              You authorize Vayva to verify your provided ID against the
              National Identity Management Commission (NIMC) or your bank's
              records.
            </li>
            <li>
              You understand this is a one-time verification solely for the
              purpose of enabling payouts for your store.
            </li>
            <li>
              You acknowledge that Vayva will log your IP address and timestamp
              of this consent for regulatory audit compliance.
            </li>
          </ul>

          <div className="pt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Compliant with NDPR & CBN Guidelines
            </span>
          </div>
        </Card>

        <div className="text-center pt-8">
          <p className="text-xs text-muted-foreground mb-4">
            Have questions about your data safety?
          </p>
          <div className="flex justify-center gap-4">
            <Link href="mailto:compliance@vayva.ng">
              <Button
                variant="outline"
                size="sm"
                className="font-bold rounded-full"
              >
                Contact Compliance
              </Button>
            </Link>
            <Link href="/legal/privacy">
              <Button
                variant="ghost"
                size="sm"
                className="font-bold rounded-full underline"
              >
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
