import { IconsModule } from '@amithvns/ng-heroicons';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Teacher } from '@skooltrak/models';
import { ButtonDirective } from '@skooltrak/ui';

import { TeachersFormComponent } from '../form/teachers-form.component';
import { TeacherStore } from '../teachers.store';

@Component({
  selector: 'sk-admin-teachers-list',
  standalone: true,
  imports: [ButtonDirective, IconsModule, RouterLink, DialogModule],
  template: `<div class="relative overflow-x-auto mt-1">
    <div class="flex justify-between mb-4 py-2 px-1">
      <div>
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <icon
              name="magnifying-glass"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
            />
          </div>
          <input
            type="text"
            id="table-search"
            class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
            placeholder="Search for items"
          />
        </div>
      </div>

      <button skButton color="sky" (click)="newTeacher()">New</button>
    </div>
  </div> `,
})
export class TeachersListComponent {
  store = inject(TeacherStore);
  dialog = inject(Dialog);

  newTeacher() {
    const dialogRef = this.dialog.open<Partial<Teacher>>(
      TeachersFormComponent,
      {
        minWidth: '75%',
        disableClose: true,
      }
    );

    dialogRef.closed.subscribe({
      next: (request) => {
        console.log(request);
      },
    });
  }
}
