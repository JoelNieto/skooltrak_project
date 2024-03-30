import { DatePipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@skooltrak/store';

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
        <div header class="flex items-start justify-between">
          <div>
            <h1 class="mat-headline-2">
              {{ store.assignment()?.title }}
            </h1>
            <a
              class="mat-subtitle"
              [routerLink]="['/app', 'courses', store.assignment()?.course_id]"
            >
              {{ store.assignment()?.course?.subject?.name }} /
              {{ store.assignment()?.course?.plan?.name }}
            </a>
            <p class="mat-body">
              {{ store.assignment()?.type?.name }}
            </p>
          </div>
          <button mat-stroked-button class="tertiary" routerLink="edit">
            {{ 'ACTIONS.EDIT' | translate }}
          </button>
        </div>
        <div>
          <mat-tab-group>
            <mat-tab [label]="'ASSIGNMENTS.INSTRUCTIONS' | translate">
              <ng-template matTabContent>
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
                      <mat-chip>{{ file.file_name }}</mat-chip>
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
        <div header>
          <h2 class="mat-headline-4">
            {{ 'Groups' | translate }}
          </h2>
        </div>
        <div>
          @for (date of store.assignment()?.dates; track date.group.id) {
            <div class="mb-2 flex flex-col ">
              <h4 class="mat-subtitle font-semibold">
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
  private id = input.required<string>();

  public store = inject(AssignmentDetailsStore);
  public supabase = inject(SupabaseService);

  public ngOnInit(): void {
    this.store.fetchAssignment(this.id());
  }
}
