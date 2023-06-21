/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  AfterContentChecked,
  ChangeDetectionStrategy,
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

import { PropertyPipe } from '../../pipes';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'sk-select',
  standalone: true,
  imports: [
    OverlayModule,
    PortalModule,
    NgFor,
    NgIf,
    IconsModule,
    FormsModule,
    NgClass,
    PropertyPipe,
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
        class="bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        [ngClass]="{
          'ring-1 ring-sky-600 border-sky-600 dark:ring-sky-500 dark:border-sky-500':
            isOpen()
        }"
        [class.text-gray-700]="currentValue()"
        [innerHTML]="innerContent"
      ></div>
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
                  class="flex justify-between px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                  [ngClass]="{ active: currentValue() === item[valueId] }"
                >
                  <div>{{ item[label] }}</div>
                  <div
                    class="text-xs text-gray-500 dark:text-gray-200"
                    *ngIf="secondaryLabel"
                  >
                    {{ item | property : secondaryLabel }}
                  </div>
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
      :host {
        @apply rounded-lg focus:ring-sky-600 focus:border-sky-600 focus-visible:ring-sky-600 focus-visible:border-sky-600 dark:focus:ring-sky-500 dark:focus:border-sky-500 dark:focus-visible:ring-sky-500 dark:focus-visible:border-sky-500;
      }
      .active {
        @apply text-blue-800 bg-blue-100 dark:bg-blue-700 font-medium;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[attr.tabIndex]': 'disabled === true ? null : "0"',
  },
})
export class SelectComponent
  implements ControlValueAccessor, AfterContentChecked
{
  @Input({ required: true }) set items(items: any[] | undefined) {
    this.itemList.set(items ?? []);
  }
  @Input({ required: true }) label!: string;
  @Input({ required: false }) secondaryLabel!: string;
  @Input({}) valueId = 'id';
  @Input() search = true;
  @Input() multiple = false;
  @Input() placeholder = 'Select value';
  private overlayRef!: OverlayRef;
  @ViewChild(CdkPortal) public container!: CdkPortal;
  @ViewChild('select') public select!: ElementRef;
  public overlay = inject(Overlay);
  private util = inject(UtilService);
  private cdr = inject(ChangeDetectorRef);

  innerContent: string;
  isDisabled!: boolean;

  @HostListener('window:resize')
  public onWinResize(): void {
    this.syncWidth();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: any | any[]): void => {};
  onTouch: any = () => {};

  constructor() {
    this.innerContent = this.placeholder;
    effect(() => {
      this.onChange(this.currentValue());
      const value = (this.innerContent = this.itemList().find(
        (x) => x[this.valueId] === this.currentValue()
      ));

      this.innerContent = value
        ? this.secondaryLabel
          ? `${value[this.label]} - ${this.util.getProperty(
              value,
              this.secondaryLabel
            )}`
          : value[this.label]
        : this.placeholder;
    });
  }
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  itemList = signal<any[]>([]);
  searchText = signal('');
  isOpen = signal(false);
  currentValue = signal<any | any[]>(null);

  filteredItems = computed(
    () =>
      this.util.searchFilter(this.itemList(), [this.label], this.searchText()) //TODO - Add preselected option to search
  );

  writeValue(val: any): void {
    if (val) {
      this.currentValue.set(val);
      this.onChange(val);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onFilterChange(value: string) {
    this.searchText.set(value);
  }

  toggleValue = (val: any) => {
    if (!this.multiple) {
      //TODO - Add multiple option
      this.currentValue() === val
        ? this.currentValue.set(undefined)
        : this.currentValue.set(val);
      this.onTouch();
      this.hide();
    }
  };

  public showOptions(): void {
    if (this.isDisabled) return;
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    this.overlayRef.attach(this.container);
    this.syncWidth();
    this.overlayRef.backdropClick().subscribe({
      next: () => this.hide(),
      error: (error) => console.error(error),
    });
    this.isOpen.set(true);
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
    this.isOpen.set(false);
    this.searchText.set('');
  }
}
