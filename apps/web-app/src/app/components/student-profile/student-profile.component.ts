import { DatePipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { AgePipe } from '@skooltrak/ui';

import { ProfileGradesComponent } from '../profile-grades/profile-grades.component';
import { StudentProfileStore } from './student-profile.store';

@Component({
  selector: 'sk-student-profile',
  standalone: true,
  providers: [StudentProfileStore],
  template: `<mat-card>
    <mat-card-header>
      <mat-card-subtitle>
        {{ 'STUDENTS.PROFILE' | translate }}
      </mat-card-subtitle>
      <mat-card-title>
        {{ state.student()?.father_name }}, {{ state.student()?.first_name }}
      </mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <mat-tab-group>
        <mat-tab [label]="'STUDENTS.INFO' | translate">
          <ng-template matTabContent>
            @if (state.student(); as student) {
              <div class="grid grid-cols-4 space-y-4 p-4">
                <div class="flex flex-col">
                  <div class="font-mono text-sm text-gray-400">
                    {{ 'PROFILE.FIRST_NAME' | translate }}
                  </div>
                  <div class="font-sans text-gray-700">
                    {{ student.first_name }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="font-mono text-sm text-gray-400">
                    {{ 'PROFILE.MIDDLE_NAME' | translate }}
                  </div>
                  <div class="font-sans text-gray-700">
                    {{ student.middle_name }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="font-mono text-sm text-gray-400">
                    {{ 'PROFILE.FATHER_NAME' | translate }}
                  </div>
                  <div class="font-sans text-gray-700">
                    {{ student.father_name }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="font-mono text-sm text-gray-400">
                    {{ 'PROFILE.MOTHER_NAME' | translate }}
                  </div>
                  <div class="font-sans text-gray-700">
                    {{ student.mother_name }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="font-mono text-sm text-gray-400">
                    {{ 'PROFILE.GROUP' | translate }}
                  </div>
                  <div class="font-sans text-gray-700">
                    {{ student.profile[0].group.name }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="font-mono text-sm text-gray-400">
                    {{ 'PROFILE.AGE' | translate }}
                  </div>
                  <div class="font-sans text-gray-700">
                    {{ student.birth_date | age }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="font-mono text-sm text-gray-400">
                    {{ 'PROFILE.BIRTH_DATE' | translate }}
                  </div>
                  <div class="font-sans text-gray-700">
                    {{ student.birth_date | date: 'mediumDate' }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="font-mono text-sm text-gray-400">
                    {{ 'PROFILE.DOCUMENT_ID' | translate }}
                  </div>
                  <div class="font-sans text-gray-700">
                    {{ student.document_id }}
                  </div>
                </div>
              </div>
            }
          </ng-template>
        </mat-tab>
        <mat-tab [label]="'STUDENTS.GRADES' | translate">
          <ng-template matTabContent>
            @defer (when state.student()) {
              <sk-profile-grades />
            }
          </ng-template>
        </mat-tab>
        <mat-tab [label]="'STUDENTS.INCIDENTS' | translate"></mat-tab>
        <mat-tab [label]="'STUDENTS.ATTENDANCE' | translate"></mat-tab>
      </mat-tab-group>
    </mat-card-content>
  </mat-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    TranslateModule,
    MatTabsModule,
    AgePipe,
    DatePipe,
    JsonPipe,
    ProfileGradesComponent,
  ],
})
export class StudentProfileComponent implements OnInit {
  private studentId = input.required<string>();
  public state = inject(StudentProfileStore);

  public ngOnInit(): void {
    this.state.fetchProfile(this.studentId());
  }
}
