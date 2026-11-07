import { analyze } from './api';
import type { ContextMessage, Analysis } from '../types';
export const analyzeMessage = (message: string, context: ContextMessage[]): Promise<Analysis> => analyze(message, context);
