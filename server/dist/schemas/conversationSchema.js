import { z } from 'zod';
import { contextMessageSchema } from './analysisSchema.js';
export const conversationSchema = z.object({ messages: z.array(contextMessageSchema).max(100) });
