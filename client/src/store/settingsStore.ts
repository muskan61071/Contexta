import {createStore} from './storeFactory';
export type Settings={livePreview:boolean;retainHistory:boolean};
export const settingsStore=createStore<Settings>({livePreview:true,retainHistory:true},'contexta-settings');
