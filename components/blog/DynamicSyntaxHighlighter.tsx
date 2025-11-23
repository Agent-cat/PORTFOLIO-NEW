"use client";

import { useState, useEffect } from "react";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";

interface DynamicSyntaxHighlighterProps {
  language?: string;
  children: string;
  customStyle?: React.CSSProperties;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
}

export default function DynamicSyntaxHighlighter({ 
  language = "javascript", 
  children, 
  customStyle,
  showLineNumbers = true,
  wrapLines = true
}: DynamicSyntaxHighlighterProps) {
  const [style, setStyle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStyle = async () => {
      try {
        const { atomOneDark } = await import("react-syntax-highlighter/dist/cjs/styles/hljs");
        setStyle(() => atomOneDark);
      } catch (error) {
        console.error("Failed to load syntax highlighting styles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStyle();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!style) {
    // Fallback to basic styling if syntax highlighting fails
    return (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm font-mono">{children}</code>
      </pre>
    );
  }

  return (
    <SyntaxHighlighter
      language={language}
      style={style}
      customStyle={{
        margin: 0,
        padding: "1rem",
        backgroundColor: "transparent",
        fontSize: "0.875rem",
        lineHeight: "1.5",
        ...customStyle,
      }}
      showLineNumbers={showLineNumbers}
      wrapLines={wrapLines}
    >
      {children}
    </SyntaxHighlighter>
  );
}
