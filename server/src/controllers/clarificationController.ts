import type {Request,Response,NextFunction} from 'express';
import {generateClarifications} from '../services/clarificationService.js';
export async function clarifications(req:Request,res:Response,next:NextFunction){try{res.json(await generateClarifications(req.body))}catch(e){next(e)}}
