import { DatePipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@skooltrak/store';
import { ConfirmationService } from '@skooltrak/ui';

import { AssignmentGradesComponent } from '../grades/assignment-grades.component';
import { AssignmentInstructionsComponent } from '../instructions/assignment-instructions.component';
import { AssignmentStudentsWorkComponent } from '../students-work/assignment-students-work.component';
import { AssignmentDetailsStore } from './assignment-details.store';

@Component({
  standalone: true,
  selector: 'sk-assignment-details',
  imports: [
    DatePipe,
    TranslateModule,
    MatButtonModule,
    RouterOutlet,
    MatTabsModule,
    MatChipsModule,
    RouterLink,
    AssignmentInstructionsComponent,
    AssignmentStudentsWorkComponent,
    AssignmentGradesComponent,
  ],
  providers: [AssignmentDetailsStore],
  template: `
    <div class="flex gap-8">
      <div class="flex-1">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="mat-display-medium">
              {{ store.assignment()?.title }}
            </h1>
            <mat-chip-set>
              <mat-chip class="primary"
                >{{ store.assignment()?.course?.subject?.name }}
              </mat-chip>
              <a
                [routerLink]="[
                  '/app',
                  'courses',
                  store.assignment()?.course_id
                ]"
              >
                <mat-chip class="secondary">
                  {{ store.assignment()?.course?.plan?.name }}
                </mat-chip>
              </a>
              <mat-chip>{{ store.assignment()?.type?.name }}</mat-chip>
              <mat-chip class="tertiary"
                >{{ store.assignment()?.user?.first_name }}
                {{ store.assignment()?.user?.father_name }}
              </mat-chip>
            </mat-chip-set>
          </div>
          <div class="flex gap-2">
            <button mat-stroked-button color="accent" routerLink="edit">
              {{ 'ACTIONS.EDIT' | translate }}
            </button>
            <button mat-flat-button color="warn" (click)="deleteAssignment()">
              {{ 'ACTIONS.DELETE' | translate }}
            </button>
          </div>
        </div>
        <div>
          <mat-tab-group>
            <mat-tab [label]="'ASSIGNMENTS.INSTRUCTIONS' | translate">
              <ng-template matTabContent>
                <h3 class="mat-headline-4">
                  {{ 'ASSIGNMENTS.ATTACHMENTS' | translate }}
                </h3>
                <mat-chip-set>
                  @for (
                    file of store.assignment()?.attachments;
                    track file.file_name
                  ) {
                    <a
                      [href]="supabase.getFileURL(file.file_path, 'files')"
                      [download]="file.file_name"
                      target="_blank"
                    >
                      <mat-chip class="tertiary">{{ file.file_name }}</mat-chip>
                    </a>
                  }
                </mat-chip-set>
                <sk-assignments-instructions />
              </ng-template>
            </mat-tab>
            <mat-tab [label]="'ASSIGNMENTS.WORK' | translate">
              <ng-template matTabContent>
                <sk-assignment-students-work />
              </ng-template>
            </mat-tab>
            <mat-tab [label]="'ASSIGNMENTS.GRADES' | translate">
              <ng-template matTabContent>
                <sk-assignment-grades />
              </ng-template>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>
      <div class="w-72 ">
        <div>
          <h2 class="mat-headline-small">
            {{ 'Groups' | translate }}
          </h2>
        </div>
        <div>
          @for (date of store.assignment()?.dates; track date.group.id) {
            <div class="mb-2 flex flex-col ">
              <h4 class="mat-title-medium">
                {{ date.group.name }}
              </h4>
              <p class="mat-body">
                {{ date.date | date: 'mediumDate' }}
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class AssignmentDetailsComponent implements OnInit {
  public readonly id = input.required<string>();

  public store = inject(AssignmentDetailsStore);
  public supabase = inject(SupabaseService);
  private confirmation = inject(ConfirmationService);

  public ngOnInit(): void {
    this.store.fetchAssignment(this.id());
  }

  public deleteAssignment(): void {
    this.confirmation
      .openDialog({
        title: 'CONFIRMATION.DELETE.TITLE',
        showCancelButton: true,
      })
      .subscribe({
        next: (res) => {
          res && this.store.deleteAssignment(this.id());
        },
      });
  }
}
