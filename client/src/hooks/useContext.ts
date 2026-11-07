import {analyzeContext} from '../services/contextService';
import type {ContextMessage} from '../types';
export default function useContext(){return (message:string,context:ContextMessage[])=>analyzeContext(message,context)}
