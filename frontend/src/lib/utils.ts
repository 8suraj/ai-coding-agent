import type { ChatArtifact, ChatMessage } from "./types";

export const generateId = () => crypto.randomUUID();

export const createMessage = (role: ChatMessage["role"], content: string): ChatMessage => ({
  role,
  content,
  id: generateId(),
});

export const splitNdjsonBuffer = (buffer: string) => {
  const parts = buffer.split("\n");
  const remainder = parts.pop() ?? "";
  const lines = parts.map((line) => line.trim()).filter(Boolean);
  return { lines, remainder };
};

const REACT_LANGUAGES = [
  "jsx",
  "tsx",
  "react",
  "javascriptreact",
  "typescriptreact",
  "component",
];

export const isHtmlArtifact = (artifact?: ChatArtifact | null) =>
  artifact?.language?.toLowerCase() === "html";

export const isReactArtifact = (artifact?: ChatArtifact | null) => {
  const lang = artifact?.language?.toLowerCase();
  if (!lang) return false;
  return REACT_LANGUAGES.some((candidate) => lang.includes(candidate));
};

export const buildPreviewDocument = (artifact?: ChatArtifact | null): string | null => {
  if (!artifact) return null;

  if (isHtmlArtifact(artifact)) {
    return artifact.code;
  }

  if (isReactArtifact(artifact)) {
    const isTs = artifact.language?.toLowerCase().includes("ts");
    const presets = isTs ? "react,typescript" : "react";
    const sanitizedCode = artifact.code.replace(/<\/script>/g, "<\\/script>");

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Preview</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      html, body, #root { margin: 0; padding: 0; height: 100%; font-family: system-ui, sans-serif; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <div id="preview-error" style="color:#ef4444;padding:16px;font-family:system-ui;"></div>
    <script type="text/babel" data-type="module" data-presets="${presets}">
      try {
        ${sanitizedCode}

        const PossibleApp = typeof App !== "undefined" ? App : null;
        const element = document.getElementById("root");

        if (PossibleApp) {
          const root = ReactDOM.createRoot(element);
          root.render(<PossibleApp />);
        } else if (typeof renderPreview === "function") {
          renderPreview({ React, ReactDOM, mountNode: element });
        } else {
          document.getElementById("preview-error").innerText =
            "React preview ready. Export a component named App or a function renderPreview({ React, ReactDOM, mountNode }).";
        }
      } catch (error) {
        document.getElementById("preview-error").innerText = "Preview error: " + error.message;
        console.error(error);
      }
    </script>
  </body>
</html>`;
  }

  return null;
};
