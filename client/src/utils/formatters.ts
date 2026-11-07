export function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function normalizeAmbiguityKind(kindOrType: string): string {
  const k = kindOrType.toLowerCase();
  if (k.includes('meaning') || k.includes('lexical') || k.includes('polysemy')) {
    return 'Word with more than one meaning';
  }
  if (k.includes('group') || k.includes('attachment') || k.includes('syntactic')) {
    return 'Sentence that can be grouped in different ways';
  }
  if (k.includes('missing') || k.includes('detail') || k.includes('directive')) {
    return 'Missing details';
  }
  return 'Unclear reference';
}
