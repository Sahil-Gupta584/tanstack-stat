import { Snippet } from "@heroui/react";
import { useState } from "react";
//@ts-expect-error dont install typed package
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//@ts-expect-error dont install typed package
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ codeSamples, compact = false }: { codeSamples: Record<string, string>, compact?: boolean }) {
  const languages = Object.keys(codeSamples || {});
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  return (
    <div className={`w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0c] shadow-sm overflow-hidden`}>
      <div className={`flex items-center space-x-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#161619]/50 px-3 ${compact ? 'py-1' : 'py-2'} text-xs`}>
        {languages.length > 1 ? (
          languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-2 py-0.5 rounded-md capitalize transition font-bold ${selectedLang === lang
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
                } cursor-pointer`}
            >
              {lang}
            </button>
          ))
        ) : (
          <span className="font-bold text-gray-500 uppercase tracking-tighter">{selectedLang}</span>
        )}
        <div className="ml-auto scale-85 origin-right">
          <Snippet
            title=""
            symbol=""
            variant="flat"
            className="bg-transparent p-0"
            onCopy={() =>
              navigator.clipboard.writeText(codeSamples[selectedLang])
            }
          />
        </div>
      </div>

      {/* Code Block */}
      <SyntaxHighlighter
        language={selectedLang.toLowerCase()}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: "0 0 0.5rem 0.5rem",
          padding: compact ? "0.75rem" : "1rem",
          background: "transparent",
          fontSize: compact ? "0.8rem" : "0.9rem",
          lineHeight: "1.5",
        }}
        codeTagProps={{ className: "font-mono" }}
      >
        {codeSamples[selectedLang]}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
