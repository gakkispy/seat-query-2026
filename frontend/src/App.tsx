import { SeatSearch } from "@/components/seat-search";

export default function App() {
  return (
    <main className="relative flex min-h-screen flex-1 overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-full w-full max-w-6xl flex-1 items-center">
        <section className="glass-panel relative flex min-h-[calc(100vh-3rem)] w-full flex-1 overflow-hidden rounded-[2rem] border border-white/70 px-6 py-10 shadow-float sm:min-h-[calc(100vh-4rem)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-olive via-gold to-ember" />
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-olive/15 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.36em] text-olive/80">
                Ceremony Seat Lookup
              </span>
              <div className="space-y-5">
                <h1 className="max-w-3xl font-[var(--font-heading)] text-5xl leading-none text-ink sm:text-6xl lg:text-7xl">
                  开幕式座位查询
                </h1>
              </div>
            </div>
            <SeatSearch />
          </div>
        </section>
      </div>
    </main>
  );
}
