import { PropsWithChildren } from "react";

export const Container = (props: PropsWithChildren) => (
    <div className="max-w-screen-lg p-4 xl:p-0 mx-auto w-full">
        {props.children}
    </div>
)