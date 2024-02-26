import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizzesFormComponent } from './quizzes-form.component';

describe('QuizzesFormComponent', () => {
  let component: QuizzesFormComponent;
  let fixture: ComponentFixture<QuizzesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizzesFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizzesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
