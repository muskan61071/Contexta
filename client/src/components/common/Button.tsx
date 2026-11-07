import type { ButtonHTMLAttributes, ReactNode } from 'react';
export default function Button({children, ...props}:{children:ReactNode}&ButtonHTMLAttributes<HTMLButtonElement>){return <button {...props} className={`button ${props.className||''}`}>{children}</button>}
