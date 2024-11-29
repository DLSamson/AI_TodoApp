import { ReactNode } from 'react';

interface Props {
    children: ReactNode
}

export function AppWrapper({ children }: Props) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
            <div className="min-h-screen w-full backdrop-blur-sm bg-black/10 py-8 px-4">
                {children}
            </div>
        </div>
    )
}