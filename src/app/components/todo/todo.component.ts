import { Component, OnInit, computed, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalAddTodoComponent } from '../modal-add-todo/modal-add-todo.component';
import { ModalService } from '../../services/modal/modal.service';
import { TodoService } from '../../services/todo/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalAddTodoComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  modalState: boolean = false;
  todoList = signal<TodoModel[]>([]);
  filter = signal<FilterType>('all');

  date = new FormControl('', { nonNullable: true });
  priority = new FormControl('', { nonNullable: true });

  todoListFiltered = computed(() => {
    const filter = this.filter();
    const todos = this.todoList();

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
      case this.priority.value:
        return todos.filter((todo) => todo.priority === this.priority.value);
      case this.date.value:
        return todos.filter((todo) => todo.dateExpired === this.date.value);
      default:
        return todos;
    }
  });

  constructor(private modal: ModalService, private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.getTodos.subscribe((todos) => {
      localStorage.setItem('todos', JSON.stringify(todos));
      this.todoList.update(() => todos);
    });
    this.modal.$modal.subscribe((value) => (this.modalState = value));
  }

  changeFilter(filterString: FilterType) {
    this.filter.set(filterString);
  }

  dateValidator(type: string) {
    if (type === 'date') {
      this.filter.set(this.date.value);
      this.priority.patchValue('');
    } else {
      this.filter.set(this.priority.value);
      this.date.patchValue('');
    }
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
