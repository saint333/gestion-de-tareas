import { Injectable } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
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
    localStorage.setItem('todos', JSON.stringify(this.todoList))
    this._todos.next(this.todoList)
  }

  addTodoEdited(todo: TodoModel){
    const indexTodo = this.todoList.findIndex((todoItem) => todoItem.id === todo.id);
    this.todoList.splice(indexTodo, 1, todo);
    localStorage.setItem('todos', JSON.stringify(this.todoList))
    this._todos.next(this.todoList)
  }

  deleteTodo(todoId: number){
    this.todoList  = this.todoList.filter(todo => todo.id !== todoId);
    localStorage.setItem('todos', JSON.stringify(this.todoList))
    this._todos.next(this.todoList)
  }

  todoListFiltered(filter: FilterType, priority: string, date: string) {
    const todos = this.todoList;

    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      case 'priority':
        return todos.sort((todoA, todoB) => {
          const prioridades = { baja: 3, media: 2, alta: 1 };
          return (
            prioridades[todoA.priority || 'baja'] -
            prioridades[todoB.priority || 'baja']
          );
        });
      case 'date':
        return todos.sort((todoA, todoB) => {
          return (
            new Date(todoA.dateExpired).getTime() -
            new Date(todoB.dateExpired).getTime()
          );
        });
      case priority:
        return todos.filter((todo) => todo.priority === priority);
      case date:
        return todos.filter((todo) => todo.dateExpired === date);
      default:
        return todos;
    }
  }

  changefilter(filter: FilterType, priority: string, date: string){
    this._todos.next(this.todoListFiltered(filter, priority, date))
  }
}
