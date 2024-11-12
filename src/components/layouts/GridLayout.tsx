import { PropsWithChildren } from "react";

export const GridLayout = (props: PropsWithChildren) => (
    <div className="grid gap-8 md:gap-16 grid-flow-row auto-cols-fr">
        {props.children}
    </div>
)