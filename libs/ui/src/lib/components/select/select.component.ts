import {
  Overlay,
  OverlayConfig,
  OverlayModule,
  OverlayRef,
} from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { NgClass } from '@angular/common';
import {
  AfterContentChecked,
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
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { asapScheduler } from 'rxjs';

import { PropertyPipe } from '../../services/pipes';
import { UtilService } from '../../services/util.service';

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
@Component({
  selector: 'sk-select',
  standalone: true,
  imports: [
    OverlayModule,
    PortalModule,
    NgIconComponent,
    FormsModule,
    NgClass,
    PropertyPipe,
    TranslateModule,
  ],
  providers: [
    provideIcons({ heroMagnifyingGlass }),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="select-wrapper">
      <div
        #select
        (click)="showOptions()"
        role="listbox"
        class="block w-full whitespace-nowrap rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 sm:text-sm"
        [ngClass]="{
          'border-sky-600 ring-1 ring-sky-600 dark:border-sky-500 dark:ring-sky-500':
            IS_OPEN(),
          'cursor-not-allowed opacity-75': isDisabled
        }"
        [class.text-gray-800]="CURRENT_VALUE()"
        [class.dark:text-white]="CURRENT_VALUE()"
        [innerHTML]="RENDER()"
      ></div>
      <ng-template cdk-portal>
        <div id="options-container" class="w-full shadow-lg">
          @if (search) {
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
                [placeholder]="'SELECT.SEARCH' | translate"
                autocomplete="new-password"
                [ngModel]="SEARCH_TEXT()"
                (ngModelChange)="onFilterChange($event)"
              />
            </div>
          }
          @if (!FILTERED_ITEMS().length) {
            <div class="flex items-center bg-white p-4  dark:bg-gray-700">
              <p class="font-sans text-gray-700 dark:text-gray-100 ">
                {{ 'SELECT.NOT_FOUND' | translate }}
              </p>
            </div>
          }
          <div
            class="max-h-64 w-full overflow-y-scroll bg-white dark:divide-gray-600 dark:bg-gray-700"
          >
            <ul class="py-1" role="none">
              @for (item of FILTERED_ITEMS(); track item[valueId]) {
                <li (click)="toggleValue(item[valueId])">
                  <div
                    class="flex cursor-pointer justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    [ngClass]="{ active: CURRENT_VALUE() === item[valueId] }"
                  >
                    <div>{{ item | property: label }}</div>
                    @if (secondaryLabel) {
                      <div class="text-xs text-gray-500 dark:text-gray-200">
                        {{ item | property: secondaryLabel }}
                      </div>
                    }
                  </div>
                </li>
              }
            </ul>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        @apply rounded-lg focus:border-sky-600 focus:ring-sky-600 focus-visible:border-sky-600 focus-visible:ring-sky-600 dark:focus:border-sky-500 dark:focus:ring-sky-500 dark:focus-visible:border-sky-500 dark:focus-visible:ring-sky-500;
      }
      .active {
        @apply bg-blue-100 font-medium text-blue-800 dark:bg-blue-800;
      }
    `,
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[attr.tabIndex]': 'disabled === true ? null : "0"',
  },
})
export class SelectComponent
  implements ControlValueAccessor, AfterContentChecked
{
  @Input({ required: true }) set items(items: any[] | undefined) {
    this.ITEM_LIST.set(items ?? []);
  }
  @Input({ required: true }) label!: string;
  @Input({ required: false }) secondaryLabel!: string;
  @Input({}) valueId = 'id';
  @Input() search = true;
  @Input() multiple = false;
  @Input() placeholder = 'SELECT.SELECT_VALUE';

  @ViewChild(CdkPortal) public container!: CdkPortal;
  @ViewChild('select') public select!: ElementRef;

  private overlayRef!: OverlayRef;
  public overlay = inject(Overlay);
  private util = inject(UtilService);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);

  public INNER_CONTENT = computed(() =>
    this.ITEM_LIST().find((x) => x[this.valueId] === this.CURRENT_VALUE()),
  );

  public RENDER = computed(() =>
    this.INNER_CONTENT()
      ? this.secondaryLabel
        ? `${this.util.getProperty(
            this.INNER_CONTENT(),
            this.label,
          )} - ${this.util.getProperty(
            this.INNER_CONTENT(),
            this.secondaryLabel,
          )}`
        : this.INNER_CONTENT()[this.label]
      : this.translate.instant(this.placeholder),
  );

  public isDisabled!: boolean;

  @HostListener('window:resize')
  public onWinResize(): void {
    this.syncWidth();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: any | any[]): void => {};
  onTouch: any = () => {};

  constructor() {
    effect(() => this.onChange(this.CURRENT_VALUE()), {
      allowSignalWrites: true,
    });
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  ITEM_LIST = signal<any[]>([]);
  SEARCH_TEXT = signal('');
  IS_OPEN = signal(false);
  CURRENT_VALUE = signal<string | string[] | undefined>(undefined);

  FILTERED_ITEMS = computed(
    () =>
      this.util.searchFilter(
        this.ITEM_LIST(),
        [this.label],
        this.SEARCH_TEXT(),
      ), //TODO - Add preselected option to search
  );

  writeValue(val: string): void {
    if (val) {
      asapScheduler.schedule(() => this.CURRENT_VALUE.set(val));

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
    this.SEARCH_TEXT.set(value);
  }

  toggleValue = (val: any) => {
    if (!this.multiple) {
      //TODO - Add multiple option
      this.CURRENT_VALUE() === val
        ? this.CURRENT_VALUE.set(undefined)
        : this.CURRENT_VALUE.set(val);
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
    this.IS_OPEN.set(true);
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
    this.IS_OPEN.set(false);
    this.SEARCH_TEXT.set('');
  }
}
