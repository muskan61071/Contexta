import type {AnalysisRequest} from '../schemas/analysisSchema.js';
import {callNlp} from './nlpClient.js';
export const runAnalysis=(input:AnalysisRequest)=>callNlp('/api/analyze',input);
