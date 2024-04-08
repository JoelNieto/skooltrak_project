import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatQuillComponent } from './mat-quill.component';

describe('MatQuillComponent', () => {
  let component: MatQuillComponent;
  let fixture: ComponentFixture<MatQuillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatQuillComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MatQuillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
