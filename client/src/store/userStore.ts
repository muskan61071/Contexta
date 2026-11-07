import {createStore} from './storeFactory';
// No authentication is configured; this is a local workspace display label only.
export const userStore=createStore<{displayName:string}>({displayName:'Your workspace'},'contexta-profile');
