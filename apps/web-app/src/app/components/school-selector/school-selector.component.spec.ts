import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSelectorComponent } from './school-selector.component';

describe('SchoolSelectorComponent', () => {
  let component: SchoolSelectorComponent;
  let fixture: ComponentFixture<SchoolSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
