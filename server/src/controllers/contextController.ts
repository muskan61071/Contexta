import type {Request,Response,NextFunction} from 'express';
import {analyzeContext} from '../services/contextService.js';
export async function contextAnalysis(req:Request,res:Response,next:NextFunction){try{res.json(await analyzeContext(req.body))}catch(e){next(e)}}
