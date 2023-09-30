import { inject } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Country, School, Table } from '@skooltrak/models';
import { EMPTY, from, map, Observable, switchMap, tap } from 'rxjs';

import { AlertService } from '../../services/alert.service';

type State = {
  loading: boolean;
  countries: Country[];
  school: Partial<School> | undefined;
  crest_url: string | undefined;
};
export class SchoolFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private supabase = inject(SupabaseService);
  readonly school = this.selectSignal((state) => state.school);
  private alert = inject(AlertService);
  countries = this.selectSignal((state) => state.countries);

  readonly fetchCountries = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.Countries)
        .select('*')
        .order('name', { ascending: true })
    )
      .pipe(
        map(({ error, data }) => {
          if (error) throw new Error(error.message);
          return data as Country[];
        })
      )
      .pipe(
        tapResponse(
          (countries) => this.patchState({ countries }),
          (error) => console.error(error)
        )
      );
  });

  readonly uploadCrest = this.effect((request$: Observable<File>) => {
    return request$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((request) =>
        from(this.supabase.uploadCrest(request)).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data.path;
          })
        )
      ),
      tapResponse(
        (crest_url) =>
          this.patchState({ school: { ...this.school(), crest_url } }),
        (error) => console.error(error),
        () => this.patchState({ loading: false })
      )
    );
  });

  saveSchool = this.effect((request$: Observable<Partial<School>>) => {
    return request$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((request) =>
        from(this.supabase.client.from(Table.Schools).upsert([request])).pipe(
          map(({ error }) => {
            if (error) throw new Error(error.message);
            return EMPTY;
          })
        )
      ),
      tapResponse(
        () =>
          this.alert.showAlert({ icon: 'success', message: 'School created!' }),
        (error: string) =>
          this.alert.showAlert({ icon: 'error', message: error }),
        () => this.patchState({ loading: false })
      )
    );
  });

  ngrxOnStoreInit = () =>
    this.setState({
      school: undefined,
      loading: false,
      countries: [],
      crest_url: undefined,
    });
}
