import {createStore} from './storeFactory';
import type {Analysis} from '../types';
export const analysisStore=createStore<Analysis|null>(null);
