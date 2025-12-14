import { Wave } from '@vayva/ui';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-4xl font-bold text-primary-600">Vayva</h1>
                <p className="text-lg">Coming Next: Marketing Home</p>
            </div>
            <Wave className="text-primary-500 w-full" />
        </main>
    );
}
