import type {AnalysisRequest} from '../schemas/analysisSchema.js';
import {callNlp} from './nlpClient.js';
export const generateRewrite=(input:AnalysisRequest)=>callNlp('/api/rewrite',input);
