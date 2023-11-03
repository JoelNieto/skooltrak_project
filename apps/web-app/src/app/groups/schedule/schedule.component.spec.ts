import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsScheduleComponent } from './schedule.component';

describe('GroupsScheduleComponent', () => {
  let component: GroupsScheduleComponent;
  let fixture: ComponentFixture<GroupsScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsScheduleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
