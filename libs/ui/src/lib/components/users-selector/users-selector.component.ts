/* eslint-disable @typescript-eslint/no-empty-function */
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
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { User } from '@skooltrak/models';

import { AvatarComponent } from '../avatar/avatar.component';
import { UserChipComponent } from '../user-chip/user-chip.component';
import { UsersSelectorStore } from './users-selector.store';

@Component({
  standalone: true,
  selector: 'sk-users-selector',
  imports: [
    NgClass,
    FormsModule,
    NgFor,
    NgIf,
    PortalModule,
    AvatarComponent,
    UserChipComponent,
    NgIconComponent,
  ],
  providers: [
    provideIcons({ heroMagnifyingGlass }),
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
      class="flex max-h-20 w-full flex-wrap gap-2 overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
      [ngClass]="{
        'border-sky-600 ring-1 ring-sky-600 dark:border-sky-500 dark:ring-sky-500':
          isOpen()
      }"
      [class.text-gray-700]="currentValue()"
    >
      <sk-user-chip
        *ngFor="let user of currentValue()"
        [user]="user"
        [removable]="true"
        (remove)="toggleValue(user)"
      />
      <div
        *ngIf="!currentValue().length"
        class="p-1 text-gray-700 dark:text-gray-400"
      >
        Pick some users
      </div>
    </div>
    <ng-template cdk-portal>
      <div id="options-container" class="w-full">
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <ng-icon
              name="heroMagnifyingGlass"
              class="text-gray-500 dark:text-gray-400"
            />
          </div>
          <input
            type="text"
            id="table-search"
            class="block w-full rounded-tl-lg rounded-tr-lg border-0 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:ring-0 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="Search for users"
            autocomplete="nope"
            name="search"
            [ngModel]="searchText()"
            (ngModelChange)="onFilterChange($event)"
            #searchInput
          />
        </div>
        <div
          class="flex items-center bg-white p-4  dark:bg-gray-700"
          *ngIf="!store.users().length"
        >
          <p class="font-title font-semibold text-gray-700 dark:text-gray-100 ">
            Users not found!
          </p>
        </div>
        <div
          class="max-h-64 w-full overflow-y-scroll bg-white dark:divide-gray-600 dark:bg-gray-700"
        >
          <ul class="py-1" role="none">
            <li *ngFor="let user of store.users()" (click)="toggleValue(user)">
              <div
                class="flex cursor-pointer gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
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
                    class="font-sans text-sm text-gray-700 dark:text-gray-100"
                    >{{ user.first_name }} {{ user.father_name }}</span
                  >
                  <span
                    class="font-mono text-xs text-gray-400 dark:text-gray-300"
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
  currentValue = signal<Partial<User>[]>([]);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: any | any[]): void => {};
  onTouch: any = () => {};

  constructor() {
    this.innerContent = this.placeholder;
    effect(() => this.store.patchState({ queryText: this.searchText() }), {
      allowSignalWrites: true,
    });

    effect(() => this.onChange(this.currentValue()));
  }

  onFilterChange = (value: string) => {
    this.searchText.set(value);
  };

  searchText = signal('');
  isOpen = signal(false);
  isDisabled!: boolean;

  writeValue(obj: Partial<User>[] | undefined): void {
    !!obj && this.currentValue.set(obj);
  }

  registerOnChange = (fn: any) => {
    this.onChange = fn;
    !!isDevMode && console.info(fn, 'on change');
  };

  registerOnTouched = (fn: unknown) => {
    !!isDevMode && console.info(fn, 'on touch');
  };

  setDisabledState? = (isDisabled: boolean) => {
    this.isDisabled = isDisabled;
  };

  private syncWidth = () => {
    if (!this.overlayRef) {
      return;
    }
    const refRectWidth =
      this.select.nativeElement.getBoundingClientRect().width;
    this.overlayRef.updateSize({ width: refRectWidth });
  };

  toggleValue = (val: Partial<User>) => {
    this.currentValue().find((x) => x.id === val.id)
      ? this.currentValue.update((value) =>
          value.filter((x) => x.id !== val.id)
        )
      : this.currentValue.update((value) => [...value, val]);
    this.onTouch();
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
