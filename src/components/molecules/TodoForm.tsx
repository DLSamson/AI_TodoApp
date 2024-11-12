import { useStore } from "@/hooks/useStore";
import { TodoItemForm } from "@/stores/TodoStore";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";

export const TodoForm = observer(() => {
    const { todoStore } = useStore();
    const { register, handleSubmit, reset } = useForm<TodoItemForm>();

    const onFormSubmit = (data: TodoItemForm) => {
        todoStore.addTodo(data);
        reset();
    }

    return (
        <div className="p-4 bg-slate-50 rounded-3xl shadow-xl border">
            <form className="flex gap-4" onSubmit={handleSubmit(onFormSubmit)}>
                <input
                    {...register('text', { required: 'Поле не должно быть пустым' })}
                    placeholder="Нужно сделать..."
                    type="text"
                    className="px-8 py-4 border-slate-200 bg-slate-100 hover:bg-slate-200 duration-300 border rounded-3xl placeholder:text-slate-400 flex-1 shadow-inner"
                />
                <motion.button
                    whileTap={{ scale: 0.95 }} 
                    className="px-8 py-4 bg-slate-200 rounded-3xl duration-300 hover:bg-slate-300 shadow-inner flex gap-2 items-center"
                >
                    <FaPlus />
                    Добавить задачу
                </motion.button>
            </form>
        </div>
    )
})