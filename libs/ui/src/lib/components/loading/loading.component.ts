import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[sk-loading]',
  standalone: true,
  imports: [],
  template: `
    <td colspan="100%">
      <div class="animate-pulse">
        <div class="flex flex-col">
          <div
            class="border-b w-full border-gray-200 py-4 flex items-center dark:bg-gray-700 dark:border-gray-600"
          >
            <div
              class="h-6 w-full block rounded-lg bg-gray-200 dark:bg-gray-600"
            ></div>
          </div>
          <div
            class="border-b w-full border-gray-200 py-4 flex items-center dark:bg-gray-700 dark:border-gray-600"
          >
            <div
              class="h-6 w-full block rounded-lg bg-gray-200 dark:bg-gray-600"
            ></div>
          </div>
          <div
            class="border-b w-full border-gray-200 py-4 flex items-center dark:bg-gray-700 dark:border-gray-600"
          >
            <div
              class="h-6 w-full block rounded-lg bg-gray-200 dark:bg-gray-600"
            ></div>
          </div>
          <div
            class="border-b w-full border-gray-200 py-4 flex items-center dark:bg-gray-700 dark:border-gray-600"
          >
            <div
              class="h-6 w-full block rounded-lg bg-gray-200 dark:bg-gray-600"
            ></div>
          </div>
          <div
            class="border-b w-full border-gray-200 py-4 flex items-center dark:bg-gray-700 dark:border-gray-600"
          >
            <div
              class="h-6 w-full block rounded-lg bg-gray-200 dark:bg-gray-600"
            ></div>
          </div>
        </div>
      </div>
    </td>
  `,
  styles: `:host {
    display: contents;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {}
