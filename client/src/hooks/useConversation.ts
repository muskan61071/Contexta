import {useState} from 'react';
import type {ContextMessage} from '../types';
export function useConversation(initial:ContextMessage[]=[]){const [messages,setMessages]=useState(initial);return {messages,setMessages,add:(text:string,speaker='Context')=>setMessages(v=>[...v,{id:crypto.randomUUID(),speaker,text}]),remove:(id:string)=>setMessages(v=>v.filter(m=>m.id!==id)),clear:()=>setMessages([])}}
