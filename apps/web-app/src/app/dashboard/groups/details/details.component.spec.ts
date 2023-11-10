import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsDetailsComponent } from './details.component';

describe('GroupsDetailsComponent', () => {
  let component: GroupsDetailsComponent;
  let fixture: ComponentFixture<GroupsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
