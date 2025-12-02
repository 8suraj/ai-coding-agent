import type { ReactNode } from "react";

interface PreviewShellProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  onPopOut?: () => void;
  children: ReactNode;
}

export function PreviewShell({
  title = "Live Preview",
  subtitle = "Claude-style sandbox",
  onRefresh,
  onPopOut,
  children,
}: PreviewShellProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#1a2131] bg-[#060a12] shadow-[0px_0px_40px_rgba(0,0,0,0.65)]">
      <div className="flex items-center justify-between border-b border-[#1a2131] bg-[#090f1b] px-4 py-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#f4d35e]">Preview</span>
            <span className="rounded-full bg-[#f4d35e]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#f4d35e]">
              Live
            </span>
          </div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-white/50">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Refresh
            </button>
          )}
          {onPopOut && (
            <button
              type="button"
              onClick={onPopOut}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Pop out
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 bg-[#04070d]">
        {children}
      </div>
    </div>
  );
}
