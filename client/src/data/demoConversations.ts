export interface DemoConversation {
  id: string;
  title: string;
  category: 'Pronoun Ambiguity' | 'Reference Ambiguity' | 'Lexical Ambiguity' | 'Syntactic Ambiguity' | 'Contextual Ambiguity';
  shortTag: string;
  description: string;
  fullConversation: string;
  highlightNote: string;
}

export const demoConversations: DemoConversation[] = [
  {
    id: 'pronoun-ambiguity',
    title: 'Pronoun Ambiguity',
    category: 'Pronoun Ambiguity',
    shortTag: 'Pronoun',
    description: 'The pronoun “she” could refer to either Maya or Rina. Without sufficient evidence, Contexta asks a targeted clarification question instead of guessing.',
    fullConversation: `Alex: Maya spoke to Rina after she finished work.
Jordan: Who was the one that finished work, Maya or Rina?
Alex: I will check with her tomorrow.`,
    highlightNote: '“she” has two candidate antecedents (Maya vs Rina)'
  },
  {
    id: 'reference-ambiguity',
    title: 'Reference Ambiguity',
    category: 'Reference Ambiguity',
    shortTag: 'Reference',
    description: 'The pronouns “it” and “her” are resolved using evidence from earlier messages, generating a clear, evidence-supported rewrite.',
    fullConversation: `Alex: The project report is ready.
Jordan: Sarah needs the report before 4 PM.
Alex: I will send it to her after the review meeting.`,
    highlightNote: '“it” → project report · “her” → Sarah'
  },
  {
    id: 'lexical-ambiguity',
    title: 'Lexical Ambiguity',
    category: 'Lexical Ambiguity',
    shortTag: 'Lexical',
    description: 'The word “bank” has multiple meanings (financial institution vs riverbank). Context clues (“river”, “fishing”) resolve the intended meaning.',
    fullConversation: `Jordan: I spent the morning fishing by the river.
Alex: Let's meet at the bank at noon.
Jordan: Sounds good, see you there.`,
    highlightNote: '“bank” resolves to riverbank via contextual evidence'
  },
  {
    id: 'syntactic-ambiguity',
    title: 'Syntactic Ambiguity',
    category: 'Syntactic Ambiguity',
    shortTag: 'Grouping',
    description: 'Prepositional phrase attachment ambiguity: does “with the telescope” modify the consultant or the act of observing?',
    fullConversation: `Alex: Did you see anyone outside the office?
Jordan: I saw the consultant with the telescope.
Alex: Please confirm what you meant.`,
    highlightNote: 'Syntactic grouping: “with the telescope” attachment'
  },
  {
    id: 'contextual-ambiguity',
    title: 'Contextual Ambiguity',
    category: 'Contextual Ambiguity',
    shortTag: 'Missing Details',
    description: 'A directive to reschedule a meeting without specifying a target date or time. Contexta flags missing details and requests clarification.',
    fullConversation: `Alex: The client requested revisions to our sprint timeline.
Jordan: Please reschedule the review meeting.
Alex: Let me know what time works best.`,
    highlightNote: 'Missing details: target time and date are unspecified'
  }
];
