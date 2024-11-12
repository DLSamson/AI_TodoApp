import { makeAutoObservable } from "mobx";
import { TodoStore } from "@/stores/TodoStore";
import { createContext, PropsWithChildren } from "react";

export class RootStore {
    constructor() {
        makeAutoObservable(this);

        this.todoStore = new TodoStore();
    }

    todoStore: TodoStore;
}

export const RootStoreContext = createContext<RootStore | null>(null);
export const RootStoreContextProvider = (props: PropsWithChildren) => (
    <RootStoreContext.Provider value={new RootStore()}>
        {props.children}
    </RootStoreContext.Provider>
)