"use client";

export default function Fail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <main className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-500">
            Payment Failed
          </h1>
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Failed</span>
          </div>
        </div>

        <div
          className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700 shadow-xl 
                      transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl 
                      hover:shadow-red-500/20 hover:border-red-500/50"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-slate-800 rounded-lg transform transition-transform hover:rotate-[360deg] duration-700">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-200">
                Transaction Failed
              </h2>
              <p className="text-slate-400 text-sm">
                Your payment could not be processed
              </p>
            </div>
          </div>

          <div className="text-center py-8">
            <div className="mb-6 animate-bounce">
              <svg
                className="w-16 h-16 text-red-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3
              className="text-2xl font-semibold text-red-400 mb-2 
                         hover:scale-110 transform transition-transform duration-200"
            >
              Payment Failed
            </h3>
            <p className="text-slate-300 mb-8">
              We were unable to process your transaction. Please try again.
            </p>
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 
                       rounded-lg font-medium transition-all duration-300
                       hover:opacity-90 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30
                       focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900
                       inline-flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Try Again
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
