import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

export function Input({ label, className = '', ...props }: Props) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-white/80">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                    placeholder:text-white/50 text-white
                    focus:outline-none focus:ring-2 focus:ring-white/30
                    transition-all duration-200 ${className}`}
                {...props}
            />
        </div>
    )
}
