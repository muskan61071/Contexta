import type { Analysis, ContextMessage } from '../types';

const base = import.meta.env.VITE_API_URL || '/api';

export async function analyze(message: string, context: ContextMessage[]): Promise<Analysis> {
  const r = await fetch(`${base}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context })
  });
  if (!r.ok) {
    const errorData = await r.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.detail || 'Analysis could not be completed. Please try again.');
  }
  return r.json();
}

export async function previewAnalysis(message: string, context: ContextMessage[]): Promise<Analysis> {
  const r = await fetch(`${base}/analyze/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context })
  });
  if (!r.ok) {
    throw new Error('Live analysis preview is temporarily unavailable.');
  }
  return r.json();
}

export async function history(): Promise<Analysis[]> {
  const r = await fetch(`${base}/history`);
  if (!r.ok) {
    throw new Error('Could not load analysis history.');
  }
  return r.json();
}

export async function removeHistory(id: string): Promise<void> {
  const r = await fetch(`${base}/history/${id}`, { method: 'DELETE' });
  if (!r.ok) {
    throw new Error('Could not delete this analysis.');
  }
}

export async function clearAllHistory(): Promise<void> {
  const r = await fetch(`${base}/history`, { method: 'DELETE' });
  if (!r.ok) {
    throw new Error('Could not clear history.');
  }
}
