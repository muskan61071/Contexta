import { describe, it, expect } from 'vitest';
import { parseConversation, getSpeakerColor } from '../../client/src/utils/conversationParser';

describe('conversationParser', () => {
  it('parses standard Name: Message lines', () => {
    const raw = `Maya: The project report is ready.
Leo: Priya needs the report before 4 PM.
Maya: I will send it to her after the meeting.`;

    const parsed = parseConversation(raw);
    expect(parsed).toHaveLength(3);
    expect(parsed[0].speaker).toBe('Maya');
    expect(parsed[0].text).toBe('The project report is ready.');
    expect(parsed[1].speaker).toBe('Leo');
    expect(parsed[1].text).toBe('Priya needs the report before 4 PM.');
    expect(parsed[2].speaker).toBe('Maya');
    expect(parsed[2].text).toBe('I will send it to her after the meeting.');
  });

  it('handles bracketed timestamps', () => {
    const raw = `[10:30 AM] Sarah: Did you finish the draft?
[10:32 AM] John: Yes, it is uploaded.`;

    const parsed = parseConversation(raw);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].speaker).toBe('Sarah');
    expect(parsed[0].timestamp).toBe('10:30 AM');
    expect(parsed[1].speaker).toBe('John');
    expect(parsed[1].timestamp).toBe('10:32 AM');
  });

  it('handles multi-line messages under the same speaker', () => {
    const raw = `Alex: Here is the first part.
And here is the second part.
Jordan: Received, thanks!`;

    const parsed = parseConversation(raw);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].speaker).toBe('Alex');
    expect(parsed[0].text).toBe('Here is the first part.\nAnd here is the second part.');
    expect(parsed[1].speaker).toBe('Jordan');
  });

  it('handles empty or whitespace-only input', () => {
    expect(parseConversation('')).toEqual([]);
    expect(parseConversation('   \n\n  ')).toEqual([]);
  });

  it('handles raw lines without speaker prefixes by alternating speakers', () => {
    const raw = `The project report is ready.
Priya needs the report before 4 PM.
I will send it to her.`;

    const parsed = parseConversation(raw);
    expect(parsed).toHaveLength(3);
    expect(parsed[0].speaker).toBe('Person 1');
    expect(parsed[1].speaker).toBe('Person 2');
    expect(parsed[2].speaker).toBe('Person 1');
  });

  it('handles a single line input', () => {
    const raw = 'I will send it to her after that.';
    const parsed = parseConversation(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].text).toBe('I will send it to her after that.');
  });

  it('determines speaker color based on speaker list', () => {
    const color = getSpeakerColor('Alex', ['Alex', 'Jordan']);
    expect(color).toBeTruthy();
  });

  it('handles dash separated speaker names like "Maya - Hello"', () => {
    const raw = `Maya - The project report is ready.
Leo - Priya needs the report before 4 PM.`;
    const parsed = parseConversation(raw);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].speaker).toBe('Maya');
    expect(parsed[0].text).toBe('The project report is ready.');
    expect(parsed[1].speaker).toBe('Leo');
    expect(parsed[1].text).toBe('Priya needs the report before 4 PM.');
  });

  it('handles parenthesized timestamps like "Maya (10:30 AM): Hello"', () => {
    const raw = `Maya (10:30 AM): The project report is ready.
Leo (10:32 AM): Priya needs the report before 4 PM.`;
    const parsed = parseConversation(raw);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].speaker).toBe('Maya');
    expect(parsed[0].timestamp).toBe('10:30 AM');
    expect(parsed[1].speaker).toBe('Leo');
    expect(parsed[1].timestamp).toBe('10:32 AM');
  });
});

