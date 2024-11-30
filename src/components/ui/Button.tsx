import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: ReactNode;
    children?: ReactNode;
}

export const Button = ({ variant = 'primary', icon, children, className = '', ...props }: ButtonProps) => {
    const baseClasses = "px-4 py-2 flex gap-4 justify-center items-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50";
    const variantClasses = {
        primary: "bg-white/20 hover:bg-white/30 active:bg-white/40 text-white",
        secondary: "bg-black/10 hover:bg-black/20 active:bg-black/30 text-white",
        danger: "bg-red-500/80 hover:bg-red-500/90 active:bg-red-500 text-white",
    };

    return (
        <motion.button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.1 }}
            {...props}
        >
            {icon || children}
        </motion.button>
    );
};
