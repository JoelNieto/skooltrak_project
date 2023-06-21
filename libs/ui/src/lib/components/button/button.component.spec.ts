import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonDirective } from './button.component';

describe('ButtonDirective', () => {
  let component: ButtonDirective;
  let fixture: ComponentFixture<ButtonDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
