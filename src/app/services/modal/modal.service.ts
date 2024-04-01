import { EventEmitter, Injectable } from '@angular/core';
import { TodoModel } from '../../models/todo';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private todo: TodoModel[] = [];
  private _todoAddAndEdited: BehaviorSubject<TodoModel[]>
  constructor() {
    this._todoAddAndEdited = new BehaviorSubject<TodoModel[]>([]);
  }

  get todoAddAndEdited(){
    return this._todoAddAndEdited.asObservable();
  }

  $modal = new EventEmitter<boolean>();

  addNewTodo(){
    this.todo = []
    this._todoAddAndEdited.next(this.todo)
  }

  edtingTodo(todoEdit: TodoModel) {
    this.todo = [todoEdit]
    this._todoAddAndEdited.next(this.todo)
  }
}
