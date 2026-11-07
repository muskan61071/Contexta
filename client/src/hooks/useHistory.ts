import {useCallback,useEffect,useState} from 'react';
import {history,removeHistory} from '../services/api';
import type {Analysis} from '../types';
export function useHistory(){const [items,setItems]=useState<Analysis[]>([]),[error,setError]=useState('');const refresh=useCallback(()=>history().then(setItems).catch(e=>setError(e instanceof Error?e.message:'History unavailable.')),[]);useEffect(()=>{refresh()},[refresh]);const remove=async(id:string)=>{await removeHistory(id);await refresh()};return {items,error,refresh,remove}}
