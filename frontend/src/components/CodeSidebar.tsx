import { useEffect, useMemo, useRef, useState } from "react";

import Editor from "@monaco-editor/react";
import clsx from "classnames";

import { PreviewShell } from "@/components/PreviewShell";
import { buildPreviewDocument } from "@/lib/utils";
import { setSidebarOpen, setViewMode } from "@/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCurrentArtifact, selectViewMode } from "@/store/selectors";

export function CodeSidebar() {
  const dispatch = useAppDispatch();
  const currentArtifact = useAppSelector(selectCurrentArtifact);
  const viewMode = useAppSelector(selectViewMode);
  const [previewKey, setPreviewKey] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!currentArtifact) {
    return null;
  }

  const previewDocument = useMemo(
    () => buildPreviewDocument(currentArtifact),
    [currentArtifact]
  );

  const downloadArtifact = () => {
    const blob = new Blob([currentArtifact.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const extension = currentArtifact.language?.split("/")[0] ?? "txt";
    const link = document.createElement("a");
    link.href = url;
    link.download = `artifact.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, [currentArtifact, viewMode]);

  return (
    <aside
      ref={containerRef}
      className="fixed inset-y-0 right-0 z-20 flex w-full max-w-xl flex-col overflow-y-auto border-l border-[#1a2131] bg-[#080e18] shadow-[0_20px_60px_rgba(0,0,0,0.5)] md:static md:h-auto md:shadow-none"
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#1a2131] px-4 py-3">
        <div className="inline-flex rounded-lg border border-[#1f2538] bg-[#0c1423] p-1 text-sm text-white/80">
          {(["code", "preview"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => dispatch(setViewMode(mode))}
              className={clsx(
                "rounded-md px-3 py-1 transition",
                mode === viewMode
                  ? "bg-[#f4d35e]/20 text-[#f4d35e]"
                  : "text-white/70 hover:text-white"
              )}
            >
              {mode === "code" ? "Code" : "Preview"}
            </button>
          ))}
        </div>
        <button
          onClick={downloadArtifact}
          className="rounded-lg border border-white/15 px-3 py-1 text-xs text-white/70 hover:border-white/30"
        >
          Download
        </button>
        <button
          onClick={() => dispatch(setSidebarOpen(false))}
          className="rounded-lg border border-white/15 px-3 py-1 text-xs text-white/70 hover:border-white/30 md:hidden"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === "code" ? (
          <div className="h-full overflow-y-auto">
            <Editor
              height="100%"
              theme="vs-dark"
              language={currentArtifact.language ?? "typescript"}
              value={currentArtifact.code}
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </div>
        ) : previewDocument ? (
          <PreviewShell
            title={currentArtifact.language?.toUpperCase() ?? "Preview"}
            subtitle="Claude-style sandbox"
            onRefresh={() => setPreviewKey((key) => key + 1)}
            onPopOut={() => {
              const blob = new Blob([previewDocument], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              window.open(url, "_blank", "noopener,noreferrer");
              setTimeout(() => URL.revokeObjectURL(url), 5000);
            }}
          >
            <iframe
              key={previewKey}
              className="h-full w-full bg-white"
              sandbox="allow-scripts allow-same-origin"
              srcDoc={previewDocument}
              title="Code preview"
            />
          </PreviewShell>
        ) : (
          <PreviewShell title="Preview unavailable" subtitle="Provide HTML or React to enable live view">
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/60">
              Preview currently supports HTML and React artifacts. Switch back to the Code view or provide one of those formats.
            </div>
          </PreviewShell>
        )}
      </div>
    </aside>
  );
}
