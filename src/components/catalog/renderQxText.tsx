import type { ReactNode } from 'react';

const QX_TOKEN_REGEX = /\bQX\b/gi;

export function renderQxText(text: string): ReactNode {
  const matches = text.match(QX_TOKEN_REGEX);
  if (!matches) return text;

  const parts = text.split(QX_TOKEN_REGEX);

  return parts.flatMap((part, index) => [
    part,
    index < matches.length ? (
      <span key={`qx-${index}`} className="qx-word">
        {matches[index].toUpperCase()}
      </span>
    ) : null,
  ]);
}
