import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMeetingComponent } from './course-meeting.component';

describe('CourseMeetingComponent', () => {
  let component: CourseMeetingComponent;
  let fixture: ComponentFixture<CourseMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseMeetingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
