import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">ExpiryAlert</h1>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="font-medium text-blue-600">Dashboard</Link>
            <Link href="/records" className="text-gray-600 hover:text-gray-900">Records</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        <p className="text-gray-600">Welcome to ExpiryAlert. Add records to start tracking expiry dates.</p>
      </main>
    </div>
  );
}
