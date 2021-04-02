import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExDatatableComponent } from './ex-datatable.component';

describe('ExDatatableComponent', () => {
  let component: ExDatatableComponent;
  let fixture: ComponentFixture<ExDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExDatatableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
