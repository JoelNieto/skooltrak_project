import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsItemComponent } from './tabs-item.component';

describe('TabsComponent', () => {
  let component: TabsItemComponent;
  let fixture: ComponentFixture<TabsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
