import { Dialog } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { QuizAssignation } from '@skooltrak/models';
import { ConfirmationService } from '@skooltrak/ui';

import { AssignationFormComponent } from '../assignation-form/assignation-form.component';
import { QuizAssignationsStore } from './quiz-assignations.store';

@Component({
  selector: 'sk-quiz-assignations',
  standalone: true,
  imports: [
    TranslateModule,
    MatButton,
    MatIcon,
    MatTableModule,
    DatePipe,
    MatIconButton,
    MatMenuModule,
  ],
  providers: [QuizAssignationsStore],
  template: `<div class="flex items-center justify-between">
      <h2 class="mat-headline-3">
        {{ 'QUIZZES.ASSIGNATIONS' | translate }}
      </h2>
      <button mat-flat-button color="accent" (click)="newAssignation()">
        <mat-icon>add</mat-icon>{{ 'NEW' | translate }}
      </button>
    </div>

    <table mat-table [dataSource]="state.assignations()">
      <ng-container matColumnDef="quiz">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'QUIZZES.ITEM' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">{{ item.quiz.title }}</td>
      </ng-container>
      <ng-container matColumnDef="course">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'QUIZZES.COURSE' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.course.plan.name }} - {{ item.course.subject.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="start_date">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'QUIZZES.START_DATE' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.start_date | date: 'mediumDate' }}
        </td>
      </ng-container>
      <ng-container matColumnDef="end_date">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'QUIZZES.END_DATE' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.end_date | date: 'mediumDate' }}
        </td>
      </ng-container>
      <ng-container matColumnDef="user">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'USER' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.user.first_name }} {{ item.user.father_name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="created_at">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'CREATED_AT' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.created_at | date: 'medium' }}
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef mat-sort-header></th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="editAssignation(item)">
              <mat-icon color="accent">edit_square</mat-icon>
              <span>{{ 'ACTIONS.EDIT' | translate }}</span>
            </button>
            <button mat-menu-item (click)="deleteAssignation(item.id)">
              <mat-icon color="warn">delete</mat-icon>
              <span>{{ 'ACTIONS.DELETE' | translate }}</span>
            </button>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizAssignationsComponent {
  public displayedColumns = [
    'quiz',
    'course',
    'start_date',
    'end_date',
    'user',
    'created_at',
    'actions',
  ];
  public state = inject(QuizAssignationsStore);
  private dialog = inject(Dialog);
  private confirmation = inject(ConfirmationService);
  private destroy = inject(DestroyRef);

  public newAssignation(): void {
    this.dialog
      .open(AssignationFormComponent, {
        data: {},
        width: '48rem',
        maxWidth: '90%',
      })
      .closed.subscribe({ next: () => this.state.getAssignations() });
  }

  public editAssignation(assignation: QuizAssignation): void {
    this.dialog
      .open(AssignationFormComponent, {
        data: { assignation },
        width: '48rem',
        maxWidth: '90%',
      })
      .closed.subscribe({ next: () => this.state.getAssignations() });
  }

  public deleteAssignation(id: string): void {
    this.confirmation
      .openDialog({
        title: 'CONFIRMATION.DELETE.TITLE',
        description: 'CONFIRMATION.DELETE.TEXT',
        icon: 'delete',
        color: 'warn',
        confirmButtonText: 'CONFIRMATION.DELETE.CONFIRM',
        cancelButtonText: 'CONFIRMATION.DELETE.CANCEL',
        showCancelButton: true,
      })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => !!res && this.state.deleteAssignation(id),
      });
  }
}
