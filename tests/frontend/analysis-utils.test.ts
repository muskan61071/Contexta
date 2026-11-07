import { describe, it, expect } from 'vitest';
import { confidenceLabel } from '../../client/src/utils/confidence';
import { riskClass } from '../../client/src/utils/risk';
import { validateMessage } from '../../client/src/utils/validators';
import { normalizeAmbiguityKind } from '../../client/src/utils/formatters';

describe('analysis presentation helpers', () => {
  it('labels evidence bands', () => {
    expect(confidenceLabel(80)).toBe('High');
    expect(confidenceLabel(60)).toBe('Medium');
    expect(confidenceLabel(20)).toBe('Low');
  });

  it('normalizes risk classes', () => {
    expect(riskClass('High')).toBe('high');
  });

  it('validates empty input and accepts text', () => {
    expect(validateMessage('  ')).toBeTruthy();
    expect(validateMessage('Send it')).toBeNull();
  });

  it('normalizes the four ambiguity categories correctly', () => {
    expect(normalizeAmbiguityKind('Pronoun reference')).toBe('Unclear reference');
    expect(normalizeAmbiguityKind('Lexical ambiguity')).toBe('Word with more than one meaning');
    expect(normalizeAmbiguityKind('Syntactic attachment ambiguity')).toBe('Sentence that can be grouped in different ways');
    expect(normalizeAmbiguityKind('Missing event schedule details')).toBe('Missing details');
  });
});
