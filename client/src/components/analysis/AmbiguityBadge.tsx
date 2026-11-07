import React from 'react';
import { Tag } from 'lucide-react';

interface Props {
  type: string;
}

export default function AmbiguityBadge({ type }: Props) {
  const t = type.toLowerCase();
  const colorClass = t.includes('pronoun')
    ? 'pronoun'
    : t.includes('referential') || t.includes('deictic')
    ? 'referential'
    : t.includes('lexical')
    ? 'lexical'
    : t.includes('syntactic') || t.includes('attachment')
    ? 'syntactic'
    : t.includes('semantic') || t.includes('binding')
    ? 'semantic'
    : 'contextual';

  return (
    <span className={`cat-pill ${colorClass}`}>
      <Tag size={10} style={{ marginRight: 4 }} />
      {type}
    </span>
  );
}
