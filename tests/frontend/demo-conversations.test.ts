import { describe, it, expect } from 'vitest';
import { demoConversations } from '../../client/src/data/demoConversations';
import { parseConversation } from '../../client/src/utils/conversationParser';

describe('demoConversations', () => {
  it('includes all 5 required ambiguity categories', () => {
    const categories = demoConversations.map((d) => d.category);
    expect(categories).toContain('Pronoun Ambiguity');
    expect(categories).toContain('Reference Ambiguity');
    expect(categories).toContain('Lexical Ambiguity');
    expect(categories).toContain('Syntactic Ambiguity');
    expect(categories).toContain('Contextual Ambiguity');
    expect(demoConversations).toHaveLength(5);
  });

  it('ensures every demo conversation parses into valid chat messages', () => {
    for (const demo of demoConversations) {
      expect(demo.fullConversation.trim().length).toBeGreaterThan(0);
      const parsed = parseConversation(demo.fullConversation);
      expect(parsed.length).toBeGreaterThanOrEqual(2);
      expect(parsed[0].speaker).toBeTruthy();
      expect(parsed[0].text).toBeTruthy();
    }
  });

  it('has non-empty descriptions and highlights', () => {
    for (const demo of demoConversations) {
      expect(demo.description).toBeTruthy();
      expect(demo.highlightNote).toBeTruthy();
      expect(demo.shortTag).toBeTruthy();
    }
  });
});
