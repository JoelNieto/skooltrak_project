import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelDirective } from './label.directive';

describe('LabelDirective', () => {
  let component: LabelDirective;
  let fixture: ComponentFixture<LabelDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
