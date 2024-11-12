import { FadeIn } from "@/components/animations/FadeIn"
import { AppWrapper } from "@/components/layouts/AppWrapper"
import { GridLayout } from "@/components/layouts/GridLayout"
import { Container } from "@/components/layouts/Container"
import { Credits } from "@/components/atoms/Credits"
import { Logo } from "@/components/atoms/Logo"
import { TodoList } from "@/components/molecules/TodoList"
import { TodoForm } from "@/components/molecules/TodoForm"
import { observer } from "mobx-react-lite"

const App = observer(function () {
    return (
        <AppWrapper>
            <Container>
                <GridLayout>
                    <Logo />

                    <div className="grid gap-4">
                        <FadeIn>
                            <TodoForm />
                        </FadeIn>

                        <FadeIn delay={0.5}>
                            <TodoList />
                        </FadeIn>
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