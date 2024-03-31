import { EventEmitter, Injectable } from '@angular/core';
import { TodoModel } from '../../models/todo';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private todo: TodoModel[] = [];
  private _todoEdited: BehaviorSubject<TodoModel[]>
  constructor() {
    this._todoEdited = new BehaviorSubject<TodoModel[]>([]);
  }

  get todoEdit(){
    return this._todoEdited.asObservable();
  }

  $modal = new EventEmitter<boolean>();

  addNewTodo(){
    this.todo = []
    this._todoEdited.next(this.todo)
  }

  edtingTodo(todoEdit: TodoModel) {
    this.todo = [todoEdit]
    this._todoEdited.next(this.todo)
  }
}
