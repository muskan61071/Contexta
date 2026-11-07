import type {Request,Response,NextFunction} from 'express';
import {generateRewrite} from '../services/rewriteService.js';
export async function rewrite(req:Request,res:Response,next:NextFunction){try{res.json(await generateRewrite(req.body))}catch(e){next(e)}}
