import { NgClass, NgFor } from '@angular/common';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
} from '@angular/core';
import { range } from 'lodash';

@Component({
  selector: 'skooltrak-paginator',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `<nav
    class="flex items-center justify-between pt-4"
    aria-label="Table navigation"
  >
    <span class="text-sm font-normal text-gray-500 dark:text-gray-400"
      >Showing
      <span class="font-semibold text-gray-900 dark:text-white"
        >{{ startIndex() + 1 }}-{{ endIndex() + 1 }}</span
      >
      of
      <span class="font-semibold text-gray-900 dark:text-white">{{
        itemsCount()
      }}</span></span
    >
    <ul class="inline-flex items-center -space-x-px">
      <li>
        <a
          (click)="setPage(currentPage() - 1)"
          class="item block rounded-l-lg"
          [ngClass]="{ disabled: currentPage() === 1 }"
        >
          <span class="sr-only">Previous</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </a>
      </li>
      <li *ngFor="let page of pages()">
        <a
          (click)="setPage(page)"
          class="item"
          [ngClass]="{ active: currentPage() === page }"
          >{{ page }}</a
        >
      </li>
      <li>
        <a class="item">...</a>
      </li>
      <li>
        <a (click)="setPage(totalPages())" class="item">{{ totalPages() }}</a>
      </li>
      <li>
        <a
          (click)="setPage(currentPage() + 1)"
          class="item block rounded-r-lg"
          [ngClass]="{ disabled: currentPage() === totalPages() }"
        >
          <span class="sr-only">Next</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </a>
      </li>
    </ul>
  </nav>`,
  styles: [
    `
      .item {
        @apply px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white;
      }
      .active {
        @apply z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white;
      }
      .disabled {
        @apply z-10 text-gray-300 bg-gray-100 border border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400;
      }
    `,
  ],
})
export class PaginatorComponent {
  @Input() set count(count: number) {
    this.itemsCount.set(count);
  }
  @Input({ required: true }) pageSize: Signal<number> = signal(0);
  @Output() paginate = new EventEmitter<{
    currentPage: number;
    start: number;
  }>();
  itemsCount = signal<number>(0);
  totalPages = computed(() => Math.ceil(this.itemsCount() / this.pageSize()));

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
    Math.min(this.startIndex() + (this.pageSize() - 1), this.itemsCount() - 1)
  );

  currentRange = computed(() => this.currentPage());

  pages = computed(() => range(this.startPage(), this.endPage()));

  setPage = (page: number) => this.currentPage.set(page);

  constructor() {
    effect(() =>
      this.paginate.emit({
        currentPage: this.currentPage(),
        start: this.startIndex(),
      })
    );
  }
}
