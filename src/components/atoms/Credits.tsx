import { FaGithub } from "react-icons/fa6"
import { motion } from "framer-motion"

export function Credits() {
    return (
        <motion.div 
            className="fixed bottom-4 right-4 flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors duration-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
        >
            <a 
                href="https://github.com/yourusername/todo-app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm"
            >
                <FaGithub className="w-4 h-4" />
                View on GitHub
            </a>
        </motion.div>
    )
}