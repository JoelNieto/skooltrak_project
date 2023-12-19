import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeItemFormComponent } from './grade-item-form.component';

describe('GradeItemFormComponent', () => {
  let component: GradeItemFormComponent;
  let fixture: ComponentFixture<GradeItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeItemFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GradeItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
