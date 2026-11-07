import type {AnalysisRequest} from '../schemas/analysisSchema.js';
import {callNlp} from './nlpClient.js';
export const resolveReferences=(input:AnalysisRequest)=>callNlp('/api/references/resolve',input);
export const generateInterpretations=(input:AnalysisRequest)=>callNlp('/api/interpretations',input);
