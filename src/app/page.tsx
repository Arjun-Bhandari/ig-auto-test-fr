export default function Home() {
  return (
    <section className="px-6 pb-12 ">
      <div className="mx-auto max-w-7xl">
        <div className="relative  overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8 md:p-12">
          <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl animate-blob" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl animate-blob animation-delay-2000" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl animate-blob animation-delay-4000" />

          <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center text-center justify-center rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
                Social Automation Platform
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Automate Instagram replies and DMs with ease
              </h1>
              <p className="mt-3 max-w-prose text-white/70">
                Connect your account, pick a media, and ship automations in
                minutes.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="/automation"
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500/90 transition-colors"
                >
                  Go to Automation
                </a>
                <a
                  href="#learn-more"
                  className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
                >
                  Learn more
                </a>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="mx-auto aspect-[4/3] w-full max-w-md rounded-xl bg-white/5 p-4 ring-1 ring-white/10 animate-float">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-24 rounded-md bg-gradient-to-br from-blue-400/30 to-violet-400/30" />
                  <div className="h-24 rounded-md bg-gradient-to-br from-cyan-400/30 to-blue-400/30" />
                  <div className="h-24 rounded-md bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30" />
                  <div className="h-24 rounded-md bg-gradient-to-br from-fuchsia-400/30 to-rose-400/30" />
                  <div className="h-24 rounded-md bg-gradient-to-br from-emerald-400/30 to-cyan-400/30" />
                  <div className="h-24 rounded-md bg-gradient-to-br from-amber-400/30 to-rose-400/30" />
                  <div className="h-24 rounded-md bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30" />
                  <div className="h-24 rounded-md bg-gradient-to-br from-blue-400/30 to-violet-400/30" />
                  <div className="h-24 rounded-md bg-gradient-to-br from-emerald-400/30 to-cyan-400/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
