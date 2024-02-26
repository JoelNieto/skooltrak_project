import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignationFormComponent } from './assignation-form.component';

describe('AssignationFormComponent', () => {
  let component: AssignationFormComponent;
  let fixture: ComponentFixture<AssignationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignationFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
