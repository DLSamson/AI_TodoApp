import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/atoms/Spinner"
import { useStore } from "@/hooks/useStore"
import { FormEvent, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaPlus, FaCalendarAlt, FaFlag } from "react-icons/fa"

export function TodoForm() {
    const [title, setTitle] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
    const [isLoading, setIsLoading] = useState(false)
    const { todoStore } = useStore()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!title.trim() || isLoading) return
        
        setIsLoading(true)
        try {
            await todoStore.addTodo({ 
                text: title,
                dueDate: dueDate ? new Date(dueDate).getTime() : null,
                priority
            })
            setTitle('')
            setDueDate('')
            setPriority('medium')
        } finally {
            setIsLoading(false)
        }
    }

    const priorityColors = {
        low: 'bg-green-500',
        medium: 'bg-yellow-500',
        high: 'bg-red-500'
    }

    return (
        <Card className="relative overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            
            <form onSubmit={handleSubmit} className="relative space-y-4">
                <div className="flex gap-4">
                    <Input
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLoading ? 'loading' : 'idle'}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button 
                                type="submit" 
                                disabled={isLoading || !title.trim()}
                                className="min-w-[120px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            >
                                {isLoading ? (
                                    <Spinner className="w-5 h-5" />
                                ) : (
                                    <>
                                        <FaPlus className="w-4 h-4 mr-2" />
                                        Add Task
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-white/60" />
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <FaFlag className="text-white/60" />
                        <div className="flex gap-1">
                            {(['low', 'medium', 'high'] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`w-6 h-6 rounded-full transition-all duration-200 ${
                                        priority === p 
                                            ? `${priorityColors[p]} scale-110 shadow-lg` 
                                            : 'bg-white/20 hover:bg-white/30'
                                    }`}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </Card>
    )
}