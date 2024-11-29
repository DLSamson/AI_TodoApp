import { makeAutoObservable } from "mobx";

export type TodoItem = {
    id: number,
    text: string,
    isCompleted: boolean,
    completedAt: number | null,
    created_at: number,
    updated_at: number,
    subTodos: subTodoItem[],
}

export type subTodoItem = {
    id: number,
    text: string,
    isCompleted: boolean,
    created_at: number,
    updated_at: number,
};

export type TodoItemForm = {
    text: string
}

export class TodoStore {
    items: TodoItem[] = [];
    selectedTodo: TodoItem | null = null;
    selectedTodoPosition: { top: number } | null = null;
    editingText: string = "";

    constructor() {
        makeAutoObservable(this);
        this.items = JSON.parse(localStorage.getItem('todos') ?? '[]');
    }

    // Todo Actions
    addTodo({ text }: TodoItemForm) {
        this.items.push({
            id: Date.now(),
            text,
            isCompleted: false,
            completedAt: null,
            subTodos: [],
            created_at: Date.now(),
            updated_at: Date.now(),
        });
        this.sortTodos();
        this.storeTodos();
    }

    async updateTodo(id: TodoItem['id'], updates: Partial<TodoItem>) {
        const todo = this.items.find(t => t.id === id)
        if (todo) {
            // If completing the todo, add completion time
            if (updates.isCompleted && !todo.isCompleted) {
                updates.completedAt = Date.now()
            } else if (updates.isCompleted === false) {
                updates.completedAt = null
            }
            
            Object.assign(todo, updates)
            this.items = this.items.map(_item => 
                _item.id !== id 
                    ? _item 
                    : { ..._item, ...updates, updated_at: Date.now() }
            );
            this.sortTodos();
            this.storeTodos();

            // Update selected todo if it's being edited
            if (this.selectedTodo?.id === id) {
                this.selectedTodo = this.items.find(item => item.id === id) ?? null;
                this.editingText = this.selectedTodo?.text ?? "";
            }
        }
    }

    removeTodo(id: TodoItem['id']) {
        this.items = this.items.filter(item => item.id !== id);
        if (this.selectedTodo?.id === id) {
            this.selectedTodo = null;
        }
        this.sortTodos();
        this.storeTodos();
    }

    // Subtodo Actions
    addSubTodo(todoId: TodoItem['id'], { text }: TodoItemForm) {
        const todo = this.items.find(item => item.id === todoId);
        if (!todo) return;

        const newSubTodo: subTodoItem = {
            id: Date.now(),
            text,
            isCompleted: false,
            created_at: Date.now(),
            updated_at: Date.now(),
        };

        todo.subTodos.push(newSubTodo);
        todo.updated_at = Date.now();
        
        this.sortTodos();
        this.storeTodos();
        
        // Update selected todo if it's being edited
        if (this.selectedTodo?.id === todoId) {
            this.selectedTodo = todo;
        }
    }

    updateSubTodo(todoId: TodoItem['id'], subTodoId: number, updates: Partial<subTodoItem>) {
        const todo = this.items.find(item => item.id === todoId);
        if (!todo) return;

        todo.subTodos = todo.subTodos.map(subTodo => 
            subTodo.id !== subTodoId 
                ? subTodo 
                : { ...subTodo, ...updates, updated_at: Date.now() }
        );
        todo.updated_at = Date.now();

        this.sortTodos();
        this.storeTodos();

        // Update selected todo if it's being edited
        if (this.selectedTodo?.id === todoId) {
            this.selectedTodo = todo;
        }
    }

    removeSubTodo(todoId: TodoItem['id'], subTodoId: number) {
        const todo = this.items.find(item => item.id === todoId);
        if (!todo) return;

        todo.subTodos = todo.subTodos.filter(subTodo => subTodo.id !== subTodoId);
        todo.updated_at = Date.now();

        this.sortTodos();
        this.storeTodos();

        // Update selected todo if it's being edited
        if (this.selectedTodo?.id === todoId) {
            this.selectedTodo = todo;
        }
    }

    // UI Actions
    selectTodo(todo: TodoItem | null) {
        this.selectedTodo = todo;
        this.editingText = todo?.text ?? "";
    }

    setEditingText(text: string) {
        this.editingText = text;
        if (this.selectedTodo) {
            this.updateTodo(this.selectedTodo.id, { text });
        }
    }

    setSelectedTodoPosition(position: { top: number } | null) {
        this.selectedTodoPosition = position;
    }

    // Helper Methods
    private sortTodos() {
        this.items = this.items.sort((a, b) => a.updated_at - b.updated_at);
    }

    private storeTodos() {
        localStorage.setItem('todos', JSON.stringify(this.items));
    }

    // Computed Properties
    get activeTodos() {
        return this.items.filter(item => !item.isCompleted);
    }

    get completedTodos() {
        return this.items.filter(item => item.isCompleted);
    }
}