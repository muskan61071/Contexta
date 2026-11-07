export function confidenceLabel(value:number):'High'|'Medium'|'Low' { return value>=75?'High':value>=45?'Medium':'Low'; }
