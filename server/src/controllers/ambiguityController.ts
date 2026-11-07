import type {Request,Response,NextFunction} from 'express';
import {resolveReferences,generateInterpretations} from '../services/ambiguityService.js';
export async function references(req:Request,res:Response,next:NextFunction){try{res.json(await resolveReferences(req.body))}catch(e){next(e)}}
export async function interpretations(req:Request,res:Response,next:NextFunction){try{res.json(await generateInterpretations(req.body))}catch(e){next(e)}}
