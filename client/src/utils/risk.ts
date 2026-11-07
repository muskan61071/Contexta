export function riskClass(value:string):string { return value.toLowerCase()==='high'?'high':value.toLowerCase()==='medium'?'medium':'low'; }
