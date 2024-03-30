import { Injectable } from '@angular/core';
import { TodoModel } from '../../models/todo';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todoList: TodoModel[] = [];
  private _todos: BehaviorSubject<TodoModel[]>;

  constructor() {
    let listTodo = localStorage.getItem('todos')
    if (listTodo) {
      const parsedListTodo = JSON.parse(listTodo) as TodoModel[];
      this.todoList.push(...parsedListTodo);
    }
    this._todos = new BehaviorSubject<TodoModel[]>(this.todoList);
  }

  get getTodos(){
    return this._todos.asObservable();
  }

  addNewTodo(todo: TodoModel){
    this.todoList.push(todo);
    this._todos.next(this.todoList)
  }

  addTodoEdited(todo: TodoModel){
    const indexTodo = this.todoList.findIndex((todoItem) => todoItem.id === todo.id);
    this.todoList.splice(indexTodo, 1, todo);
    this._todos.next(this.todoList)
  }

  deleteTodo(todoId: number){
    this.todoList  = this.todoList.filter(todo => todo.id !== todoId);
    this._todos.next(this.todoList)
  }
}
