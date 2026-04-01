// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function App() {
  return (
    <div className="min-h-screen px-5 pb-5 pt-3 text-slate-700">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-[28px] bg-white/55 px-6 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          <div>
            <p className="text-sm font-medium tracking-wide text-pink-400">
              Cute Desktop App
            </p>
            <h1 className="text-3xl font-semibold text-slate-800">
              Apple-like soft UI
            </h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[36px] border border-white/50 bg-white/45 p-5 shadow-[0_20px_80px_rgba(180,180,255,0.12)] backdrop-blur-3xl"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-[28px] border border-white/70 bg-pink-50/80 p-5 shadow-lg"
            >
              <p className="mb-2 text-sm font-medium text-pink-500">Mood</p>
              <h2 className="text-xl font-semibold">Soft + Cute</h2>
              <p className="mt-2 text-sm text-slate-500">
                Rounded corners, pastel gradients, smooth glassy cards.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-[28px] border border-white/70 bg-violet-50/80 p-5 shadow-lg"
            >
              <p className="mb-2 text-sm font-medium text-violet-500">Style</p>
              <h2 className="text-xl font-semibold">Modern</h2>
              <p className="mt-2 text-sm text-slate-500">
                Clean spacing, simple hierarchy, subtle motion.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-[28px] border border-white/70 bg-sky-50/80 p-5 shadow-lg"
            >
              <p className="mb-2 text-sm font-medium text-sky-500">Feel</p>
              <h2 className="text-xl font-semibold">Desktop-ready</h2>
              <p className="mt-2 text-sm text-slate-500">
                Easy React workflow, but runs as a desktop app.
              </p>
            </motion.div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-lg">
              <p className="mb-3 text-sm font-medium text-slate-400">
                Dashboard Preview
              </p>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Energy</span>
                    <span className="text-sm text-slate-400">82%</span>
                  </div>
                  <div className="h-3 rounded-full bg-pink-100">
                    <div className="h-3 w-[82%] rounded-full bg-pink-300" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Focus</span>
                    <span className="text-sm text-slate-400">65%</span>
                  </div>
                  <div className="h-3 rounded-full bg-violet-100">
                    <div className="h-3 w-[65%] rounded-full bg-violet-300" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Mood</span>
                    <span className="text-sm text-slate-400">91%</span>
                  </div>
                  <div className="h-3 rounded-full bg-sky-100">
                    <div className="h-3 w-[91%] rounded-full bg-sky-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-lg">
              <p className="mb-3 text-sm font-medium text-slate-400">
                Quick Actions
              </p>

              <div className="space-y-3">
                <button className="w-full rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]">
                  New Entry
                </button>
                <button className="w-full rounded-2xl bg-violet-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]">
                  View Stats
                </button>
                <button className="w-full rounded-2xl bg-sky-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;