import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { CardComponent } from '@skooltrak/ui';

import { TeacherStore } from './teachers.store';

@Component({
  selector: 'sk-admin-teachers',
  standalone: true,
  imports: [CardComponent, RouterLink, RouterLinkActive, RouterOutlet],
  providers: [provideComponentStore(TeacherStore)],
  template: `<sk-card
    ><h2
      header
      class=" sticky top-0 pb-2 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-title font-bold"
    >
      Teachers
    </h2>
    <router-outlet />
  </sk-card> `,
  styles: [
    `
      .link {
        @apply inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300;
      }
      .active {
        @apply text-sky-600 border-sky-600 dark:text-sky-500 dark:border-sky-500;
      }
      .disabled {
        @apply text-gray-400 cursor-not-allowed dark:text-gray-500;
      }
    `,
  ],
})
export class TeachersComponent {}
