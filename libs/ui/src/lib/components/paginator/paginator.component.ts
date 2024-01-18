import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChevronLeft, heroChevronRight } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { range } from 'lodash';

import { InputDirective } from '../../directives/input/input.directive';

@Component({
  selector: 'sk-paginator',
  standalone: true,
  imports: [
    NgClass,
    NgIconComponent,
    TranslateModule,
    ReactiveFormsModule,
    InputDirective,
  ],
  providers: [provideIcons({ heroChevronLeft, heroChevronRight })],
  template: `<nav
    class="flex items-center justify-between pt-4"
    aria-label="Table navigation"
  >
    <div class="flex items-center gap-3 pb-2">
      <span
        class="text-sm font-normal text-gray-500 dark:text-gray-400"
        [innerHTML]="
          'PAGINATOR.SHOWING'
            | translate
              : {
                  start: startIndex() + 1,
                  end: endIndex() + 1,
                  count: count()
                }
        "
      >
      </span>
      <div class="w-16">
        <select [formControl]="pageSizeControl" skInput>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
    </div>

    <ul class="inline-flex items-center -space-x-px">
      <li>
        <a
          (click)="setPage(currentPage() - 1)"
          class="item block rounded-l-lg"
          [ngClass]="{ disabled: currentPage() === 1 }"
        >
          <ng-icon name="heroChevronLeft" size="14" />
        </a>
      </li>
      @for (page of pages(); track page) {
        <li>
          <a
            (click)="setPage(page)"
            class="item block"
            [ngClass]="{ active: currentPage() === page }"
            >{{ page }}</a
          >
        </li>
      }
      <li>
        <a
          (click)="setPage(totalPages())"
          class="item block"
          [ngClass]="{ active: currentPage() === totalPages() }"
          >{{ totalPages() }}</a
        >
      </li>
      <li>
        <a
          (click)="setPage(currentPage() + 1)"
          class="item block rounded-r-lg"
          [ngClass]="{ disabled: currentPage() === totalPages() }"
        >
          <ng-icon name="heroChevronRight" size="14" />
        </a>
      </li>
    </ul>
  </nav>`,
  styles: [
    `
      .item {
        @apply border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white;
      }
      .active {
        @apply block border border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white;
      }
      .disabled {
        @apply z-10 cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400;
      }
    `,
  ],
})
export class PaginatorComponent implements OnInit {
  @Output() paginate = new EventEmitter<{
    currentPage: number;
    start: number;
    pageSize: number;
  }>();
  public count = input<number>(0);
  public pageSize = signal<number>(5);

  totalPages = computed(() => Math.ceil(this.count() / this.pageSize()));

  pageSizeControl = new FormControl<null | number>(null, { nonNullable: true });
  currentPage = signal(1);

  startPage = computed(() => {
    if (this.totalPages() <= 5 || this.currentPage() <= 3) {
      return 1;
    }
    if (this.currentPage() + 2 >= this.totalPages()) {
      return this.totalPages() - 5;
    }
    return this.currentPage() - 2;
  });

  endPage = computed(() => {
    if (this.totalPages() <= 5 || this.currentPage() + 2 >= this.totalPages()) {
      return this.totalPages();
    }

    if (this.currentPage() <= 3) {
      return 6;
    }

    return this.currentPage() + 3;
  });

  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());
  endIndex = computed(() =>
    Math.min(this.startIndex() + (this.pageSize() - 1), this.count() - 1),
  );

  currentRange = computed(() => this.currentPage());

  pages = computed(() => range(this.startPage(), this.endPage())); //TODO - Fix three points page

  setPage = (page: number) => this.currentPage.set(page);

  constructor() {
    effect(
      () =>
        this.paginate.emit({
          currentPage: this.currentPage(),
          start: this.startIndex(),
          pageSize: this.pageSize(),
        }),
      { allowSignalWrites: true },
    );
  }
  ngOnInit(): void {
    this.pageSizeControl.valueChanges.subscribe({
      next: (val) => {
        !!val && this.pageSize.set(val);
      },
    });
    this.pageSizeControl.setValue(this.pageSize());
  }
}
