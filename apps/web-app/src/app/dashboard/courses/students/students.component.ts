import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonDirective, SelectComponent } from '@skooltrak/ui';

import { CoursesStore } from '../courses.store';

@Component({
  standalone: true,
  selector: 'sk-courses-students',
  imports: [SelectComponent, TranslateModule, ButtonDirective],
  template: `
    <div class="mb-4 mt-2 flex justify-between">
      <div class="w-64">
        <sk-select
          [items]="groups()"
          label="name"
          [placeholder]="'Select group' | translate"
          [search]="false"
        />
      </div>
      <button skButton color="green">+ {{ 'Add' | translate }}</button>
    </div>
  `,
})
export class CoursesComponent {
  private store = inject(CoursesStore);
  public groups = this.store.groups;
}
