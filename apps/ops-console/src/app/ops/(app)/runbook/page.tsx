"use client";

import { ArrowLeft, BookOpen, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import Link from "next/link";

export default function RescueRunbookPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <Link
                    href="/ops"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-indigo-600" />
                    <h1 className="text-3xl font-bold text-gray-900">
                        Vayva Rescue Runbook
                    </h1>
                </div>
                <p className="text-gray-500 mt-2 text-lg">
                    Standard Operating Procedures for AI-Assisted Incident Response
                </p>
            </div>

            <div className="prose prose-indigo max-w-none bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                {/* Content derived from docs/rescue-runbook.md */}
                <div className="space-y-8">
                    <Section title="1. Overview">
                        <p>
                            The Vayva Rescue System is a specialized AI agent designed to diagnose and
                            propose fixes for operational incidents. It operates in a <strong>Read-Only</strong> capacity
                            by default and requires Human-in-the-Loop (HITL) approval for any write actions/mutations.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                            <Shield className="h-5 w-5 text-blue-600 shrink-0" />
                            <div className="text-sm text-blue-800">
                                <strong>Core Principle:</strong> Do No Harm. The Rescue Agent prioritizes platform stability
                                and data integrity over speed.
                            </div>
                        </div>
                    </Section>

                    <Section title="2. Triage Levels & Response">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                            <TriageCard
                                level="P0 - Critical"
                                desc="Platform Outage, Data Loss, Payment Failure"
                                response="Immediate. Wake on-call. Agent starts diagnostics."
                                color="red"
                            />
                            <TriageCard
                                level="P1 - High"
                                desc="Feature degradation, Stuck Jobs, High Latency"
                                response="Agent analyzes root cause. Staff notified within 30m."
                                color="amber"
                            />
                            <TriageCard
                                level="P2 - Medium"
                                desc="UX Glitches, Non-blocking errors"
                                response="Agent logs issue. Review during business hours."
                                color="blue"
                            />
                        </div>
                    </Section>

                    <Section title="3. Incident Workflow">
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>
                                <strong>Detection:</strong> Sentry/CloudWatch triggers an alert to <code>/api/webhooks/rescue</code>.
                            </li>
                            <li>
                                <strong>Analysis:</strong> Rescue Agent (Groq) queries logs/metrics to identify root cause.
                            </li>
                            <li>
                                <strong>Proposal:</strong> Agent drafts a Remediation Plan (see Ops Console).
                            </li>
                            <li>
                                <strong>Approval:</strong> On-call engineer invokes <code>/approve</code> or manually executes fix.
                            </li>
                            <li>
                                <strong>Verification:</strong> Post-fix health check confirms stability.
                            </li>
                        </ol>
                    </Section>

                    <Section title="4. Kill Switch & Safety">
                        <p>
                            If the Rescue Agent behaves unexpectedly or consumes excessive resources:
                        </p>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                            <div className="text-sm text-red-800">
                                <strong>Emergency Stop:</strong> Set <code>RESCUE_AGENT_ENABLED=false</code> in Vercel Env Vars.
                                This immediately halts all agent activities.
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                {title}
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
                {children}
            </div>
        </section>
    );
}

function TriageCard({ level, desc, response, color }: { level: string; desc: string; response: string; color: "red" | "amber" | "blue" }) {
    const colors = {
        red: "bg-red-50 border-red-100 text-red-900",
        amber: "bg-amber-50 border-amber-100 text-amber-900",
        blue: "bg-blue-50 border-blue-100 text-blue-900",
    };

    return (
        <div className={`p-4 rounded-lg border ${colors[color]}`}>
            <div className="font-bold mb-1">{level}</div>
            <div className="text-sm opacity-90 mb-2">{desc}</div>
            <div className="text-xs font-mono bg-white/50 p-2 rounded">
                RESPONSE: {response}
            </div>
        </div>
    );
}
