import { HTMLAttributes, ReactNode } from "react";

interface TextProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'title' | 'subtitle' | 'body';
}

export const Text = ({ children, variant = 'body', className = '', ...props }: TextProps) => {
    const variantClasses = {
        title: "text-2xl font-medium",
        subtitle: "text-xl font-medium",
        body: "text-base",
    };

    return (
        <div
            className={`${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
