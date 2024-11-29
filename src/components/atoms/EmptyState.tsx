import { FaClipboardList } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface Props {
    title: string
    description?: string
}

export function EmptyState({ title, description }: Props) {
    return (
        <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
                <FaClipboardList className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
            {description && (
                <p className="text-white/60">{description}</p>
            )}
        </motion.div>
    )
}
