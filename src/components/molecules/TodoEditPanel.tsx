import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/atoms/Spinner"
import { useStore } from "@/hooks/useStore"
import { observer } from "mobx-react-lite"
import { motion, AnimatePresence } from "framer-motion"
import { FaCalendarAlt, FaFlag, FaPlus, FaSave, FaTimes, FaCheck } from "react-icons/fa"
import { FormEvent, useState } from "react"

const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
}

export const TodoEditPanel = observer(() => {
    const { todoStore } = useStore()
    const [isLoading, setIsLoading] = useState(false)
    const [text, setText] = useState(todoStore.selectedTodo?.text || '')
    const [dueDate, setDueDate] = useState(todoStore.selectedTodo?.dueDate ? new Date(todoStore.selectedTodo.dueDate).toISOString().split('T')[0] : '')
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(todoStore.selectedTodo?.priority || 'medium')
    const [newSubTodo, setNewSubTodo] = useState('')

    if (!todoStore.selectedTodo) return null

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!text.trim() || isLoading) return

        setIsLoading(true)
        try {
            await todoStore.updateTodo(todoStore.selectedTodo.id, {
                text,
                dueDate: dueDate ? new Date(dueDate).getTime() : null,
                priority
            })
            todoStore.selectTodo(null)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddSubTodo = async () => {
        if (!newSubTodo.trim() || isLoading) return

        setIsLoading(true)
        try {
            await todoStore.addSubTodo(todoStore.selectedTodo.id, newSubTodo)
            setNewSubTodo('')
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleSubTodo = async (subTodoId: number) => {
        if (isLoading) return

        setIsLoading(true)
        try {
            const subTodo = todoStore.selectedTodo.subTodos?.find(st => st.id === subTodoId)
            if (subTodo) {
                await todoStore.updateSubTodo(todoStore.selectedTodo.id, subTodoId, {
                    isCompleted: !subTodo.isCompleted
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-x-0 top-1/4 mx-auto max-w-lg z-50"
            >
                <Card className="relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    
                    <div className="relative space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Edit Task</h2>
                            <Button
                                variant="secondary"
                                onClick={() => todoStore.selectTodo(null)}
                            >
                                <FaTimes className="w-4 h-4" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                placeholder="Task description"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                disabled={isLoading}
                            />

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-white/60 mb-1">Due Date</label>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Priority</label>
                                    <div className="flex gap-1">
                                        {(['low', 'medium', 'high'] as const).map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPriority(p)}
                                                className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                                                    priority === p 
                                                        ? `${priorityColors[p]} scale-110 shadow-lg` 
                                                        : 'bg-white/20 hover:bg-white/30'
                                                }`}
                                                disabled={isLoading}
                                            >
                                                <FaFlag className={`w-4 h-4 mx-auto ${priority === p ? 'text-white' : 'text-white/60'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-white/60 mb-1">Subtasks</label>
                                <div className="space-y-2">
                                    {todoStore.selectedTodo.subTodos?.map((subTodo) => (
                                        <div 
                                            key={subTodo.id}
                                            className="flex items-center gap-3"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleToggleSubTodo(subTodo.id)}
                                                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                                                    subTodo.isCompleted 
                                                        ? 'bg-green-500 border-green-500' 
                                                        : 'border-white/30 hover:border-white/50'
                                                }`}
                                                disabled={isLoading}
                                            >
                                                {subTodo.isCompleted && (
                                                    <FaCheck className="w-full h-full p-0.5 text-white" />
                                                )}
                                            </button>
                                            <span className={subTodo.isCompleted ? 'line-through text-white/50' : ''}>
                                                {subTodo.text}
                                            </span>
                                        </div>
                                    ))}
                                    
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add subtask"
                                            value={newSubTodo}
                                            onChange={(e) => setNewSubTodo(e.target.value)}
                                            disabled={isLoading}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddSubTodo}
                                            disabled={isLoading || !newSubTodo.trim()}
                                        >
                                            <FaPlus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="submit"
                                    disabled={isLoading || !text.trim()}
                                    className="min-w-[100px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                >
                                    {isLoading ? (
                                        <Spinner className="w-5 h-5" />
                                    ) : (
                                        <>
                                            <FaSave className="w-4 h-4 mr-2" />
                                            Save
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    )
})
