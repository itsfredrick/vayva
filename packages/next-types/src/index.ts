import type { NextRequest } from "next/server";

export interface RouteContext<T = Record<string, string>> {
  params: Promise<T>;
}

export type { NextRequest };
