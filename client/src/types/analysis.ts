import type { Analysis } from '../types';
export type { Analysis };
export type AnalysisRequest = { message: string; context: Array<{ id?: string; speaker: string; text: string }> };
