"use client";

import { KeyboardEvent, startTransition, useEffect, useState } from "react";

import { SeatResultsModal, SeatResultsView } from "@/components/seat-results-view";
import { searchSeats, type SeatResult } from "@/lib/api";

type ResultViewMode = "page" | "modal";

const RESULT_VIEW_MODE = resolveResultViewMode(process.env.NEXT_PUBLIC_SEAT_RESULT_VIEW);

export function SeatSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SeatResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (RESULT_VIEW_MODE !== "modal" || !showModal) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showModal]);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("请输入姓名后再查询。");
      setResults([]);
      setHasSearched(false);
      setShowModal(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchSeats(trimmedQuery);
      startTransition(() => {
        setResults(data);
        setHasSearched(true);
        setShowModal(RESULT_VIEW_MODE === "modal");
      });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "查询失败，请稍后重试。");
      setResults([]);
      setHasSearched(true);
      setShowModal(RESULT_VIEW_MODE === "modal");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    void handleSearch();
  };

  const handleBack = () => {
    setShowModal(false);
    setHasSearched(false);
    setError(null);
    setResults([]);
  };

  if (RESULT_VIEW_MODE === "page" && hasSearched) {
    return <SeatResultsView error={error} mode="page" onBack={handleBack} query={query} results={results} />;
  }

  return (
    <>
      <div className="space-y-6 rounded-[1.75rem] border border-ink/8 bg-ink px-5 py-5 text-sand shadow-float sm:px-6 sm:py-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.34em] text-sand/55">Quick Query</p>
          <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl">输入姓名，定位座位</h2>
          <p className="text-sm leading-7 text-sand/70">当前结果展示支持结果页切换与模态框两种形式，可通过环境变量切换，避免首页过长和嵌套滚动。</p>
        </div>

        <div aria-label="座位查询表单" className="space-y-4" role="search">
          <label className="block space-y-2">
            <span className="text-sm uppercase tracking-[0.2em] text-sand/55">Name</span>
            <input
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-base text-black outline-none transition placeholder:text-black/35 focus:border-gold focus:ring-2 focus:ring-gold/25"
              enterKeyHint="search"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="例如：张三"
              spellCheck={false}
              value={query}
            />
          </label>
          <button
            className="inline-flex w-full touch-manipulation items-center justify-center rounded-2xl bg-gradient-to-r from-gold via-ember to-olive px-5 py-4 text-sm font-semibold tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onClick={() => {
              void handleSearch();
            }}
            type="button"
          >
            {loading ? "查询中..." : "开始查询"}
          </button>
        </div>

        {error ? <div className="rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-sand">{error}</div> : null}

        {/* <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-sand/60">
          当前结果展示模式：{RESULT_VIEW_MODE === "page" ? "结果页切换" : "模态框"}。微信场景下继续保留无原生表单提交的查询交互。
        </div> */}
      </div>

      <SeatResultsModal error={error} onClose={handleBack} open={showModal} query={query} results={results} />
    </>
  );
}

function resolveResultViewMode(value: string | undefined): ResultViewMode {
  return value === "modal" ? "modal" : "page";
}
