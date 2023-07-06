import { IconsModule } from '@amithvns/ng-heroicons';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  isDevMode,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';

import { AvatarComponent } from '../avatar/avatar.component';
import { UserChipComponent } from '../user-chip/user-chip.component';
import { UsersSelectorStore } from './users-selector.store';

@Component({
  standalone: true,
  selector: 'sk-users-selector',
  imports: [
    NgClass,
    IconsModule,
    FormsModule,
    NgFor,
    NgIf,
    PortalModule,
    AvatarComponent,
    UserChipComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UsersSelectorComponent),
      multi: true,
    },
    provideComponentStore(UsersSelectorStore),
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[attr.tabIndex]': 'disabled === true ? null : "0"',
  },
  template: `<div class="select-wrapper">
    <div
      #select
      (click)="showOptions()"
      role="listbox"
      class="bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white flex flex-wrap gap-2 overflow-y-auto max-h-20"
      [ngClass]="{
        'ring-1 ring-sky-600 border-sky-600 dark:ring-sky-500 dark:border-sky-500':
          isOpen()
      }"
      [class.text-gray-700]="currentValue()"
    >
      <sk-user-chip *ngFor="let user of store.users()" [user]="user" />
    </div>
    <ng-template cdk-portal>
      <div id="options-container" class="w-full">
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <icon
              name="magnifying-glass"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
            />
          </div>
          <input
            type="text"
            id="table-search"
            class="block p-2.5 pl-10 text-sm text-gray-900 border-0 focus:ring-0 rounded-tl-lg rounded-tr-lg w-full bg-gray-50 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Search for users"
            autocomplete="nope"
            name="search"
            [ngModel]="searchText()"
            (ngModelChange)="onFilterChange($event)"
            #searchInput
          />
        </div>
        <div
          class="bg-white w-full max-h-64 dark:bg-gray-700 dark:divide-gray-600 overflow-y-scroll"
        >
          <ul class="py-1" role="none">
            <li
              *ngFor="let user of store.users()"
              (click)="toggleValue(user.id!)"
            >
              <div
                class="flex px-4 py-2 gap-3 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
                [ngClass]="{ active: currentValue() === user.id }"
              >
                <div class="basis-1/10 block">
                  <sk-avatar
                    [rounded]="true"
                    class="w-9"
                    [avatarUrl]="user.avatar_url!"
                  />
                </div>
                <div class="flex flex-col">
                  <span
                    class="text-gray-700 dark:text-gray-100 text-sm font-title"
                    >{{ user.first_name }} {{ user.father_name }}</span
                  >
                  <span
                    class="text-xs text-gray-400 dark:text-gray-300 font-mono"
                    >{{ user.email }}</span
                  >
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </ng-template>
  </div>`,
})
export class UsersSelectorComponent implements ControlValueAccessor {
  currentValue = signal<string | string[] | null | undefined>(null);
  public overlay = inject(Overlay);
  public store = inject(UsersSelectorStore);
  private overlayRef!: OverlayRef;
  private cdr = inject(ChangeDetectorRef);

  innerContent: string;
  placeholder = 'Select value';
  @ViewChild(CdkPortal) public container!: CdkPortal;
  @ViewChild('select') public select!: ElementRef;
  @ViewChild('searchInput') public searchInput!: ElementRef;
  @HostListener('window:resize')
  public onWinResize(): void {
    this.syncWidth();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch: any = () => {};

  constructor() {
    this.innerContent = this.placeholder;
    effect(() => this.store.patchState({ queryText: this.searchText() }), {
      allowSignalWrites: true,
    });
  }

  onFilterChange = (value: string) => {
    this.searchText.set(value);
  };

  searchText = signal('');
  isOpen = signal(false);
  isDisabled!: boolean;
  writeValue(obj: string | string[] | null | undefined): void {
    this.currentValue.set(obj);
  }
  registerOnChange(fn: any): void {
    !!isDevMode && console.info(fn, 'on change');
  }
  registerOnTouched(fn: any): void {
    !!isDevMode && console.info(fn, 'on touch');
  }
  setDisabledState? = (isDisabled: boolean) => (this.isDisabled = isDisabled);

  private syncWidth = () => {
    if (!this.overlayRef) {
      return;
    }
    const refRectWidth =
      this.select.nativeElement.getBoundingClientRect().width;
    this.overlayRef.updateSize({ width: refRectWidth });
  };

  toggleValue = (val: string) => {
    this.currentValue() === val
      ? this.currentValue.set(undefined)
      : this.currentValue.set(val);
    this.onTouch();
    this.hide();
  };

  private hide = () => {
    this.overlayRef.detach();
    this.isOpen.set(false);
    this.searchText.set('');
  };

  private getOverlayConfig = (): OverlayConfig =>
    new OverlayConfig({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.select.nativeElement)
        .withPush(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 4,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -4,
          },
        ]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

  public showOptions = () => {
    if (this.isDisabled) return;
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    this.overlayRef.attach(this.container);
    this.syncWidth();
    this.overlayRef.backdropClick().subscribe({
      next: () => this.hide(),
      error: (error) => console.error(error),
    });

    this.cdr.detectChanges();
    this.searchInput.nativeElement.focus();
    this.isOpen.set(true);
  };
}
