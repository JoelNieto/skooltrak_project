import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolConnectorPage } from './school-connector.page';

describe('SchoolConnectorPage', () => {
  let component: SchoolConnectorPage;
  let fixture: ComponentFixture<SchoolConnectorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolConnectorPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolConnectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
