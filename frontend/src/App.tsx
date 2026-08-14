import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <div className="flex items-center justify-center gap-6">
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="transition transform hover:scale-110">
            <img src={viteLogo} className="h-16 w-16 drop-shadow-[0_0_15px_rgba(100,108,255,0.5)]" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="transition transform hover:scale-110">
            <img src={reactLogo} className="h-16 w-16 drop-shadow-[0_0_15px_rgba(97,218,251,0.5)] animate-spin-slow" alt="React logo" />
          </a>
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            Pure Tailwind CSS Configured
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI & Data Project Management</h1>
          <p className="text-sm text-slate-400">
            Initial setup complete. Ready for feature development.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-600/25 transition duration-150 ease-in-out cursor-pointer"
          >
            Count is {count}
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
