import { GlobalFooter } from "@/components/layout/GlobalFooter";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
                    <a href="/" className="text-xl font-bold text-gray-900">Vayva</a>
                </div>
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12">
                    {children}
                </div>
            </main>

            <GlobalFooter />
        </div>
    );
}
