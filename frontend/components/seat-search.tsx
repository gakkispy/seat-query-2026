"use client";

import { FormEvent, startTransition, useState } from "react";

import { searchSeats, type SeatResult } from "@/lib/api";

export function SeatSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SeatResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("请输入姓名后再查询。");
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchSeats(trimmedQuery);
      startTransition(() => {
        setResults(data);
        setHasSearched(true);
      });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "查询失败，请稍后重试。");
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[1.75rem] border border-ink/8 bg-ink px-5 py-5 text-sand shadow-float sm:px-6 sm:py-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.34em] text-sand/55">Quick Query</p>
        <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl">输入姓名，定位座位</h2>
        <p className="text-sm leading-7 text-sand/70">结果会展示姓名、组织、分区、排号与座位号，重名会自动通过展示名称区分。</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm uppercase tracking-[0.2em] text-sand/55">Name</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-base text-black outline-none transition placeholder:text-black/35 focus:border-gold focus:ring-2 focus:ring-gold/25"
            placeholder="例如：张三"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button
          className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-gold via-ember to-olive px-5 py-4 text-sm font-semibold tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "查询中..." : "开始查询"}
        </button>
      </form>

      {error ? <div className="rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-sand">{error}</div> : null}

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-sand/60">
          <span>查询结果</span>
          <span>{hasSearched ? `${results.length} 条记录` : "等待输入"}</span>
        </div>

        <div className="max-h-[30rem] space-y-4 overflow-y-auto pr-1">
          {!hasSearched ? (
            <EmptyState title="准备就绪" description="输入姓名后即可查看座位信息。" />
          ) : results.length === 0 ? (
            <EmptyState title="未找到匹配结果" description="请尝试更完整或更接近的姓名关键字。" />
          ) : (
            results.map((seat, index) => (
              <article
                className="seat-card rounded-[1.5rem] border border-white/10 bg-white/8 p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-white/10"
                key={`${seat.display_name}-${seat.zone}-${seat.row}-${seat.seat}-${index}`}
              >
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-sand/50">Guest</p>
                    <h3 className="mt-2 font-[var(--font-heading)] text-2xl text-white">{seat.display_name}</h3>
                    <p className="mt-2 text-sm text-sand/65">{seat.organization}</p>
                  </div>
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs tracking-[0.16em] text-gold">
                    {seat.zone}
                  </span>
                </div>
                <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <MetricCard label="区域" value={seat.zone} />
                  <MetricCard label="排号" value={`${seat.row} 排`} />
                  <MetricCard label="座位" value={`${seat.seat} 座`} />
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-sand/50">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 px-5 py-10 text-center">
      <p className="font-[var(--font-heading)] text-2xl text-white">{title}</p>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-sand/65">{description}</p>
    </div>
  );
}
