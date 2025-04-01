import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[sk-empty]',
    imports: [TranslateModule],
    template: `<td colspan="100%">
    <div class="flex flex-col items-center justify-center gap-4 h-72">
      <img src="/assets/images/books-lineal-colored.svg" class="h-24" alt="" />
      <p class="font-sans italic text-gray-400">
        {{ 'NO_ITEMS' | translate }}
      </p>
    </div>
  </td>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyTableComponent {}
