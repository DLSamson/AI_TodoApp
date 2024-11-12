import { subTodoItem } from './TodoStore';
import { makeAutoObservable } from "mobx";


export type TodoItem = {
    id: number,
    text: string,
    isCompleted: boolean,
    subTodos: subTodoItem[],
}
export type subTodoItem = Exclude<TodoItem, {subTodoItem: subTodoItem, id: number}>;


export type TodoItemForm = {
    text: string
}


export class TodoStore {
    constructor() {
        makeAutoObservable(this);

        this.items = JSON.parse(localStorage.getItem('todos') ?? '[]');
    }

    items: TodoItem[] = [];

    
    addTodo({ text }: TodoItemForm) {
        this.items.push({ id: Date.now(), text, isCompleted: false, subTodos: [] });
        this.storeTodos();
    }
    
    updateTodo(id: TodoItem['id'], item: TodoItem) {
        this.items = this.items.map(_item => _item.id == id ? item : _item);
        this.storeTodos();
    }

    removeTodo(id: TodoItem['id']) {
        this.items = this.items.filter(item => item.id !== id);
        // this.storeTodos();
    }

    storeTodos() {
        localStorage.setItem('todos', JSON.stringify(this.items));
    }
}