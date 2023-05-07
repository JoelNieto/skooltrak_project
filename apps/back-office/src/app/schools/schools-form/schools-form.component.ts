import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';

import { SchoolsStore } from '../schools.store';

@Component({
  selector: 'skooltrak-schools-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<div class="rounded p-4 flex flex-col bg-white dark:bg-gray-800">
    <h2
      class="text-2xl text-gray-700 dark:text-gray-200 font-mono font-semibold"
    >
      School details
    </h2>
    <form
      [formGroup]="form"
      class="grid lg:grid-cols-4 md:grid-cols-2  grid-cols-1 gap-4 mt-2"
    >
      <div>
        <label class="label" for="short_name">Short name</label>
        <input
          formControlName="short_name"
          type="text"
          name="short_name"
          class="input"
        />
      </div>
      <div>
        <label class="label" for="full_name">Full name</label>
        <input
          formControlName="short_name"
          type="text"
          name="full_name"
          class="input"
        />
      </div>
      <div>
        <label class="label" for="name">Address</label>
        <input type="text" name="name" class="input" />
      </div>
      <div>
        <label class="label" for="name">Motto</label>
        <input type="text" name="name" class="input" />
      </div>
      <div>
        <label class="label" for="name">Website</label>
        <input type="text" name="name" class="input" />
      </div>
      <div>
        <label class="label" for="name">Contact email</label>
        <input type="email" name="name" class="input" />
      </div>
      <div>
        <label class="label" for="name">Contact phone</label>
        <input type="text" name="name" class="input" />
      </div>
      <div>
        <label
          class="block mb-2 font-sans text-gray-700 font-medium dark:text-white"
          for="role"
          >Role</label
        >
        <select name="role" class="input" placeholder="name@company.com">
          <option selected disabled>Choose a role</option>
          <option>Student</option>
          <option>Teacher</option>
          <option>Administrator</option>
        </select>
      </div>
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="remember"
            aria-describedby="remember"
            type="checkbox"
            class="w-6 h-6 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-teal-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-teal-600 dark:ring-offset-gray-800"
            required=""
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="remember" class="text-gray-500 dark:text-gray-300"
            >Active</label
          >
        </div>
      </div>
    </form>
  </div>`,
  styles: [
    `
      .input {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 shadow-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
      }
      .label {
        @apply block mb-1 font-sans text-gray-700 font-medium dark:text-white;
      }
    `,
  ],
})
export class SchoolsFormComponent implements OnInit {
  private store = inject(SchoolsStore);
  private route = inject(ActivatedRoute);
  public school$ = this.store.selected$;

  form = new FormGroup({
    short_name: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    fullName: new FormControl<string>('', {
      validators: [Validators.minLength(10)],
    }),
    address: new FormControl<string>(''),
    motto: new FormControl<string>(''),
    logo_url: new FormControl<string>(''),
    website: new FormControl<string>(''),
    contact_email: new FormControl<string>(''),
    contact_phone: new FormControl<string>(''),
    active: new FormControl<boolean>(true),
    is_public: new FormControl<boolean>(true),
  });

  ngOnInit(): void {
    this.school$
      .pipe(
        tap((school) => console.log(school)),
        filter((school) => !school),
        switchMap(() => this.route.queryParams.pipe(filter(({ id }) => !!id)))
      )
      .subscribe({
        next: ({ id }) => {
          console.log(id);
          this.store.setSelected(id);
        },
      });
  }
}
