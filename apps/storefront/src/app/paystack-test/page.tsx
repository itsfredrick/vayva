import { notFound } from "next/navigation";
import PaystackTestClient from "./PaystackTestClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paystack Test | Vayva",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaystackTestPage() {
  return (
    <div>
      <PaystackTestClient />
    </div>
  );
}
