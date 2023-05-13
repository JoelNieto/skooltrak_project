import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SubjectsStore } from '../subjects.store';

@Component({
  selector: 'skooltrak-subjects-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<div
    class="rounded-xl flex flex-col bg-white dark:bg-gray-800 dark:border-none"
  >
    <h2
      class="text-xl text-gray-500 dark:text-gray-200 font-mono font-semibold"
    >
      School details
    </h2>
    <form
      [formGroup]="form"
      (ngSubmit)="saveChanges()"
      class="grid lg:grid-cols-4 md:grid-cols-2  grid-cols-1 gap-4 mt-2"
    >
      <div>
        <label class="label" for="short_name">Name</label>
        <input formControlName="name" type="text" name="name" class="input" />
      </div>
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
        <label class="label" for="description">Description</label>
        <input
          type="text"
          name="description"
          class="input"
          formControlName="description"
        />
      </div>
      <div>
        <label class="label" for="code">Code</label>
        <input
          type="text"
          name="description"
          class="input"
          formControlName="code"
        />
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
export class SubjectsFormComponent implements OnInit {
  private store = inject(SubjectsStore);
  private route = inject(ActivatedRoute);
  form = new FormGroup({
    name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    short_name: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(20)],
      nonNullable: true,
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
    }),
    code: new FormControl<string>('', {
      nonNullable: true,
    }),
    active: new FormControl<boolean>(true, {
      nonNullable: true,
    }),
  });
  constructor() {
    effect(() => this.form.patchValue(this.store.selected()!));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: ({ id }) => !!id && this.store.setSelected(id),
    });
  }

  saveChanges() {
    let value: any = this.form.getRawValue();
    value = this.store.selected()!!
      ? { ...value, id: this.store.selected()?.id }
      : value;
    this.store.saveSubject(value);
  }
}
