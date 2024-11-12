import { FadeIn } from "@/components/animations/FadeIn";
import { Card } from "@/components/atoms/Card"
import { useStore } from "@/hooks/useStore"
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite"
import { FaCircle, FaCircleCheck, FaCircleXmark, FaRegCircle, FaRegCircleXmark, FaXmark } from "react-icons/fa6";

export const TodoList = observer(() => {
    const { todoStore } = useStore();

    return (
        <Card>
            <motion.div className="min-h-96 flex flex-col gap-4 rounded-3xl relative">

                {todoStore.items.length == 0 &&
                    <FadeIn key={1}>
                        <div className="w-full text-center text-2xl text-slate-500">
                            Пока что здесь пусто...
                        </div>
                    </FadeIn>
                }

                <AnimatePresence mode="popLayout">
                    {todoStore.items.filter(item => !item.isCompleted).map(((item, index) => (
                        <motion.div
                            layout
                            className="relative"
                            initial={{ opacity: 0, left: '-100px' }}
                            animate={{ opacity: 1, left: '0' }}
                            exit={{ opacity: 0, left: '-100px' }}
                            transition={{ duration: 0.3, type: 'spring' }}
                            key={item.id}
                        >
                            <div className="flex items-center gap-4 text-xl justify-between border border-slate-300 bg-slate-50 px-6 py-4 rounded-3xl">
                                <div className="flex justify-start gap-4 items-center">
                                    <div
                                        className="cursor-pointer hover:text-slate-700 duration-300"
                                        onClick={() => todoStore.updateTodo(item.id, { ...item, isCompleted: !item.isCompleted })}
                                    >
                                        <AnimatePresence mode="wait">
                                            {item.isCompleted
                                                ? <motion.div whileHover={{scale:1.05}} whileTap={{scale: 0.95}} key={'on'} initial={{ opacity: 0, rotate: '-90' }} animate={{ opacity: 1, rotate: '0' }} exit={{ opacity: 1, rotate: '90' }}>
                                                    <FaCircleCheck size={24} /></motion.div>
                                                : <motion.div whileHover={{scale:1.05}} whileTap={{scale: 0.95}} key={'off'} initial={{ opacity: 0, rotate: '-90' }} animate={{ opacity: 1, rotate: '0' }} exit={{ opacity: 1, rotate: '90' }}>
                                                    <FaRegCircle size={24} /></motion.div>
                                            }
                                        </AnimatePresence>
                                    </div>
                                    {index + 1}.
                                    {item.text}
                                </div>

                                <motion.button
                                    className="text-white rounded-full bg-red-500 duration-300 hover:bg-red-600 p-1"
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{duration: 0.1}}
                                    onClick={() => todoStore.removeTodo(item.id)}
                                >
                                    <FaXmark size={24} />
                                </motion.button>
                            </div>
                        </motion.div>
                    )))}
                </AnimatePresence>
            </motion.div>
        </Card>
    )
})