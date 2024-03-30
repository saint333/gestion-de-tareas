import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddTodoComponent } from './modal-add-todo.component';

describe('ModalAddTodoComponent', () => {
  let component: ModalAddTodoComponent;
  let fixture: ComponentFixture<ModalAddTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddTodoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAddTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
