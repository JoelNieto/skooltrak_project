import { IconsModule } from '@amithvns/ng-heroicons';
import {
  Overlay,
  OverlayConfig,
  OverlayModule,
  OverlayRef,
} from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { UtilService } from '../services/util.service';

@Component({
  selector: 'skooltrak-select',
  standalone: true,
  imports: [
    OverlayModule,
    PortalModule,
    NgFor,
    NgIf,
    IconsModule,
    FormsModule,
    NgClass,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
    UtilService,
  ],
  template: `
    <div class="select-wrapper">
      <div
        #select
        (click)="showOptions()"
        role="listbox"
        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        [innerHTML]="innerContent"
      ></div>
      <ng-template cdk-portal>
        <div class="options-container">
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
              class="block p-2.5 pl-10 text-sm text-gray-900 border-0 focus:ring-0 rounded-tl-lg rounded-tr-lg w-full bg-gray-50 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
              placeholder="Search for items"
              autocomplete="new-password"
              [ngModel]="searchText()"
              (ngModelChange)="onFilterChange($event)"
            />
          </div>
          <div
            class="p-4 flex items-center bg-white  dark:bg-gray-700"
            *ngIf="!filteredItems().length"
          >
            <p
              class="text-gray-700 dark:text-gray-100 font-semibold font-title "
            >
              Items not found!
            </p>
          </div>
          <div
            class="bg-white w-full max-h-64 dark:bg-gray-700 dark:divide-gray-600 overflow-y-scroll"
          >
            <ul class="py-1" role="none">
              <li
                *ngFor="let item of filteredItems()"
                (click)="toggleValue(item[valueId])"
              >
                <div
                  class="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                  [ngClass]="{ active: currentValue() === item[valueId] }"
                >
                  {{ item[label] }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .active {
        @apply text-blue-800 bg-blue-200 dark:bg-blue-700 font-medium;
      }
    `,
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input({ required: true }) set items(items: any[]) {
    this.itemList.set(items);
  }
  @Input({ required: true }) label!: string;
  @Input({}) valueId: string = 'id';
  @Input() search: boolean = true;
  @Input() multiple = false;
  @Input() placeholder: string = 'Select value';
  private overlayRef!: OverlayRef;
  @ViewChild(CdkPortal) public container!: CdkPortal;
  @ViewChild('select') public select!: ElementRef;
  public overlay = inject(Overlay);
  private util = inject(UtilService);
  private cdr = inject(ChangeDetectorRef);

  innerContent = this.placeholder;

  @HostListener('window:resize')
  public onWinResize(): void {
    this.syncWidth();
  }

  onChange = (value: any | any[]): void => {};
  onTouch: any = () => {};

  get value(): any | any[] {
    return this.currentValue();
  }

  constructor() {
    effect(() => {
      this.onChange(this.currentValue());
      this.onTouch(this.currentValue());
      const value = (this.innerContent = this.itemList().find(
        (x) => x[this.valueId] === this.currentValue()
      ));

      this.innerContent = value ? value[this.label] : this.placeholder;
    });
  }

  itemList = signal<any[]>([]);
  searchText = signal('');
  isOpen = false;
  currentValue = signal<any | any[]>(null);

  filteredItems = computed(
    () =>
      this.util.searchFilter(this.itemList(), [this.label], this.searchText()) //TODO - Add preselected option to search
  );

  writeValue(val: any): void {
    if (val) {
      this.currentValue.set(val);
      this.onChange(this.value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  onFilterChange(value: string) {
    this.searchText.set(value);
  }

  toggleValue = (val: any) => {
    if (!this.multiple) {
      //TODO - Add multiple option
      this.currentValue() === val
        ? this.currentValue.set(undefined)
        : this.currentValue.set(val);
      this.onChange(this.value);
      this.hide();
    }
    this.cdr.markForCheck();
  };

  public showOptions(): void {
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    this.overlayRef.attach(this.container);
    this.syncWidth();
    this.overlayRef.backdropClick().subscribe(() => this.hide());
    this.isOpen = true;
  }

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

  private syncWidth(): void {
    if (!this.overlayRef) {
      return;
    }
    const refRectWidth =
      this.select.nativeElement.getBoundingClientRect().width;
    this.overlayRef.updateSize({ width: refRectWidth });
  }

  private hide(): void {
    this.overlayRef.detach();
    this.isOpen = false;
    this.searchText.set('');
  }
}