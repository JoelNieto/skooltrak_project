import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { AlertService, InputDirective } from '@skooltrak/ui';
import { combineLatest, distinctUntilChanged, filter, map } from 'rxjs';

import { CourseGradesStore } from '../grades/course-grades.store';

@Component({
  selector: 'sk-grade-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputDirective],
  template: ` <input [formControl]="scoreControl" skInput type="number" />`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeItemFormComponent implements OnInit {
  @Input({ required: true }) public gradeId!: string;
  @Input({ required: true }) public studentId!: string;
  private store = inject(CourseGradesStore);
  private alert = inject(AlertService);
  private supabase = inject(SupabaseService);
  private injector = inject(Injector);
  private destroy = inject(DestroyRef);
  public scoreControl = new FormControl<undefined | number>(undefined, {
    nonNullable: true,
    validators: [Validators.min(1), Validators.max(5)],
    updateOn: 'blur',
  });
  public currentGrade = computed(() =>
    this.store.grades().find((x) => x.id === this.gradeId),
  );
  public currentItem = computed(
    () =>
      this.currentGrade()?.items?.find((x) => x.student_id === this.studentId),
  );

  public ngOnInit(): void {
    combineLatest([
      this.scoreControl.valueChanges,
      this.scoreControl.statusChanges,
    ])
      .pipe(
        takeUntilDestroyed(this.destroy),

        filter(([, status]) => status === 'VALID'),
        filter(([value]) => value !== this.currentItem()?.score),
        map(([value]) => value),
        distinctUntilChanged(),
      )
      .subscribe({
        next: () => this.saveGrade(),
      });

    effect(
      () => {
        !!this.currentItem() &&
          this.scoreControl.setValue(this.currentItem()?.score);
      },
      { injector: this.injector },
    );
  }

  private async saveGrade(): Promise<void> {
    let item = {
      grade_id: this.gradeId,
      score: this.scoreControl.getRawValue(),
      student_id: this.studentId,
    };
    item = this.currentItem()
      ? { ...item, ...{ id: this.currentItem()?.id } }
      : item;

    const { error } = await this.supabase.client
      .from(Table.GradeItems)
      .upsert([item]);
    if (error) {
      this.alert.showAlert({ icon: 'error', message: 'ALERT_FAILURE' });
    }
  }
}
