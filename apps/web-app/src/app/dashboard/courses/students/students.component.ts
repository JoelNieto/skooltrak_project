import { JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { SelectComponent } from '@skooltrak/ui';

import { CourseDetailsStore } from '../details/course-details.store';
import { CourseStudentsStore } from './students.store';

@Component({
  standalone: true,
  selector: 'sk-courses-students',
  providers: [CourseStudentsStore],
  imports: [
    RouterLink,
    SelectComponent,
    TranslateModule,
    MatButton,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    JsonPipe,
    MatTableModule,
    MatMenuModule,
    MatIconButton,
  ],
  template: `
    <div class="mb-4 mt-2 flex justify-between items-center">
      <mat-form-field class="w-64">
        <mat-label>
          {{ 'GROUPS.NAME' | translate }}
        </mat-label>
        <mat-select [formControl]="groupControl">
          <mat-option>{{ 'GROUPS.ALL' | translate }}</mat-option>
          @for (group of course.groups(); track group.id) {
            <mat-option [value]="group.id">{{ group.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <button mat-flat-button color="accent">
        <mat-icon>add</mat-icon>{{ 'INVITE' | translate }}
      </button>
    </div>
    <table mat-table [dataSource]="state.students()">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>
          {{ 'STUDENTS.FULL_NAME' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.father_name }}, {{ item.first_name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <a
              mat-menu-item
              routerLink="/app/student-profile"
              [queryParams]="{ studentId: item.id }"
            >
              <mat-icon color="primary">badge</mat-icon>
              <span>{{ 'STUDENTS.REPORT' | translate }}</span>
            </a>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class CoursesComponent implements OnInit {
  public course = inject(CourseDetailsStore);
  public groupControl = new FormControl<string | undefined>(undefined, {
    nonNullable: true,
  });
  public state = inject(CourseStudentsStore);
  public displayedColumns = ['name', 'actions'];
  private destroy = inject(DestroyRef);

  public ngOnInit(): void {
    this.groupControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (groupId) => patchState(this.state, { groupId }),
      });
  }
}
