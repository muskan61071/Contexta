export interface ParsedMessage {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
}

/**
 * Parses raw pasted chat text into structured message turns.
 * Handles:
 * - "Speaker: Message text"
 * - "[10:30 AM] Speaker: Message text"
 * - "Speaker (10:30): Message text"
 * - "Speaker - Message text"
 * - Multi-line continuations
 * - Unprefixed lines (inferred alternating speakers)
 */
export function parseConversation(rawText: string): ParsedMessage[] {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  // Regex patterns for detecting speaker turns
  // E.g.: "Alex: Hello", "[10:30 AM] Alex: Hello", "Alex (10:30 AM): Hello", "Alex - Hello"
  const colonSpeakerPattern = /^(?:\[([^\]]+)\]\s*)?([A-Za-z0-9\s._'-]{1,30}?)(?:\s*\(([^)]+)\))?\s*[:–—]\s*(.+)$/;
  const dashSpeakerPattern = /^(?:\[([^\]]+)\]\s*)?([A-Za-z0-9\s._'-]{1,30}?)\s+-\s+(.+)$/;

  const parsed: ParsedMessage[] = [];
  let currentSpeaker = '';
  let currentText = '';
  let currentTime = '';
  let turnIndex = 1;

  for (const line of lines) {
    const colonMatch = line.match(colonSpeakerPattern);
    const dashMatch = !colonMatch ? line.match(dashSpeakerPattern) : null;
    const match = colonMatch || dashMatch;

    if (match) {
      if (currentText && currentSpeaker) {
        parsed.push({
          id: `msg-${turnIndex}`,
          speaker: currentSpeaker,
          text: currentText,
          timestamp: currentTime || `Turn ${turnIndex}`
        });
        turnIndex++;
      }
      const rawTime = colonMatch ? (match[1] || match[3] || '') : (match[1] || '');
      currentSpeaker = match[2].trim();
      currentText = (colonMatch ? match[4] : match[3]).trim();
      currentTime = rawTime.trim();
    } else {
      // Line doesn't have a speaker prefix
      if (currentSpeaker && currentText) {
        // Multi-line continuation of the active message
        currentText += `\n${line}`;
      } else {
        // First line has no prefix
        currentSpeaker = 'Person 1';
        currentText = line;
      }
    }
  }

  if (currentText && currentSpeaker) {
    parsed.push({
      id: `msg-${turnIndex}`,
      speaker: currentSpeaker,
      text: currentText,
      timestamp: currentTime || `Turn ${turnIndex}`
    });
  }

  // If no lines had speaker prefixes at all but multiple lines were pasted,
  // assign alternating speakers so each message gets distinct chat bubble formatting
  if (parsed.length === 1 && lines.length > 1) {
    return lines.map((line, idx) => ({
      id: `msg-${idx + 1}`,
      speaker: idx % 2 === 0 ? 'Person 1' : 'Person 2',
      text: line,
      timestamp: `Turn ${idx + 1}`
    }));
  }

  return parsed;
}

/**
 * Assigns distinct color gradients to speakers for consistent avatar and bubble styling.
 */
export const speakerGradients = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)', // Indigo-Purple
  'linear-gradient(135deg, #0ea5e9, #2563eb)', // Sky-Blue
  'linear-gradient(135deg, #10b981, #059669)', // Emerald-Green
  'linear-gradient(135deg, #f59e0b, #d97706)', // Amber-Orange
  'linear-gradient(135deg, #ec4899, #d946ef)', // Pink-Fuchsia
  'linear-gradient(135deg, #8b5cf6, #6d28d9)'  // Violet-Purple
];

export function getSpeakerColor(speaker: string, speakerList: string[]): string {
  const index = speakerList.indexOf(speaker);
  if (index === -1) return speakerGradients[0];
  return speakerGradients[index % speakerGradients.length];
}
