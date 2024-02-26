import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizResponseFormComponent } from './quiz-response-form.component';

describe('QuizResponseFormComponent', () => {
  let component: QuizResponseFormComponent;
  let fixture: ComponentFixture<QuizResponseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizResponseFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizResponseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
