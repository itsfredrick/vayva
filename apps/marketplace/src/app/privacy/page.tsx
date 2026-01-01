import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">
        At Vayva, we take your privacy seriously. This privacy policy describes
        how we collect, use, and handle your information when you use our
        services.
      </p>
      <p className="mb-4 text-gray-700">
        For the full Vayva platform privacy policy, please visit our main
        website.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="text-sm border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
        >
          &larr; Back to Marketplace
        </Link>
      </div>
    </div>
  );
}
