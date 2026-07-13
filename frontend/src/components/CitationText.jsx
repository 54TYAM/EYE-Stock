import React from 'react';

export default function CitationText({ text }) {
  if (!text) return null;

  // Regex to find (Source: X) or (Yahoo Finance) or (Finnhub) or (Reuters)
  const citationRegex = /\((Source:.*?|Yahoo Finance|Finnhub|Reuters|SEC Filings|Wall Street Journal|Bloomberg)\)/gi;

  const parts = text.split(citationRegex);

  return (
    <span>
      {parts.map((part, i) => {
        // If it matches the regex, it will be wrapped in the capture group
        if (part && part.match(/Source:|Yahoo Finance|Finnhub|Reuters|SEC Filings|Wall Street Journal|Bloomberg/i)) {
          const sourceName = part.replace(/Source:\s*/i, '').trim();
          return (
            <span key={i} className="citation-badge">
              <span className="citation-icon">🔗</span>
              {sourceName}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
