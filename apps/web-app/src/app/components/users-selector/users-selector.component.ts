/* eslint-disable @typescript-eslint/no-explicit-any */
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
  isDevMode,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '@skooltrak/models';

import { AvatarComponent } from '../../../../../../apps/web-app/src/app/components/avatar/avatar.component';
import { UserChipComponent } from '../user-chip/user-chip.component';
import { UsersSelectorStore } from './users-selector.store';

/* eslint-disable @typescript-eslint/no-empty-function */
@Component({
  standalone: true,
  selector: 'sk-users-selector',
  imports: [
    NgClass,
    FormsModule,
    PortalModule,
    AvatarComponent,
    UserChipComponent,
    NgIconComponent,
    ReactiveFormsModule,
    TranslateModule,
  ],
  providers: [
    provideIcons({ heroMagnifyingGlass }),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UsersSelectorComponent),
      multi: true,
    },
    UsersSelectorStore,
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
      class="flex max-h-20 w-full flex-wrap p-1  gap-2 overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
      [ngClass]="{
        'border-sky-600 ring-1 ring-sky-600 dark:border-sky-500 dark:ring-sky-500':
          IS_OPEN()
      }"
    >
      @for (user of CURRENT_VALUE(); track user.id) {
        <sk-user-chip
          [user]="user"
          [removable]="!single"
          (remove)="removeValue(user)"
        />
      } @empty {
        <div class="p-1.5 text-gray-700 dark:text-gray-400">
          {{ 'USERS_SELECTOR.PLACEHOLDER' | translate }}
        </div>
      }
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
            [placeholder]="'USERS_SELECTOR.SEARCH' | translate"
            autocomplete="nope"
            name="search"
            [formControl]="searchText"
            #searchInput
          />
        </div>
        @if (!store.filteredUsers().length) {
          <div class="flex items-center bg-white p-4  dark:bg-gray-700">
            <p
              class="font-title font-semibold text-gray-700 dark:text-gray-100 "
            >
              {{ 'USERS_SELECTOR.NOT_FOUND' | translate }}
            </p>
          </div>
        }

        <div
          class="max-h-64 w-full overflow-y-scroll bg-white dark:divide-gray-600 dark:bg-gray-700"
        >
          <ul class="py-1" role="none">
            @for (user of store.filteredUsers(); track user.id) {
              <li (click)="toggleValue(user)">
                <div
                  class="flex cursor-pointer gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                >
                  <div class="basis-1/10 block">
                    <sk-avatar
                      [rounded]="true"
                      class="w-9"
                      [avatarUrl]="user.avatar_url ?? 'default_avatar.jpg'"
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
            }
          </ul>
        </div>
      </div>
    </ng-template>
  </div>`,
})
export class UsersSelectorComponent implements OnInit, ControlValueAccessor {
  @Input({ required: false, transform: booleanAttribute })
  public single: boolean = false;
  public CURRENT_VALUE = signal<Partial<User>[]>([]);
  public overlay = inject(Overlay);
  public store = inject(UsersSelectorStore);
  private overlayRef!: OverlayRef;
  private cdr = inject(ChangeDetectorRef);
  private destroy = inject(DestroyRef);

  public searchText = new FormControl('', { nonNullable: true });

  public placeholder = 'Select value';
  @ViewChild(CdkPortal) public container!: CdkPortal;
  @ViewChild('select') public select!: ElementRef;
  @ViewChild('searchInput') public searchInput!: ElementRef;
  @HostListener('window:resize')
  public onWinResize(): void {
    this.syncWidth();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange = (value: any | any[]): void => {};
  public onTouch: any = () => {};

  constructor() {
    effect(() => this.onChange(this.CURRENT_VALUE()), {
      allowSignalWrites: true,
    });
  }

  public ngOnInit(): void {
    this.searchText.valueChanges
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (queryText) => {
          patchState(this.store, { queryText });
        },
      });
  }

  public onFilterChange = (value: string): void => {
    this.SEARCH_TEXT.set(value);
  };

  public SEARCH_TEXT = signal('');
  public IS_OPEN = signal(false);
  public IS_DISABLED!: boolean;

  public writeValue(obj: Partial<User>[] | undefined): void {
    !!obj && this.CURRENT_VALUE.set(obj);
  }

  public registerOnChange = (fn: any): void => {
    this.onChange = fn;
    !!isDevMode && console.info(fn, 'on change');
  };

  public registerOnTouched = (fn: unknown): void => {
    !!isDevMode && console.info(fn, 'on touch');
  };

  public setDisabledState? = (IS_DISABLED: boolean): void => {
    this.IS_DISABLED = IS_DISABLED;
  };

  private syncWidth = (): void => {
    if (!this.overlayRef) {
      return;
    }
    const refRectWidth =
      this.select.nativeElement.getBoundingClientRect().width;
    this.overlayRef.updateSize({ width: refRectWidth });
  };

  public toggleValue = (val: Partial<User>): void => {
    if (this.single) {
      this.CURRENT_VALUE.set([val]);
      this.hide();
    } else {
      this.CURRENT_VALUE.update((value) => [...value, val]);
    }

    this.onTouch();
  };

  public removeValue = (val: Partial<User>): void => {
    this.CURRENT_VALUE.update((value) => value.filter((x) => x.id !== val.id));
  };

  private hide = (): void => {
    this.overlayRef.detach();
    this.IS_OPEN.set(false);
    this.SEARCH_TEXT.set('');
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

  public showOptions = (): void => {
    if (this.IS_DISABLED) return;
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    this.overlayRef.attach(this.container);
    this.syncWidth();
    this.overlayRef.backdropClick().subscribe({
      next: () => this.hide(),
      error: (error) => console.error(error),
    });

    this.cdr.detectChanges();
    this.searchInput.nativeElement.focus();
    this.IS_OPEN.set(true);
  };
}
