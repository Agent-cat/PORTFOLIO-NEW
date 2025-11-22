"use client";

import { createElement, useState, ReactNode } from "react";
import { Copy, Check } from "lucide-react";

type Props = { content: string };

export default function ContentRenderer({ content }: Props) {
  const nodes = parseContent(content);
  return (
    <div className="space-y-6">
      {nodes.map((node, i) => {
        const key = `${i}`;
        if (node.type === "code") {
          return <CodeBlock key={key} code={node.value} />;
        }
        if (node.type === "heading") {
          const tag = `h${node.depth}` as
            | "h1"
            | "h2"
            | "h3"
            | "h4"
            | "h5"
            | "h6";
          const headingClasses = {
            h1: "text-4xl font-bold text-black mt-10 mb-4",
            h2: "text-3xl font-bold text-black mt-8 mb-3",
            h3: "text-2xl font-bold text-black mt-6 mb-2",
            h4: "text-xl font-bold text-black mt-5 mb-2",
            h5: "text-lg font-bold text-black mt-4 mb-2",
            h6: "text-base font-bold text-black mt-3 mb-2",
          };
          return createElement(
            tag,
            { key, className: headingClasses[tag] },
            renderInlineMarkdown(node.value)
          );
        }
        if (node.type === "hr") {
          return <hr key={key} className="my-8 border-t-2 border-gray-400" />;
        }
        if (node.type === "list") {
          return (
            <ul
              key={key}
              className="list-disc list-inside text-gray-800 space-y-2 my-4"
            >
              {(node.items as string[]).map((item, idx) => (
                <li key={idx} className="text-base leading-relaxed">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={key} className="text-gray-800 leading-relaxed text-base my-4">
            {renderInlineMarkdown(node.value)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  // Pattern for bold, italic, and code
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, tag: "strong", class: "font-bold text-black" },
    { regex: /__(.+?)__/g, tag: "strong", class: "font-bold text-black" },
    { regex: /\*(.+?)\*/g, tag: "em", class: "italic" },
    { regex: /_(.+?)_/g, tag: "em", class: "italic" },
    {
      regex: /(`[^`]*`)/g,
      tag: "code",
      class:
        "bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono text-red-600 font-bold",
    },
  ];

  let result = text;
  const replacements: Array<{
    start: number;
    end: number;
    element: ReactNode;
    id: number;
  }> = [];

  let elementId = 0;
  for (const { regex, tag, class: className } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      // For code blocks, keep the backticks visible
      const content = tag === "code" ? match[1] : match[1];
      const element = createElement(tag, { key: elementId, className }, content);
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        element,
        id: elementId++,
      });
    }
  }

  // Sort by start position and merge overlapping
  replacements.sort((a, b) => a.start - b.start);

  let currentIndex = 0;
  for (const replacement of replacements) {
    if (replacement.start >= currentIndex) {
      if (replacement.start > currentIndex) {
        parts.push(text.substring(currentIndex, replacement.start));
      }
      parts.push(replacement.element);
      currentIndex = replacement.end;
    }
  }

  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : text;
}

function CodeBlock({ code }: { code: string }) {
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
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
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
        <pre className="px-4 py-4 overflow-x-auto">
          <code className="text-sm leading-relaxed whitespace-pre font-mono text-gray-100">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

function parseContent(input: string): Array<any> {
  const lines = input.split(/\r?\n/);
  const nodes: Array<any> = [];
  let inCode = false;
  let codeBuffer: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith("````")) continue;
    if (line.trim().startsWith("```")) {
      if (!inCode) {
        inCode = true;
        codeBuffer = [];
      } else {
        inCode = false;
        nodes.push({ type: "code", value: codeBuffer.join("\n") });
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    // Check for horizontal rule
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      if (inList) {
        nodes.push({ type: "list", items: listItems });
        inList = false;
        listItems = [];
      }
      nodes.push({ type: "hr" });
      continue;
    }

    // Check for list items
    const listMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
    if (listMatch) {
      inList = true;
      listItems.push(listMatch[1]);
      continue;
    }

    // If we were in a list and this line isn't a list item, end the list
    if (inList && !listMatch) {
      nodes.push({ type: "list", items: listItems });
      inList = false;
      listItems = [];
    }

    // Check for heading
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      nodes.push({
        type: "heading",
        value: headingMatch[2],
        depth: headingMatch[1].length as any,
      });
    } else if (line.trim() === "") {
      nodes.push({ type: "paragraph", value: "" });
    } else {
      nodes.push({ type: "paragraph", value: line });
    }
  }

  // Handle unclosed list at end of content
  if (inList) {
    nodes.push({ type: "list", items: listItems });
  }

  return nodes.filter(
    (n, i) => !(n.type === "paragraph" && n.value === "" && i !== 0)
  );
}
