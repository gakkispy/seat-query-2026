import { type SeatResult } from "@/lib/api";

interface SeatResultsViewProps {
  query: string;
  results: SeatResult[];
  error: string | null;
  onBack: () => void;
  mode: "page" | "modal";
}

export function SeatResultsView({ query, results, error, onBack, mode }: SeatResultsViewProps) {
  const title = !error && results.length > 1 ? `查询结果（${results.length}）` : "查询结果";

  return (
    <div className={`space-y-6 ${mode === "page" ? "glass-panel rounded-[2rem] border border-white/70 p-6 shadow-float sm:p-10" : "rounded-[1.75rem] bg-ink p-5 text-sand sm:p-6"}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className={`text-xs uppercase tracking-[0.3em] ${mode === "page" ? "text-olive/75" : "text-sand/55"}`}>Result View</p>
          <h2 className={`font-[var(--font-heading)] text-3xl sm:text-4xl ${mode === "page" ? "text-ink" : "text-white"}`}>{title}</h2>
          <p className={mode === "page" ? "text-sm leading-7 text-ink/70" : "text-sm leading-7 text-sand/70"}>关键词：{query || "未提供"}</p>
        </div>
        <button
          className={mode === "page" ? "rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-sm text-ink transition hover:border-olive/30 hover:text-olive" : "rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:border-gold/30 hover:text-gold"}
          onClick={onBack}
          type="button"
        >
          继续查询
        </button>
      </div>

      {error ? <StateMessage description={error} title="查询失败" variant={mode} /> : null}
      {!error && results.length === 0 ? <StateMessage description="请尝试更完整或更接近的姓名关键字。" title="未找到匹配结果" variant={mode} /> : null}

      {!error && results.length > 0 ? (
        <div className={`grid gap-4 ${mode === "page" ? "sm:grid-cols-2 xl:grid-cols-3" : "max-h-[70vh] overflow-y-auto pr-1"}`}>
          {results.map((seat, index) => (
            <article
              className={mode === "page" ? "seat-card rounded-[1.5rem] border border-ink/8 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-float" : "seat-card rounded-[1.5rem] border border-white/10 bg-white/8 p-5 transition hover:-translate-y-1 hover:border-gold/30 hover:bg-white/10"}
              key={`${seat.display_name}-${seat.zone}-${seat.row}-${seat.seat}-${index}`}
            >
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className={mode === "page" ? "text-xs uppercase tracking-[0.22em] text-olive/55" : "text-xs uppercase tracking-[0.22em] text-sand/50"}>Guest</p>
                  <h3 className={mode === "page" ? "mt-2 font-[var(--font-heading)] text-2xl text-ink" : "mt-2 font-[var(--font-heading)] text-2xl text-white"}>{seat.display_name}</h3>
                  <p className={mode === "page" ? "mt-2 text-sm text-ink/65" : "mt-2 text-sm text-sand/65"}>{seat.organization}</p>
                </div>
                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs tracking-[0.16em] text-gold">{seat.zone}</span>
              </div>
              <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <MetricCard label="区域" mode={mode} value={seat.zone} />
                <MetricCard label="排号" mode={mode} value={`${seat.row} 排`} />
                <MetricCard label="座位" mode={mode} value={`${seat.seat} 座`} />
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface SeatResultsModalProps {
  open: boolean;
  query: string;
  results: SeatResult[];
  error: string | null;
  onClose: () => void;
}

export function SeatResultsModal({ open, query, results, error, onClose }: SeatResultsModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 px-4 pb-0 pt-8 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div className="result-modal-panel w-full max-w-4xl rounded-t-[2rem] sm:rounded-[2rem]" onClick={(event) => event.stopPropagation()}>
        <SeatResultsView error={error} mode="modal" onBack={onClose} query={query} results={results} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, mode }: { label: string; value: string; mode: "page" | "modal" }) {
  return (
    <div className={mode === "page" ? "rounded-2xl border border-ink/8 bg-sand/80 px-4 py-3" : "rounded-2xl border border-white/8 bg-black/10 px-4 py-3"}>
      <p className={mode === "page" ? "text-xs uppercase tracking-[0.18em] text-olive/60" : "text-xs uppercase tracking-[0.18em] text-sand/50"}>{label}</p>
      <p className={mode === "page" ? "mt-2 text-base font-semibold text-ink" : "mt-2 text-base font-semibold text-white"}>{value}</p>
    </div>
  );
}

function StateMessage({ title, description, variant }: { title: string; description: string; variant: "page" | "modal" }) {
  return (
    <div className={variant === "page" ? "rounded-[1.5rem] border border-dashed border-ink/12 bg-white/65 px-5 py-10 text-center" : "rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 px-5 py-10 text-center"}>
      <p className={variant === "page" ? "font-[var(--font-heading)] text-2xl text-ink" : "font-[var(--font-heading)] text-2xl text-white"}>{title}</p>
      <p className={variant === "page" ? "mx-auto mt-3 max-w-sm text-sm leading-7 text-ink/65" : "mx-auto mt-3 max-w-sm text-sm leading-7 text-sand/65"}>{description}</p>
    </div>
  );
}
