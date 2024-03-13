import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileGradesComponent } from './profile-grades.component';

describe('ProfileGradesComponent', () => {
  let component: ProfileGradesComponent;
  let fixture: ComponentFixture<ProfileGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileGradesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
