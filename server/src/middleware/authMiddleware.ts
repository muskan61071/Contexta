import type {Request,Response,NextFunction} from 'express';
// Single-user local prototype: routes are intentionally local-only. Add real session auth before network deployment.
export function localOnly(_req:Request,_res:Response,next:NextFunction){next()}
