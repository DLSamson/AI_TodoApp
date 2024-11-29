import { FaTasks } from 'react-icons/fa';

export function Logo() {
    return (
        <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <FaTasks className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
                <p className="text-sm text-white/60">Stay organized, get more done</p>
            </div>
        </div>
    )
}