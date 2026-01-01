"use client";

import * as React from "react";
import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./Button";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`ErrorBoundary caught error in [${this.props.name || "Unknown Component"}]:`, error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-6 rounded-xl border border-red-100 bg-red-50/50 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-red-900">Something went wrong</h3>
                        <p className="text-sm text-red-700/70 max-w-[240px]">
                            We couldn't load this {this.props.name || "section"}. Try refreshing the page.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reload Page
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
