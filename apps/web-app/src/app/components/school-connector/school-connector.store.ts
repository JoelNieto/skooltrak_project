import { inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { RoleEnum, School, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { ConfirmationService } from '@skooltrak/ui';
import { filter } from 'rxjs';

type State = {
  role: RoleEnum | undefined;
  loading: boolean;
};

export const SchoolConnectorStore = signalStore(
  withState({ role: undefined, loading: false } as State),
  withMethods(
    (
      { role, ...state },
      supabase = inject(SupabaseService),
      confirmation = inject(ConfirmationService),
      translate = inject(TranslateService),
      toast = inject(HotToastService),
    ) => ({
      async fetchSchoolByCode(code: string): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Schools)
          .select('id,short_name, full_name, crest_url')
          .eq('code', code)
          .single();

        if (error || !data) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        confirmation
          .openDialog({
            title: data.full_name,
            icon: 'heroCheckCircle',
            description: `Do you one to link to this school`,
            showCancelButton: true,
            cancelButtonText: 'Not',
            confirmButtonText: 'Yes, confirm',
            color: 'green',
          })
          .pipe(filter((response) => !!response))
          .subscribe({ next: () => this.addSchoolConnection(data) });
      },
      async addSchoolConnection(request: Partial<School>): Promise<void> {
        const { error } = await supabase.client
          .from(Table.SchoolUsers)
          .insert([{ role, school_id: request.id }]);
        if (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));
          patchState(state, { loading: false });

          return;
        }
        toast.success(translate.instant('School connected successfully!'));

        patchState(state, { loading: false });
      },
    }),
  ),
);
