import { Component, OnInit, signal } from '@angular/core';
import { TodoModel } from '../../models/todo';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalAddTodoComponent } from '../modal-add-todo/modal-add-todo.component';
import { ModalService } from '../../services/modal/modal.service';
import { TodoService } from '../../services/todo/todo.service';
import { FiltersComponent } from '../filters/filters.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalAddTodoComponent, FiltersComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  modalState: boolean = false;
  todoList = signal<TodoModel[]>([]);

  constructor(private modal: ModalService, private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.getTodos.subscribe((todos) => {
      this.todoList.update(() => todos);
    });
    this.modal.$modal.subscribe((value) => (this.modalState = value));
  }

  addTodo() {
    this.modal.addNewTodo();
    this.modalState = true;
  }

  editingTodo(todo: TodoModel) {
    this.modal.edtingTodo(todo);
    this.modalState = true;
  }

  toggleTodo(todoId: number) {
    this.todoList.update((prev_todos) =>
      prev_todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  removeTodo(todoId: number) {
    this.todoService.deleteTodo(todoId);
  }
}
