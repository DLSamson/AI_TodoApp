import { PropsWithChildren } from "react";

export const Card = (props: PropsWithChildren) => (
    <div className="p-4 md:p-8 bg-slate-50 rounded-3xl shadow-xl border border-slate-50">
        {props.children}
    </div>
)