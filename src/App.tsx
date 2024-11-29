import { FadeIn } from "@/components/animations/FadeIn"
import { AppWrapper } from "@/components/layouts/AppWrapper"
import { GridLayout } from "@/components/layouts/GridLayout"
import { Container } from "@/components/layouts/Container"
import { Credits } from "@/components/atoms/Credits"
import { Logo } from "@/components/atoms/Logo"
import { TodoList } from "@/components/molecules/TodoList"
import { TodoForm } from "@/components/molecules/TodoForm"
import { TodoEditPanel } from "@/components/molecules/TodoEditPanel"
import { observer } from "mobx-react-lite"
import { useStore } from "./hooks/useStore"

const App = observer(function () {
    const { todoStore } = useStore();

    return (
        <AppWrapper>
            <Container>
                <GridLayout>
                    <Logo />

                    <div className="w-full relative grid gap-4">
                        <FadeIn>
                            <TodoForm />
                        </FadeIn>

                        <FadeIn delay={0.5}>
                            <TodoList />
                        </FadeIn>

                        {todoStore.selectedTodo && (
                            <FadeIn delay={0.3}>
                                <TodoEditPanel />
                            </FadeIn>
                        )}
                    </div>

                    <FadeIn delay={1}>
                        <Credits />
                    </FadeIn>
                </GridLayout>
            </Container>
        </AppWrapper>
    )
});

export default App