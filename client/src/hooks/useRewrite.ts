import {makeClearRewrite} from '../services/rewriteService';
import type {ContextMessage} from '../types';
export default function useRewrite(){return (message:string,context:ContextMessage[])=>makeClearRewrite(message,context)}
