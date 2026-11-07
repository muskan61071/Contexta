import {useEffect} from 'react';
export default function ToastNotification({message,onClose}:{message:string;onClose:()=>void}){useEffect(()=>{if(!message)return;const t=setTimeout(onClose,2600);return()=>clearTimeout(t)},[message,onClose]);return message?<div role="status" className="toast">{message}</div>:null}
