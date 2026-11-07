import type {Request,Response,NextFunction} from 'express';
import {extractSemantics} from '../services/semanticService.js';
export async function semantics(req:Request,res:Response,next:NextFunction){try{res.json({relationships:await extractSemantics(req.body)})}catch(e){next(e)}}
