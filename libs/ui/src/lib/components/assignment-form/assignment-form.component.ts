import { IconsModule } from '@amithvns/ng-heroicons';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Assignment } from '@skooltrak/models';

import { CardComponent } from '../card/card.component';
import { SelectComponent } from '../select/select.component';
import { TabsItemComponent } from '../tabs-item/tabs-item.component';
import { TabsComponent } from '../tabs/tabs.component';
import { AssignmentFormStore } from './assignment-form.store';

@Component({
  selector: 'sk-assignment-form',
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    IconsModule,
    TabsComponent,
    TabsItemComponent,
    SelectComponent,
  ],
  styles: [
    `
      input,
      select,
      textarea {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }
      label {
        @apply mb-2 block font-sans text-sm font-medium text-gray-600 dark:text-white;
      }
    `,
  ],
  providers: [provideComponentStore(AssignmentFormStore)],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'Assignments.Details' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <icon name="x-mark" class="text-gray-700 dark:text-gray-100" />
      </button>
    </div>
    <form action="" class="grid grid-cols-4 gap-4">
      <div>
        <label for="title">{{ 'Title' | translate }}</label>
        <input type="text" name="title" id="" />
      </div>
      <div>
        <label for="type">{{ 'Type' | translate }}</label>
        <sk-select [items]="store.types()" label="name" />
      </div>
      <div>
        <label for="course">{{ 'Courses' | translate }}</label>
        <sk-select
          [items]="store.courses()"
          label="subject.name"
          secondaryLabel="plan.name"
        />
      </div>
      <div>
        <label for="title">{{ 'Title' | translate }}</label>
        <input type="text" name="title" id="" />
      </div>
    </form>
  </sk-card>`,
})
export class AssignmentFormComponent {
  public dialogRef = inject(DialogRef<Partial<Assignment>>);
  private data: Assignment | undefined = inject(DIALOG_DATA);
  public store = inject(AssignmentFormStore);
}
