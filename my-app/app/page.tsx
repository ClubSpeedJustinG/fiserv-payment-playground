"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <main className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
            Payment Gateway
          </h1>
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Card */}
          <div
            onClick={() => router.push("/current")}
            className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700 shadow-xl cursor-pointer
                     hover:bg-slate-800/50 transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-800 rounded-lg">
                <svg
                  className="w-6 h-6 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-200">
                  Current Payment Flow
                </h2>
                <p className="text-slate-400 text-sm">
                  Use the existing payment integration
                </p>
              </div>
            </div>
          </div>

          {/* New Card */}
          <div
            className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700 shadow-xl cursor-not-allowed
                     opacity-50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-800 rounded-lg">
                <svg
                  className="w-6 h-6 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-200">
                  New Payment Flow
                </h2>
                <p className="text-slate-400 text-sm">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
