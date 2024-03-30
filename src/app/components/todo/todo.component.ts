import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalAddTodoComponent } from '../modal-add-todo/modal-add-todo.component';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalAddTodoComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  modalState: boolean = false;
  todolist = signal<TodoModel[]>([]);
  filter = signal<FilterType>('all');
  todoEditing = signal<TodoModel | undefined>(undefined);

  date = new FormControl('', {
    nonNullable: true,
  });

  priority = new FormControl('', {
    nonNullable: true,
  });

  todoListFiltered = computed(() => {
    const filter = this.filter();
    const todos = this.todolist();

    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      case 'priority':
        return todos.sort((todoA, todoB) => {
          const prioridades = { baja: 3, media: 2, alta: 1 };

          // Obtener el valor de prioridad para cada objeto
          const prioridadA = prioridades[todoA.priority || 'baja'];
          const prioridadB = prioridades[todoB.priority || 'baja'];

          // Comparar los valores de prioridad
          return prioridadA - prioridadB;
        });
      case 'date':
        return todos.sort((todoA, todoB) => {
          const dateA = new Date(todoA.dateExpired);
          const dateB = new Date(todoB.dateExpired);
          return dateA.getTime() - dateB.getTime();
        });
      case this.priority.value:
        return todos.filter((todo) => todo.priority === this.priority.value);
      case this.date.value:
        return todos.filter((todo) => todo.dateExpired === this.date.value);
      default:
        return todos;
    }
  });

  todoEdited = computed(() => {
    return this.todoEditing();
  });

  constructor(private modal: ModalService) {
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todolist()));
    });
  }

  ngOnInit() {
    const storage = localStorage.getItem('todos');
    if (storage) {
      this.todolist.set(JSON.parse(storage));
    }

    this.modal.$modal.subscribe((value) => (this.modalState = value));
  }

  recieveTodo(todo: TodoModel) {
    const index = this.todolist().findIndex((list) => list.id === todo.id);
    this.todolist.update((prev_todos) => {
      if (index !== -1) {
        return [...prev_todos.filter((list) => list.id !== todo.id), todo];
      } else {
        return [...prev_todos, todo];
      }
    });
  }

  changeFilter(filterString: FilterType) {
    this.filter.set(filterString);
  }

  dateValidator(type: string) {
    if (type === 'date') {
      this.filter.set(this.date.value);
      this.priority.patchValue('');
    } else {
      console.log(this.priority.value);
      
      this.filter.set(this.priority.value);
      this.date.patchValue('');
    }
  }

  addTodo(text: string, todo?: TodoModel) {
    if (text === 'editing') {
      this.todoEditing.update((value) => (value = todo));
    } else {
      this.todoEditing.update((value) => (value = undefined));
    }

    this.modalState = true;
  }

  toggleTodo(todoId: number) {
    this.todolist.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo;
      })
    );
  }

  removeTodo(todoId: number) {
    this.todolist.update((prev_todos) =>
      prev_todos.filter((todo) => todo.id !== todoId)
    );
  }
}
