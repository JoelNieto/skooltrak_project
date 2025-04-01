import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'sk-chats-loading',
    imports: [],
    template: `<div
    class="flex grow flex-col-reverse gap-2 p-6 overflow-y-scroll"
  >
    <div class="flex">
      <div class="flex-col gap-3">
        <div class="flex gap-2">
          <div class="rounded-full h-5 w-5 animate-pulse bg-gray-300"></div>
          <div class="rounded-full h-5 w-24 animate-pulse bg-gray-300"></div>
        </div>
        <div class="rounded-2xl h-20 w-48 animate-pulse bg-gray-300 mt-2"></div>
      </div>
    </div>
    <div class="flex justify-end">
      <div class="flex-col gap-3">
        <div class="flex gap-2">
          <div class="rounded-full h-5 w-5 animate-pulse bg-gray-300"></div>
          <div class="rounded-full h-5 w-24 animate-pulse bg-gray-300"></div>
        </div>
        <div class="rounded-2xl h-20 w-48 animate-pulse bg-gray-300 mt-2"></div>
      </div>
    </div>
    <div class="flex">
      <div class="flex-col gap-3">
        <div class="flex gap-2">
          <div class="rounded-full h-5 w-5 animate-pulse bg-gray-300"></div>
          <div class="rounded-full h-5 w-24 animate-pulse bg-gray-300"></div>
        </div>
        <div class="rounded-2xl h-20 w-48 animate-pulse bg-gray-300 mt-2"></div>
      </div>
    </div>
    <div class="flex justify-end">
      <div class="flex-col gap-3">
        <div class="flex gap-2">
          <div class="rounded-full h-5 w-5 animate-pulse bg-gray-300"></div>
          <div class="rounded-full h-5 w-24 animate-pulse bg-gray-300"></div>
        </div>
        <div class="rounded-2xl h-20 w-48 animate-pulse bg-gray-300 mt-2"></div>
      </div>
    </div>
  </div>`,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsLoadingComponent {}
