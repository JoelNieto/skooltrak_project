import { NgClass, NgFor } from '@angular/common';
import { Component, computed, effect, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
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
    NgFor,
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
                  start: START_INDEX() + 1,
                  end: END_INDEX() + 1,
                  count: ITEMS_COUNT()
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
          (click)="setPage(CURRENT_PAGE() - 1)"
          class="item block rounded-l-lg"
          [ngClass]="{ disabled: CURRENT_PAGE() === 1 }"
        >
          <ng-icon name="heroChevronLeft" size="14" />
        </a>
      </li>
      <li *ngFor="let page of pages()">
        <a
          (click)="setPage(page)"
          class="item block"
          [ngClass]="{ active: CURRENT_PAGE() === page }"
          >{{ page }}</a
        >
      </li>
      <li>
        <a
          (click)="setPage(TOTAL_PAGES())"
          class="item block"
          [ngClass]="{ active: CURRENT_PAGE() === TOTAL_PAGES() }"
          >{{ TOTAL_PAGES() }}</a
        >
      </li>
      <li>
        <a
          (click)="setPage(CURRENT_PAGE() + 1)"
          class="item block rounded-r-lg"
          [ngClass]="{ disabled: CURRENT_PAGE() === TOTAL_PAGES() }"
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
        @apply block border border-emerald-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white;
      }
      .disabled {
        @apply z-10 cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400;
      }
    `,
  ],
})
export class PaginatorComponent implements OnInit {
  @Input() set count(count: number) {
    this.ITEMS_COUNT.set(count);
  }
  @Input({ required: true }) set pageSize(pageSize: number) {
    this.PAGE_SIZE.set(pageSize);
  }
  @Output() paginate = new EventEmitter<{
    currentPage: number;
    start: number;
    pageSize: number;
  }>();
  ITEMS_COUNT = signal<number>(0);
  PAGE_SIZE = signal<number>(5);
  TOTAL_PAGES = computed(() =>
    Math.ceil(this.ITEMS_COUNT() / this.PAGE_SIZE())
  );

  pageSizeControl = new FormControl<null | number>(null, { nonNullable: true });
  CURRENT_PAGE = signal(1);

  START_PAGE = computed(() => {
    if (this.TOTAL_PAGES() <= 5 || this.CURRENT_PAGE() <= 3) {
      return 1;
    }
    if (this.CURRENT_PAGE() + 2 >= this.TOTAL_PAGES()) {
      return this.TOTAL_PAGES() - 5;
    }
    return this.CURRENT_PAGE() - 2;
  });

  END_PAGE = computed(() => {
    if (
      this.TOTAL_PAGES() <= 5 ||
      this.CURRENT_PAGE() + 2 >= this.TOTAL_PAGES()
    ) {
      return this.TOTAL_PAGES();
    }

    if (this.CURRENT_PAGE() <= 3) {
      return 6;
    }

    return this.CURRENT_PAGE() + 3;
  });

  START_INDEX = computed(() => (this.CURRENT_PAGE() - 1) * this.PAGE_SIZE());
  END_INDEX = computed(() =>
    Math.min(
      this.START_INDEX() + (this.PAGE_SIZE() - 1),
      this.ITEMS_COUNT() - 1
    )
  );

  currentRange = computed(() => this.CURRENT_PAGE());

  pages = computed(() => range(this.START_PAGE(), this.END_PAGE())); //TODO - Fix three points page

  setPage = (page: number) => this.CURRENT_PAGE.set(page);

  constructor() {
    effect(
      () =>
        this.paginate.emit({
          currentPage: this.CURRENT_PAGE(),
          start: this.START_INDEX(),
          pageSize: this.PAGE_SIZE(),
        }),
      { allowSignalWrites: true }
    );
  }
  ngOnInit(): void {
    this.pageSizeControl.valueChanges.subscribe({
      next: (val) => {
        !!val && this.PAGE_SIZE.set(val);
      },
    });
    this.pageSizeControl.setValue(this.PAGE_SIZE());
  }
}
