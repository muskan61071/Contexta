import React from 'react';
import type { Analysis, ContextMessage } from '../types';
import ConversationAnalyzer from './ConversationAnalyzer';

interface Props {
  message?: string;
  onMessageChange?: (val: string) => void;
  contextMessages?: ContextMessage[];
  onContextMessagesChange?: (messages: ContextMessage[]) => void;
  result: Analysis | null;
  busy: boolean;
  error: string;
  onRunAnalysis: (msg: string, ctx: ContextMessage[]) => Promise<void> | void;
  onClearWorkspace: () => void;
}

export default function Analyzer({
  message = '',
  contextMessages = [],
  result,
  busy,
  error,
  onRunAnalysis,
  onClearWorkspace
}: Props) {
  return (
    <ConversationAnalyzer
      result={result}
      busy={busy}
      error={error}
      onRunAnalysis={onRunAnalysis}
      onClearWorkspace={onClearWorkspace}
      initialText={message}
      initialContext={contextMessages}
    />
  );
}
