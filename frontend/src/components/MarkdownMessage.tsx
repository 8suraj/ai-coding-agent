import { useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownMessageProps {
  content: string;
}

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 transition hover:border-white/30 hover:bg-white/10"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const CodeBlock = ({ language, value }: { language?: string; value: string }) => (
  <div className="my-3 max-h-[60vh] w-full overflow-auto rounded-2xl border border-[#1a2131] bg-[#05070d]">
    <div className="flex items-center justify-between border-b border-[#1a2131] px-4 py-2 text-xs uppercase tracking-[0.4em] text-[#f4d35e]">
      <span>{language ?? "CODE"}</span>
      <CopyButton value={value} />
    </div>
    <SyntaxHighlighter
      language={language}
      style={atomDark}
      customStyle={{
        margin: 0,
        padding: "1.25rem",
        background: "#05070d",
        fontSize: "0.95rem",
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
      }}
      wrapLongLines
    >
      {value}
    </SyntaxHighlighter>
  </div>
);

type CodeProps = HTMLAttributes<HTMLElement> & {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

const Code = ({ inline, className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || "");
  const value = String(children).replace(/\n$/, "");
  if (!inline) {
    return <CodeBlock language={match?.[1]} value={value} />;
  }
  return (
    <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-xs font-mono text-white" {...props}>
      {children}
    </code>
  );
};

const components: Components = {
  code: Code,
  p({ children }) {
    return <p className="mb-4 text-base leading-relaxed last:mb-0">{children}</p>;
  },
  ul({ children }) {
    return <ul className="mb-4 list-disc space-y-3 pl-6 text-base text-white/80 marker:text-[#f4d35e]">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="mb-4 list-decimal space-y-3 pl-6 text-base text-white/80 marker:text-[#f4d35e]">{children}</ol>;
  },
  li({ children }) {
    return <li className="space-y-2">{children}</li>;
  },
  a({ children, href }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-[#10a37f] underline decoration-dotted hover:text-[#0f8f6f]"
      >
        {children}
      </a>
    );
  },
};

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  const memoized = useMemo(() => content, [content]);
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {memoized}
    </ReactMarkdown>
  );
}
