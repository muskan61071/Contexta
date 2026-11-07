import {z} from 'zod';
export const contextMessageSchema=z.object({id:z.string().optional(),speaker:z.string().trim().min(1).max(100).default('Context'),text:z.string().trim().min(1).max(5000)});
export const analysisRequestSchema=z.object({message:z.string().trim().min(1,'Enter a message to analyze.').max(5000),context:z.array(contextMessageSchema).max(100).default([])});
export type AnalysisRequest=z.infer<typeof analysisRequestSchema>;
