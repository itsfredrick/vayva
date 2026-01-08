"use client";

import { RescueOverlay } from "@/components/rescue/RescueOverlay";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <RescueOverlay error={error} reset={reset} />
      </body>
    </html>
  );
}
