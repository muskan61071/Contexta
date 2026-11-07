import type {AnalysisRequest} from '../schemas/analysisSchema.js';
import {callNlp} from './nlpClient.js';
export async function extractSemantics(input:AnalysisRequest){const result=await callNlp<{relationships:unknown[]}>('/api/semantic',input);return result.relationships}
