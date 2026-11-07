import {getClarifications} from '../services/clarificationService';
import type {ContextMessage} from '../types';
export default function useClarification(){return (message:string,context:ContextMessage[])=>getClarifications(message,context)}
