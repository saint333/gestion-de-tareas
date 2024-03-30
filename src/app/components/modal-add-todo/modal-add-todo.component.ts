import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  computed,
  signal,
} from '@angular/core';
import { TodoModel, TypePriority, TypePriorityRender, TypePriorityVisibled } from '../../models/todo';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-modal-add-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-add-todo.component.html',
  styleUrl: './modal-add-todo.component.css',
})
export class ModalAddTodoComponent implements OnInit {
  @Input() title: string = '';
  @Input() detail: TodoModel | undefined;
  @Output() onSave = new EventEmitter<TodoModel>();

  errorForm = false
  listLabel = signal<{ id: number; text: string }[]>([]);

  listLabels = computed(() => {
    const labels = this.listLabel();
    return labels;
  });

  formDetail = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
    completed: new FormControl(false, {
      nonNullable: true,
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ],
    }),
    expired: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl<TypePriority | string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    label: new FormControl('', {
      nonNullable: true,
    }),
  });

  constructor(private modal: ModalService) {}

  ngOnInit() {
    if (this.detail) {
      this.formDetail.patchValue({
        title: this.detail?.title,
        completed: this.detail?.completed,
        description: this.detail?.description,
        expired: this.detail?.dateExpired,
        priority: this.detail?.priority,
      });
      this.listLabel.update((list) => list.concat(this.detail?.labels || []));
    }
  }

  handleSpace() {
    const label = this.formDetail.value.label?.trim();
    const labels = this.listLabel();
    if (
      this.formDetail.value.label &&
      label != '' &&
      !labels.some((tag) => tag.text === label)
    ) {
      this.listLabel.update((list) =>
        list.concat([
          {
            id: Date.now(),
            text: label || '',
          },
        ])
      );
    }
    this.formDetail.patchValue({
      label: '',
    });
  }

  handleClickCancel() {
    this.formDetail.reset();
    this.listLabel.update((list) => []);
    this.modal.$modal.emit(false);
  }

  handleSave() {
    this.errorForm = false
    if (this.formDetail.valid && this.listLabel().length) {
      const form = this.formDetail.value;
      const detail: TodoModel = {
        id: this.detail?.id || Date.now(),
        completed: form.completed || false,
        title: form.title || '',
        dateExpired: form.expired || "",
        description: form.description,
        labels: this.listLabel(),
        priority: TypePriorityRender[form?.priority as TypePriority || "low"],
        editing: false,
      };
      this.onSave.emit(detail);
      this.handleClickCancel();
    }else{
      this.errorForm = true
    }
  }
}
