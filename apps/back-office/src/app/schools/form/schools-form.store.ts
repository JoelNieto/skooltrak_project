import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Country } from '@skooltrak/models';
import { catchError, from, map, of, switchMap } from 'rxjs';

@Injectable()
export class SchoolsFormStore
  extends ComponentStore<{ countries: Country[] }>
  implements OnStoreInit
{
  private supabase = inject(SupabaseService);
  readonly countries = this.selectSignal((state) => state.countries);
  private readonly setCountries = this.updater(
    (state, countries: Country[]) => ({
      ...state,
      countries,
    })
  );

  readonly fetchCountries = this.effect(() => {
    return from(
      this.supabase.client
        .from('country')
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) throw new Error(error.message);
        return of(data);
      }),
      catchError((error) => {
        console.error(error);
        return of([]);
      }),
      map((countries) => this.setCountries(countries as Country[]))
    );
  });

  ngrxOnStoreInit = () => this.setState({ countries: [] });
}
