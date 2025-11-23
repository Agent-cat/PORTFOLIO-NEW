"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Copy, Check } from "lucide-react";
import DynamicSyntaxHighlighter from "./DynamicSyntaxHighlighter";
// Temporary fallback for testing
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

type Props = { content: string };

export default function ContentRenderer({ content }: Props) {
  return (
    <div className="space-y-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold text-black mt-10 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold text-black mt-8 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-bold text-black mt-6 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-bold text-black mt-5 mb-2">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-bold text-black mt-4 mb-2">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-bold text-black mt-3 mb-2">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="text-gray-800 leading-relaxed text-lg my-4">
              {children}
            </p>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            // Check if it's inline by looking for className (block code has language classes)
            const isInline = !className || className === "";
            if (isInline) {
              return (
                <code className="text-red-600 font-mono font-semibold">
                  {children}
                </code>
              );
            }
            // For block code, let the pre component handle it
            return <code className={className}>{children}</code>;
          },
          pre: ({ children, ...props }: any) => {
            let code = "";
            let language = ""; // Don't default to javascript

            // Extract text content from React elements
            const extractTextContent = (element: any): string => {
              if (typeof element === "string") return element;
              if (typeof element === "number") return String(element);
              if (Array.isArray(element)) {
                return element.map(extractTextContent).join("");
              }
              if (element && typeof element === "object") {
                if (element.props?.children) {
                  return extractTextContent(element.props.children);
                }
                // Handle special cases like newlines
                if (element.type === "br" || element.type === "\n") return "\n";
              }
              return "";
            };

            code = extractTextContent(children);

            // Extract language from code element
            const codeElement = Array.isArray(children)
              ? children[0]
              : children;

            if (codeElement?.props?.className) {
              const codeClass = codeElement.props.className;
              const match = codeClass.match(/language-(\w+)/);
              if (match) {
                let extractedLang = match[1];
                // Map common language shortcuts to full names
                const langMap: { [key: string]: string } = {
                  js: "javascript",
                  ts: "typescript",
                  py: "python",
                  rb: "ruby",
                  sh: "bash",
                  bash: "bash",
                  yml: "yaml",
                  md: "markdown",
                  html: "html",
                  css: "css",
                  json: "json",
                  sql: "sql",
                  go: "go",
                  rs: "rust",
                  php: "php",
                  java: "java",
                  cpp: "cpp",
                  c: "c",
                  cs: "csharp",
                };
                language =
                  langMap[extractedLang.toLowerCase()] ||
                  extractedLang.toLowerCase();
              }
            }

            // Fallback to javascript if no language found
            if (!language) {
              language = "javascript";
            }

            return <CodeBlock code={code} language={language} />;
          },
          table: ({ children }) => (
            <table className="border-collapse border border-gray-300 my-4 w-full">
              {children}
            </table>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border border-gray-300">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-bold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2 text-base">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg my-4"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="absolute -inset-0.5 bg-linear-to-r from-gray-900 to-black rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
      <div className="relative bg-gray-950 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-900 px-4 py-3 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            {language && (
              <span className="text-xs text-gray-400 font-mono uppercase ml-2">
                {language}
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all text-sm font-medium border border-gray-700 hover:border-gray-600"
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code */}
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language || "javascript"}
            style={atomOneDark}
            customStyle={{
              margin: 0,
              padding: "1rem",
              backgroundColor: "transparent",
              fontSize: "0.875rem",
              lineHeight: "1.5",
            }}
            showLineNumbers={true}
            wrapLines={true}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
