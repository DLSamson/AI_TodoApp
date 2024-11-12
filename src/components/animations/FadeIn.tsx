import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

interface FadeInProps extends PropsWithChildren {
    delay?: number
    duration?: number
}

export const FadeIn = (props: FadeInProps) => (
    <motion.div
        className="relative"
        initial={{ opacity: 0, top: '10px' }}
        transition={{duration: props.duration ?? 0.3, type: "tween", delay: props.delay ?? 0}}
        animate={{opacity: 1, top: 0}}
        exit={{ opacity: 0, top: '10px' }}
    >
        {props.children}
    </motion.div>
)