import {env} from '../config/environment.js';
export async function checkDatabaseService():Promise<boolean>{try{const r=await fetch(`${env.nlpUrl}/api/health`);return r.ok}catch{return false}}
