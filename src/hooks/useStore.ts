import { RootStoreContext } from "@/stores/RootStore"
import { useContext } from "react"

export const useStore = () => {
    const rootStore = useContext(RootStoreContext);
    if (!rootStore)
        throw new Error('RootStore is undefined. Did you wrap up the application in RootStoreContextProvider?')

    return rootStore;
}