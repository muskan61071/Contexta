import type {AnalysisRequest} from '../schemas/analysisSchema.js';
import {callNlp} from './nlpClient.js';
export const analyzeContext=(input:AnalysisRequest)=>callNlp('/api/context/analyze',input);
