import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsLoadingComponent } from './chats-loading.component';

describe('ChatsLoadingComponent', () => {
  let component: ChatsLoadingComponent;
  let fixture: ComponentFixture<ChatsLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatsLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
