import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonDirective, CardComponent, InputDirective } from '@skooltrak/ui';

import { UserChipComponent } from '../../components/user-chip/user-chip.component';
import { PublicationsStore } from './publications.store';

@Component({
  selector: 'sk-publications',
  standalone: true,
  providers: [PublicationsStore],
  imports: [
    CardComponent,
    InputDirective,
    TranslateModule,
    ReactiveFormsModule,
    ButtonDirective,
    DatePipe,
    UserChipComponent,
    MatFormField,
    MatInput,
    MatLabel,
  ],
  template: `<div class="flex gap-6 w-full">
    <sk-card class="w-72">
      <div header>
        <h3 class="text-xl font-semibold font-title text-gray-700">
          {{ 'ASSIGNMENTS.TODAY' | translate }}
        </h3>
      </div>
    </sk-card>
    <div class="flex-1 flex flex-col gap-4">
      <sk-card>
        <div header>
          <h2
            class="font-title mb-2 flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
          >
            {{ 'PUBLICATIONS.NEW' | translate }}
          </h2>
          <mat-form-field class="w-full">
            <textarea
              [formControl]="textControl"
              type="text"
              matInput
              [placeholder]="'PUBLICATIONS.BODY' | translate"
            ></textarea>
          </mat-form-field>
        </div>
        <div class="flex justify-end" footer>
          <button skButton color="sky">
            {{ 'PUBLICATIONS.PUBLISH' | translate }}
          </button>
        </div>
      </sk-card>
      <div class="flex flex-col gap-4">
        @for (publication of store.publications(); track publication.id) {
          <sk-card>
            <div header>
              <div class="flex"><sk-user-chip [user]="publication.user" /></div>
              <h3 class="font-semibold font-title text-gray-700 text-lg">
                {{ publication.title }}
              </h3>
              <p class="text-gray-400 text-sm">
                {{ publication.created_at | date: 'medium' }}
              </p>
            </div>
            <p
              class="text-sm font-sans text-gray-700"
              [innerText]="publication.body"
            ></p>
          </sk-card>
        }
      </div>
    </div>
    <div class="w-72"></div>
  </div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationsComponent implements OnInit {
  public textControl = new FormControl('', { nonNullable: true });
  public store = inject(PublicationsStore);

  public ngOnInit(): void {
    setTimeout(() => {
      this.store.getPublications();
    }, 1000);
  }
}
