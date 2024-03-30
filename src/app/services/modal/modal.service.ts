import { EventEmitter, Injectable } from '@angular/core';
import { TodoModel } from '../../models/todo';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  $modal = new EventEmitter<boolean>();
  $detailTodo = new EventEmitter<TodoModel>();
}
