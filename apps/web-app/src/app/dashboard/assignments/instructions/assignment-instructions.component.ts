import { Component, inject } from '@angular/core';

import { AssignmentDetailsStore } from '../details/assignment-details.store';

@Component({
  standalone: true,
  selector: 'sk-assignments-instructions',
  template: `<div
    [innerHTML]="store.assignment()?.description"
    class="text-gray-700 dark:text-gray-100"
  ></div>`,
})
export class AssignmentInstructionsComponent {
  public store = inject(AssignmentDetailsStore);
}
