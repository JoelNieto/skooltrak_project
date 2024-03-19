import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Publication, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { CardComponent, ConfirmationService } from '@skooltrak/ui';

import { UserChipComponent } from '../user-chip/user-chip.component';

@Component({
  selector: 'sk-publication-item',
  standalone: true,
  imports: [
    CardComponent,
    UserChipComponent,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    TranslateModule,
    DatePipe,
  ],
  template: `<sk-card>
    <div class="flex justify-between" header>
      <div class="flex items-center gap-2">
        <sk-user-chip [user]="post().user" />
        <span class="text-sm font-mono text-slate-400">
          {{ post().created_at | date: 'medium' }}</span
        >
      </div>
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>more_horiz</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="deletePost()">
          <mat-icon color="warn">delete</mat-icon
          ><span>{{ 'ACTIONS.DELETE' | translate }}</span>
        </button>
      </mat-menu>
    </div>
    <div>
      @if (post().course; as course) {
        <div class="mt-2">
          <a
            class="bg-sky-600 rounded-full text-white px-3 py-1.5 mt-2 text-xs font-sans"
            [routerLink]="['/app/courses', course.id]"
            >{{ course.plan?.name }} - {{ course.subject?.name }}</a
          >
        </div>
      }

      <p
        class="text-sm font-sans text-gray-700 py-4"
        [innerText]="post().body"
      ></p>
    </div>
  </sk-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationItemComponent {
  public post = input.required<Publication>();
  public deleted = output<string>();
  private readonly supabase = inject(SupabaseService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly toast = inject(HotToastService);
  private readonly translate = inject(TranslateService);
  private readonly destroy = inject(DestroyRef);

  public deletePost(): void {
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
        next: async (res) => {
          if (res) return;
          const { error } = await this.supabase.client
            .from(Table.Publications)
            .delete()
            .eq('id', this.post().id);

          if (error) {
            console.error(error);

            return;
          }
          this.toast.info(this.translate.instant('ALERT.DELETED'));
          this.deleted.emit(this.post().id);
        },
      });
  }
}
