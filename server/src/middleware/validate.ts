import type {Request,Response,NextFunction} from 'express';
import type {ZodType} from 'zod';
export function validateBody(schema:ZodType){return(req:Request,res:Response,next:NextFunction)=>{const parsed=schema.safeParse(req.body);if(!parsed.success){res.status(400).json({message:parsed.error.issues.map(x=>x.message).join(' ')});return}req.body=parsed.data;next()}}
