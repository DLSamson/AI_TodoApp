import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
    return (
        <div
            className={`bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
