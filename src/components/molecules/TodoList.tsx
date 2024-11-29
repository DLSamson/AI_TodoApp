import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/atoms/EmptyState"
import { Spinner } from "@/components/atoms/Spinner"
import { useStore } from "@/hooks/useStore"
import { observer } from "mobx-react-lite"
import { motion, AnimatePresence } from "framer-motion"
import { FaCalendarAlt, FaFlag, FaChevronRight, FaPlus } from "react-icons/fa"
import { FaCheck, FaTrash, FaPencilAlt } from "react-icons/fa"
import { useState, useMemo } from "react"

const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
}

const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2
}

export const TodoList = observer(() => {
    const { todoStore } = useStore()
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [newSubTodos, setNewSubTodos] = useState<Record<number, string>>({})

    const sortedTodos = useMemo(() => {
        return [...todoStore.items].sort((a, b) => {
            // First sort by completion status
            if (a.isCompleted !== b.isCompleted) {
                return a.isCompleted ? 1 : -1
            }
            
            // For uncompleted todos, sort by priority
            if (!a.isCompleted && !b.isCompleted) {
                const aPriority = a.priority || 'medium'
                const bPriority = b.priority || 'medium'
                return priorityOrder[aPriority] - priorityOrder[bPriority]
            }
            
            // For completed todos, sort by completion time (if available)
            if (a.completedAt && b.completedAt) {
                return b.completedAt - a.completedAt
            }
            
            return 0
        })
    }, [todoStore.items])

    const handleToggle = async (id: number) => {
        setLoadingId(String(id))
        try {
            const todo = todoStore.items.find(t => t.id === id)
            if (todo) {
                await todoStore.updateTodo(id, { isCompleted: !todo.isCompleted })
            }
        } finally {
            setLoadingId(null)
        }
    }

    const handleDelete = async (id: number) => {
        setLoadingId(String(id))
        try {
            await todoStore.removeTodo(id)
        } finally {
            setLoadingId(null)
        }
    }

    const handleToggleSubTodo = async (todoId: number, subTodoId: number) => {
        setLoadingId(`${todoId}-${subTodoId}`)
        try {
            const todo = todoStore.items.find(t => t.id === todoId)
            const subTodo = todo?.subTodos?.find(st => st.id === subTodoId)
            if (todo && subTodo) {
                await todoStore.updateSubTodo(todoId, subTodoId, {
                    isCompleted: !subTodo.isCompleted
                })
            }
        } finally {
            setLoadingId(null)
        }
    }

    const handleAddSubTodo = async (todoId: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return
        e.preventDefault()
        e.stopPropagation()

        const input = e.target as HTMLInputElement
        const text = input.value.trim()
        
        if (!text) return
        
        setLoadingId(`${todoId}-new`)
        try {
            await todoStore.addSubTodo(todoId, { text })
            setNewSubTodos(prev => ({ ...prev, [todoId]: '' }))
            // If this is the first subtodo, expand the todo
            if (!todoStore.items.find(t => t.id === todoId)?.subTodos?.length) {
                setExpandedId(todoId)
            }
        } finally {
            setLoadingId(null)
        }
    }

    const handleDeleteSubTodo = async (todoId: number, subTodoId: number) => {
        setLoadingId(`${todoId}-${subTodoId}`)
        try {
            await todoStore.removeSubTodo(todoId, subTodoId)
        } finally {
            setLoadingId(null)
        }
    }

    if (todoStore.items.length === 0) {
        return (
            <Card>
                <EmptyState 
                    title="No tasks yet"
                    description="Add your first task to get started!"
                />
            </Card>
        )
    }

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-3">
            <AnimatePresence mode="popLayout">
                {sortedTodos.map((todo) => (
                    <motion.div
                        key={todo.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card 
                            className={`relative overflow-hidden transition-all duration-300 ${
                                todoStore.selectedTodo?.id === todo.id 
                                    ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20' 
                                    : ''
                            }`}
                        >
                            {todoStore.selectedTodo?.id === todo.id && (
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
                            )}
                            
                            <div className="relative">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleToggle(todo.id)}
                                        disabled={loadingId === String(todo.id)}
                                        className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200
                                            ${todo.isCompleted 
                                                ? 'bg-green-500 border-green-500' 
                                                : 'border-white/30 hover:border-white/50'
                                            }
                                            ${loadingId === String(todo.id) ? 'opacity-50' : ''}
                                        `}
                                    >
                                        <AnimatePresence mode="wait">
                                            {loadingId === String(todo.id) ? (
                                                <motion.div
                                                    key="loading"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 flex items-center justify-center"
                                                >
                                                    <Spinner className="w-4 h-4" />
                                                </motion.div>
                                            ) : todo.isCompleted && (
                                                <motion.div
                                                    key="check"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                >
                                                    <FaCheck className="w-full h-full p-1 text-white" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                    
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span 
                                                className={`transition-all duration-200 ${
                                                    todo.isCompleted ? 'text-white/50 line-through' : 'text-white'
                                                }`}
                                            >
                                                {todo.text}
                                            </span>
                                            
                                            {todo.priority && (
                                                <div 
                                                    className={`w-2 h-2 rounded-full ${priorityColors[todo.priority]}`}
                                                    title={`Priority: ${todo.priority}`}
                                                />
                                            )}
                                        </div>

                                        {/* Quick add subtodo input */}
                                        <div className="flex items-center gap-3 text-sm pl-1">
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                {loadingId === `${todo.id}-new` ? (
                                                    <Spinner className="w-3 h-3" />
                                                ) : (
                                                    <FaPlus className="w-3 h-3 text-white/30" />
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Add subtask"
                                                value={newSubTodos[todo.id] || ''}
                                                onChange={(e) => setNewSubTodos(prev => ({ 
                                                    ...prev, 
                                                    [todo.id]: e.target.value 
                                                }))}
                                                onKeyDown={(e) => handleAddSubTodo(todo.id, e)}
                                                disabled={loadingId === `${todo.id}-new`}
                                                className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-white/60">
                                            {todo.dueDate && (
                                                <div className="flex items-center gap-1">
                                                    <FaCalendarAlt className="w-3 h-3" />
                                                    {formatDate(todo.dueDate)}
                                                </div>
                                            )}
                                            {todo.subTodos?.length > 0 && (
                                                <button
                                                    onClick={() => setExpandedId(expandedId === todo.id ? null : todo.id)}
                                                    className="flex items-center gap-1 hover:text-white/80 transition-colors"
                                                >
                                                    <motion.div
                                                        animate={{ rotate: expandedId === todo.id ? 90 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <FaChevronRight className="w-3 h-3" />
                                                    </motion.div>
                                                    {todo.subTodos.length} subtasks
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button 
                                            variant="secondary"
                                            onClick={() => todoStore.selectTodo(todo)}
                                            disabled={loadingId === String(todo.id)}
                                        >
                                            <FaPencilAlt className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="danger"
                                            onClick={() => handleDelete(todo.id)}
                                            disabled={loadingId === String(todo.id)}
                                        >
                                            {loadingId === String(todo.id) ? (
                                                <Spinner className="w-4 h-4" />
                                            ) : (
                                                <FaTrash className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedId === todo.id && todo.subTodos?.length > 0 && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 pl-10 space-y-2">
                                                {todo.subTodos.map((subtodo) => (
                                                    <div 
                                                        key={subtodo.id}
                                                        className="flex items-center gap-3 text-sm text-white/80 group"
                                                    >
                                                        <button
                                                            onClick={() => handleToggleSubTodo(todo.id, subtodo.id)}
                                                            disabled={loadingId === `${todo.id}-${subtodo.id}`}
                                                            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                                                                subtodo.isCompleted 
                                                                    ? 'bg-green-500 border-green-500' 
                                                                    : 'border-white/30 hover:border-white/50'
                                                            }`}
                                                        >
                                                            <AnimatePresence mode="wait">
                                                                {loadingId === `${todo.id}-${subtodo.id}` ? (
                                                                    <motion.div
                                                                        key="loading"
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        exit={{ opacity: 0 }}
                                                                        className="absolute inset-0 flex items-center justify-center"
                                                                    >
                                                                        <Spinner className="w-3 h-3" />
                                                                    </motion.div>
                                                                ) : subtodo.isCompleted && (
                                                                    <motion.div
                                                                        key="check"
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        exit={{ scale: 0 }}
                                                                    >
                                                                        <FaCheck className="w-full h-full p-0.5 text-white" />
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </button>
                                                        <span className={`flex-1 ${subtodo.isCompleted ? 'line-through text-white/50' : ''}`}>
                                                            {subtodo.text}
                                                        </span>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => todoStore.selectTodo(todo, subtodo.id)}
                                                                disabled={loadingId === `${todo.id}-${subtodo.id}`}
                                                                className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white/80 transition-colors"
                                                            >
                                                                <FaPencilAlt className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSubTodo(todo.id, subtodo.id)}
                                                                disabled={loadingId === `${todo.id}-${subtodo.id}`}
                                                                className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white/80 transition-colors"
                                                            >
                                                                <FaTrash className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
})