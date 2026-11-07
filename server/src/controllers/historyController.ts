import type {Request,Response,NextFunction} from 'express';
import {clearHistory as clearHistoryService,deleteHistoryItem,getHistory} from '../services/historyService.js';
export async function listHistory(_req:Request,res:Response,next:NextFunction){try{res.json(await getHistory())}catch(e){next(e)}}
export async function deleteHistory(req:Request,res:Response,next:NextFunction){try{await deleteHistoryItem(req.params.id);res.status(204).end()}catch(e){next(e)}}
export async function clearHistory(_req:Request,res:Response,next:NextFunction){try{res.json(await clearHistoryService())}catch(e){next(e)}}
