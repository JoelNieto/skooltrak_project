import { Component, inject } from '@angular/core';

import { AssignmentDetailsStore } from '../details/assignment-details.store';

@Component({
  standalone: true,
  selector: 'sk-assignments-instructions',
  template: `<div
    [innerHTML]="assignment()?.description"
    class="text-gray-700 dark:text-gray-100"
  ></div>`,
})
export class AssignmentInstructionsComponent {
  private store = inject(AssignmentDetailsStore);
  public assignment = this.store.assignment;
}
