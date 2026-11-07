import type { ContextMessage } from '../types';
import { analyze } from './api';
export async function getSemanticRelationships(message:string,context:ContextMessage[]) { return (await analyze(message,context)).relationships; }
