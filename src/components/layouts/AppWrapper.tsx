import { AnimatePresence } from "framer-motion";
import { PropsWithChildren } from "react";

export const AppWrapper = (props: PropsWithChildren) => (
    <div className="font-sans text-slate-900">
        <div className="min-h-screen min-w-screen grid justify-stretch items-start pt-72 pb-36 bg-blue-500/70">
            <AnimatePresence mode="sync">
                {props.children}
            </AnimatePresence>
        </div>
    </div>
)