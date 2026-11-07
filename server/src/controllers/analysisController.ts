import type {Request,Response,NextFunction} from 'express';
import {runAnalysis} from '../services/analysisService.js';
export async function analyzeMessage(req:Request,res:Response,next:NextFunction){try{res.json(await runAnalysis(req.body))}catch(e){next(e)}}
export async function previewMessage(req:Request,res:Response,next:NextFunction){try{const {callNlp}=await import('../services/nlpClient.js');res.json(await callNlp('/api/preview',req.body))}catch(e){next(e)}}
