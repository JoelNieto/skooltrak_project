import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolsAdminsComponent } from './schools-admins.component';

describe('SchoolsAdminsComponent', () => {
  let component: SchoolsAdminsComponent;
  let fixture: ComponentFixture<SchoolsAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolsAdminsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolsAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
