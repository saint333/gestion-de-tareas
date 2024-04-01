import { Component } from '@angular/core';
import { FilterType } from '../../models/todo';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo/todo.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  filter: FilterType = 'all';
  date = new FormControl('', { nonNullable: true });
  priority = new FormControl('', { nonNullable: true });

  constructor(private todoService: TodoService) {}

  changeFilter(filterString: FilterType) {
    this.filter = filterString;
    if (filterString === 'changeDate') {
      this.filter = this.date.value;
      this.priority.patchValue('');
    } else if (filterString === 'changePriority') {
      this.filter = this.priority.value;
      this.date.patchValue('');
    }
    this.todoService.changefilter(
      this.filter,
      this.priority.value,
      this.date.value
    );
  }
}
