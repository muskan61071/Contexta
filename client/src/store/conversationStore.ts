import {createStore} from './storeFactory';
import type {ContextMessage} from '../types';
export const conversationStore=createStore<ContextMessage[]>([],'contexta-conversation');
