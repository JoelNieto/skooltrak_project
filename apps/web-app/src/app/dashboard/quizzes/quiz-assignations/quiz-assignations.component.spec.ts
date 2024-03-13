import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizAssignationsComponent } from './quiz-assignations.component';

describe('QuizAssignationsComponent', () => {
  let component: QuizAssignationsComponent;
  let fixture: ComponentFixture<QuizAssignationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizAssignationsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizAssignationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
