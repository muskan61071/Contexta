import { useState, useEffect, useCallback } from 'react';

export interface RealtimeStatus {
  status: 'connected' | 'syncing' | 'offline';
  latencyMs: number;
  lastChecked: Date;
  service: string;
  nlpEngineUrl: string;
  error?: string;
}

const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
const healthUrl = `${apiBase.replace(/\/api$/, '')}/api/health`;

export function useRealtimeStatus(isBusy: boolean = false): RealtimeStatus & { refresh: () => void } {
  const [status, setStatus] = useState<RealtimeStatus>({
    status: 'connected',
    latencyMs: 14,
    lastChecked: new Date(),
    service: 'contexta-api',
    nlpEngineUrl: 'http://localhost:8000'
  });

  const checkHealth = useCallback(async () => {
    const start = performance.now();
    try {
      const res = await fetch(healthUrl, {
        signal: AbortSignal.timeout(3000)
      });
      const end = performance.now();
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const nlpOnline = data.nlpStatus !== 'offline';
        setStatus({
          status: isBusy ? 'syncing' : nlpOnline ? 'connected' : 'offline',
          latencyMs: Math.round(end - start),
          lastChecked: new Date(),
          service: data.service || 'contexta-api',
          nlpEngineUrl: data.nlpEngine || 'http://localhost:8000',
          error: nlpOnline ? undefined : 'API is running, but the NLP service is offline.'
        });
      } else {
        setStatus((prev) => ({
          ...prev,
          status: 'offline',
          error: `HTTP ${res.status}`
        }));
      }
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        status: 'offline',
        error: err instanceof Error ? err.message : 'Connection failed'
      }));
    }
  }, [isBusy]);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { ...status, status: isBusy ? 'syncing' : status.status, refresh: checkHealth };
}
