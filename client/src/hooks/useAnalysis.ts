import {useState} from 'react';
import {analyze} from '../services/api';
import type {Analysis,ContextMessage} from '../types';
export function useAnalysis(){const [result,setResult]=useState<Analysis|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState('');async function run(message:string,context:ContextMessage[]){setLoading(true);setError('');try{const value=await analyze(message,context);setResult(value);return value}catch(e){const msg=e instanceof Error?e.message:'';setError(msg.toLowerCase().includes('failed to fetch')?'Cannot reach backend server. Please verify port 5000 and 8000 are running.':(msg||'Analysis failed.'));return null}finally{setLoading(false)}}return {result,loading,error,run,setResult}}
