export default function StoreBuilderPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 border-4 border-green-500">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Store Builder (Shell)</h1>
                <p className="mt-4 text-gray-600">Template selection persisted. Editing mode active.</p>
                <div className="mt-8 p-4 bg-yellow-100 rounded text-yellow-800">
                    Active Template Loaded
                </div>
            </div>
        </div>
    );
}
