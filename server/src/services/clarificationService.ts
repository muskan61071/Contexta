import type {AnalysisRequest} from '../schemas/analysisSchema.js';
import {callNlp} from './nlpClient.js';
export const generateClarifications=(input:AnalysisRequest)=>callNlp('/api/clarifications',input);
