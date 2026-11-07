import type { ContextMessage } from '../types';

export interface DemoExample {
  id: string;
  name: string;
  category: 'Unclear reference' | 'Word with more than one meaning' | 'Sentence that can be grouped in different ways' | 'Missing details' | string;
  description: string;
  message: string;
  context: ContextMessage[];
  expectedHighlight: string;
}

export const demos: DemoExample[] = [
  // =========================================================================
  // 1. UNCLEAR REFERENCES
  // =========================================================================
  {
    id: 'demo-1',
    name: 'Unclear Reference (No Context)',
    category: 'Unclear reference',
    description: 'The word “she” could mean Maya or Rina. Without conversation evidence, Contexta asks a clarification question instead of guessing.',
    message: 'Maya spoke to Rina after she finished work.',
    context: [],
    expectedHighlight: '“she” could mean Maya or Rina → Asks: “Does “she” refer to Maya or Rina?”'
  },
  {
    id: 'demo-2',
    name: 'Unclear Reference (Supported by Context)',
    category: 'Unclear reference',
    description: 'Earlier message shows Rina finished work, so Contexta resolves “she” to Rina and suggests a clearer rewrite.',
    message: 'Maya spoke to Rina after she finished work.',
    context: [
      { id: 'c1', speaker: 'Maya', text: 'Rina finished work at 5 PM.' }
    ],
    expectedHighlight: '“she” → Rina → Rewrite: “Maya spoke to Rina after Rina finished work.”'
  },
  {
    id: 'demo-3',
    name: 'Multi-Reference & Event Context',
    category: 'Unclear reference',
    description: 'Resolves pronouns "it" and "her" plus the temporal event demonstrative "that" using multi-turn conversation context.',
    message: 'Send it to her after that',
    context: [
      { id: 'c2', speaker: 'Maya', text: 'The project report is ready.' },
      { id: 'c3', speaker: 'Leo', text: 'Priya needs the report before the client call.' },
      { id: 'c4', speaker: 'Maya', text: 'The team meeting is scheduled for 3 PM.' }
    ],
    expectedHighlight: 'it → project report, her → Priya, that → team meeting'
  },

  // =========================================================================
  // 2. WORDS WITH MORE THAN ONE MEANING
  // =========================================================================
  {
    id: 'demo-4',
    name: 'Word with More Than One Meaning (No Context)',
    category: 'Word with more than one meaning',
    description: '“Bank” could mean a financial institution or land beside a river. Without clues, the system asks which you mean.',
    message: 'We met at the bank.',
    context: [],
    expectedHighlight: '“bank” → Asks: “Do you mean a financial institution or the land beside a river?”'
  },
  {
    id: 'demo-5',
    name: 'Word with More Than One Meaning (Financial Clues)',
    category: 'Word with more than one meaning',
    description: 'Earlier context mentions deposit and cheque, resolving “bank” to financial institution.',
    message: 'We met at the bank.',
    context: [
      { id: 'c5', speaker: 'Maya', text: 'I need to deposit a cheque before work today.' }
    ],
    expectedHighlight: '“bank” → financial institution → Rewrite: “We met at the financial institution.”'
  },
  {
    id: 'demo-6',
    name: 'Word with More Than One Meaning (Riverside Clues)',
    category: 'Word with more than one meaning',
    description: 'Earlier context mentions fishing rods and walking by the river, resolving “bank” to riverbank.',
    message: 'We met at the bank.',
    context: [
      { id: 'c6', speaker: 'Leo', text: 'We brought our fishing rods and walked down by the river.' }
    ],
    expectedHighlight: '“bank” → land beside a river → Rewrite: “We met at the riverbank.”'
  },

  // =========================================================================
  // 3. SENTENCES THAT CAN BE GROUPED IN DIFFERENT WAYS
  // =========================================================================
  {
    id: 'demo-7',
    name: 'Grouping Ambiguity (No Context)',
    category: 'Sentence that can be grouped in different ways',
    description: 'The speaker might have used binoculars, or the teacher might have had them. Without clues, Contexta highlights both readings and asks.',
    message: 'I saw the teacher with binoculars.',
    context: [],
    expectedHighlight: '“with binoculars” → Asks: “Did you use binoculars to see the teacher, or did the teacher have binoculars?”'
  },
  {
    id: 'demo-8',
    name: 'Grouping Ambiguity (Speaker Tool Evidence)',
    category: 'Sentence that can be grouped in different ways',
    description: 'Prior turn shows the speaker had binoculars on the balcony, resolving the prepositional phrase to the speaker tool.',
    message: 'I saw the teacher with binoculars.',
    context: [
      { id: 'c7', speaker: 'Me', text: 'I brought my binoculars to the observation deck.' }
    ],
    expectedHighlight: 'Resolves to speaker instrument → Rewrite: “Using binoculars, I saw the teacher.”'
  },
  {
    id: 'demo-9',
    name: 'Grouping Ambiguity (Telescope Attachment)',
    category: 'Sentence that can be grouped in different ways',
    description: 'Prepositional phrase "with the telescope" can attach to the seeing action or describe the person.',
    message: 'I saw the man with the telescope',
    context: [],
    expectedHighlight: 'Two distinct interpretations: Instrument vs Possession'
  },

  // =========================================================================
  // 4. MISSING DETAILS
  // =========================================================================
  {
    id: 'demo-10',
    name: 'Missing Details: Move the Meeting (No Context)',
    category: 'Missing details',
    description: 'The message does not say which meeting or when to move it. Contexta flags the missing details and asks for clarification.',
    message: 'Move the meeting.',
    context: [],
    expectedHighlight: 'Flags missing target time/meeting → Asks: “Which meeting should be moved, and what date or time should it be moved to?”'
  },
  {
    id: 'demo-11',
    name: 'Missing Details: Move the Meeting (Supported)',
    category: 'Missing details',
    description: 'Earlier context specifies the 3 PM product sync and destination time (tomorrow at 10 AM).',
    message: 'Move the meeting.',
    context: [
      { id: 'c8', speaker: 'Maya', text: 'Our 3 PM product sync needs to be shifted to tomorrow at 10 AM.' }
    ],
    expectedHighlight: 'Resolves target time & sync → Rewrite: “Move the 3 PM product sync to tomorrow at 10 AM.”'
  },
  {
    id: 'demo-12',
    name: 'Missing Details: Send it to Jordan (No Context)',
    category: 'Missing details',
    description: 'The conversation does not make clear which item or which Jordan to contact. Refuses to guess.',
    message: 'Send it to Jordan.',
    context: [],
    expectedHighlight: 'Flags unclear item and contact details → Asks: “What item should be sent, and which Jordan should receive it?”'
  },
  {
    id: 'demo-13',
    name: 'Missing Details: Send it to Jordan (Supported)',
    category: 'Missing details',
    description: 'Prior messages identify the budget spreadsheet and recipient Jordan Miller from Accounting.',
    message: 'Send it to Jordan.',
    context: [
      { id: 'c9', speaker: 'Maya', text: 'The budget spreadsheet is ready.' },
      { id: 'c10', speaker: 'Alex', text: 'Jordan Miller from Accounting will review it.' }
    ],
    expectedHighlight: 'Resolves item & recipient → Rewrite: “Send the budget spreadsheet to Jordan Miller from Accounting.”'
  }
];
