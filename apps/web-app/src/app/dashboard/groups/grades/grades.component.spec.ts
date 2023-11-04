import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsGradesComponent } from './grades.component';

describe('GroupsGradesComponent', () => {
  let component: GroupsGradesComponent;
  let fixture: ComponentFixture<GroupsGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsGradesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
