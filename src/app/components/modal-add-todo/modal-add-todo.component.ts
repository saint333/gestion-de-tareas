import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import {
  TodoModel,
  TypePriorityRender,
  TypePriorityVisibled,
} from '../../models/todo';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService } from '../../services/modal/modal.service';
import { TodoService } from '../../services/todo/todo.service';

@Component({
  selector: 'app-modal-add-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-add-todo.component.html',
  styleUrls: ['./modal-add-todo.component.css', './modal.css', './modal-completed.css'],
})
export class ModalAddTodoComponent implements OnInit {
  todoEditing: TodoModel[] = [];
  errorForm = false;
  listLabel = signal<{ id: number; text: string }[]>([]);

  listLabels = computed(() => this.listLabel());

  formDetail = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)],
    }),
    completed: new FormControl(false),
    description: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ],
    }),
    expired: new FormControl('', {
      validators: [Validators.required],
    }),
    priority: new FormControl<TypePriorityVisibled | string>('', {
      validators: [Validators.required],
    }),
    label: new FormControl(''),
  });

  constructor(private modal: ModalService, private todoService: TodoService) {}

  ngOnInit() {
    this.modal.todoAddAndEdited.subscribe(([value]) => {
      if (value) {
        this.formDetail.patchValue({
          title: value.title,
          completed: value.completed,
          description: value.description,
          expired: value.dateExpired,
          priority: value.priority,
        });
        this.listLabel.update((list) => (list = value.labels));
      }
      return (this.todoEditing = value ? [value] : []);
    });
  }

  handleSpace() {
    const label = this.formDetail.value.label?.trim();
    if (label != '' && !this.listLabel().some((tag) => tag.text === label)) {
      this.listLabel.update((list) =>
        list.concat([{ id: Date.now(), text: label || '' }])
      );
    }
    this.formDetail.patchValue({ label: '' });
  }

  removeTag(id: number) {
    this.listLabel.update((list) => list.filter((tag) => tag.id !== id));
  }

  handleClickCancel() {
    this.formDetail.reset();
    this.listLabel.update((list) => []);
    this.modal.$modal.emit(false);
  }

  handleSave() {
    this.errorForm = false;
    if (this.formDetail.valid && this.listLabel().length) {
      const form = this.formDetail.value;
      const [todo] = this.todoEditing;
      const detail: TodoModel = {
        id: todo ? todo.id : Date.now(),
        completed: form.completed || false,
        title: form.title || '',
        dateExpired: form.expired || '',
        description: form.description || '',
        labels: this.listLabel(),
        priority:
          TypePriorityRender[
            (form.priority as TypePriorityVisibled) || 'baja'
          ]
      };
      if (todo) {
        this.todoService.addTodoEdited(detail);
      } else {
        this.todoService.addNewTodo(detail);
      }
      this.handleClickCancel();
    } else {
      this.errorForm = true;
    }
  }
}
