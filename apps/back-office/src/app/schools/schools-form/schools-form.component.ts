import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '@skooltrak/auth';
import { Country, SchoolType } from '@skooltrak/models';

import { SchoolsStore } from '../schools.store';

@Component({
  selector: 'skooltrak-schools-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  providers: [SupabaseService],
  template: `<div
    class="rounded-xl pt-4 flex flex-col bg-white dark:bg-gray-600 dark:border-none"
  >
    <h2
      class="text-xl text-gray-500 dark:text-gray-200 font-mono font-semibold"
    >
      School details
    </h2>
    <form
      [formGroup]="form"
      (ngSubmit)="saveSchool()"
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
          formControlName="full_name"
          type="text"
          name="full_name"
          class="input"
        />
      </div>
      <div>
        <label class="label" for="address">Address</label>
        <input
          type="text"
          name="address"
          class="input"
          formControlName="address"
        />
      </div>
      <div>
        <label class="label" for="motto">Motto</label>
        <input type="text" name="motto" class="input" formControlName="motto" />
      </div>
      <div>
        <label class="label" for="website">Website</label>
        <input
          type="url"
          name="website"
          class="input"
          formControlName="website"
        />
      </div>
      <div>
        <label class="label" for="contact_email">Contact email</label>
        <input
          type="email"
          name="contact_email"
          class="input"
          formControlName="contact_email"
        />
      </div>
      <div>
        <label class="label" for="contact_phone">Contact phone</label>
        <input
          type="tel"
          name="contact_phone"
          class="input"
          formControlName="contact_phone"
        />
      </div>
      <div>
        <label class="label" for="country">Country</label>
        <select
          name="country"
          class="input"
          placeholder="name@company.com"
          formControlName="country_id"
        >
          <option selected disabled>Choose a country</option>
          <option *ngFor="let country of countries" [value]="country.id">
            {{ country.name }}
          </option>
        </select>
      </div>
      <div>
        <label class="label" for="country">Type</label>
        <select name="type" class="input" formControlName="type">
          <option selected disabled>Choose a type</option>
          <option value="Private">Private</option>
          <option value="Public">Public</option>
        </select>
      </div>
      <div class="flex justify-between items-center col-span-4">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              aria-describedby="active"
              type="checkbox"
              formControlName="active"
              class="w-6 h-6 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-teal-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-teal-600 dark:ring-offset-gray-800"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="active" class="text-gray-500 dark:text-gray-300"
              >Active</label
            >
          </div>
        </div>
        <button
          type="submit"
          class="text-white disabled:opacity-75 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Save changes
        </button>
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
  store = inject(SchoolsStore);
  private school = this.store.selected$;
  supabase = inject(SupabaseService);

  countries?: Partial<Country>[] | null;
  route = inject(ActivatedRoute);
  form = new FormGroup({
    short_name: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(50)],
      nonNullable: true,
    }),
    full_name: new FormControl<string>('', {
      validators: [Validators.minLength(10)],
      nonNullable: true,
    }),
    address: new FormControl<string>('', { nonNullable: true }),
    motto: new FormControl<string>('', { nonNullable: true }),
    logo_url: new FormControl<string>('', { nonNullable: true }),
    website: new FormControl<string>('', { nonNullable: true }),
    contact_email: new FormControl<string>('', { nonNullable: true }),
    contact_phone: new FormControl<string>('', { nonNullable: true }),
    active: new FormControl<boolean>(true, { nonNullable: true }),
    type: new FormControl<SchoolType>(SchoolType.Private, {
      nonNullable: true,
    }),
    country_id: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
    }),
  });

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe({
      next: ({ id }) => id!! && this.store.setSelected(id),
    });

    this.school.subscribe({
      next: (school) => {
        school!! && this.form.patchValue(school);
      },
    });

    const { data, error } = await this.supabase.client
      .from('country')
      .select('*')
      .order('name', { ascending: true })
      .eq('active', true);
    if (error) {
      throw error;
    } else this.countries = data;
  }

  async saveSchool() {
    const value = this.form.getRawValue();
    this.store.createSchool(value);
  }
}
