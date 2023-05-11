import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { SupabaseService } from '@skooltrak/auth';
import { School } from '@skooltrak/models';

@Component({
  selector: 'skooltrak-schools-details',
  standalone: true,
  imports: [LetDirective, RouterLink],
  template: `
    <div
      class="rounded-lg p-4 flex flex-col gap-2 items-center bg-white dark:bg-gray-700 border dark:border-none"
    >
      <img [src]="school?.logo_url" class="h-24 max-w-full mb-2" alt="" />
      <h2 class="text-2xl font-bold font-mono text-gray-700 dark:text-gray-100">
        {{ school?.full_name }}
      </h2>
      <a
        routerLink="../edit"
        [queryParams]="{ id: school?.id }"
        class="mr-4 bg-green-500 text-white text-sm rounded py-1 px-3 flex gap-1"
      >
        <svg
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          class="h-5 w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          ></path>
        </svg>
        Edit
      </a>
      <p
        class="flex items-center text-gray-600 dark:text-gray-200 font-mono gap-2 text-sm"
      >
        <svg
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          class="h-6 w-6 text-green-300"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          ></path>
        </svg>

        {{ school?.address }}
      </p>
      <p
        class="flex items-center text-gray-600 dark:text-gray-200 font-mono gap-2 text-sm"
      >
        <svg
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          class="h-6 w-6 text-blue-600 "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
          ></path>
        </svg>
        {{ school?.motto }}
      </p>
    </div>
  `,
  styles: [],
})
export class SchoolsDetailsComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private route = inject(ActivatedRoute);
  public school?: School;

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: async ({ id }) => {
        const { data, error } = await this.supabase.client
          .from('school')
          .select('*')
          .eq('id', id)
          .single();
        data!! && (this.school = data as School);
      },
    });
  }
}
