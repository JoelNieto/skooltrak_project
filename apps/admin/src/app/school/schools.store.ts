import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { Country, School } from '@skooltrak/models';
import { exhaustMap, from, of } from 'rxjs';

type State = {
  school?: Partial<School>;
  countries: Country[];
  loading: boolean;
};

@Injectable()
export class SchoolStore extends ComponentStore<State> implements OnStoreInit {
  store = inject(Store);
  currentSchool = this.store.selectSignal(state.selectors.selectCurrentSchool);
  supabase = inject(SupabaseService);

  readonly countries = this.selectSignal((state) => state.countries);
  readonly school = this.selectSignal((state) => state.school);
  private readonly setCountries = this.updater(
    (state, countries: Country[]) => ({ ...state, countries, loading: false })
  );

  readonly fetchCountries = this.effect(() => {
    return from(
      this.supabase.client
        .from('countries')
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      exhaustMap(({ data, error }) => {
        if (error) throw new Error(error.message);
        return of(data);
      }),
      tapResponse(
        (countries) => this.setCountries(countries as Country[]),
        (error) => {
          console.error(error);
          return of([]);
        }
      )
    );
  });

  ngrxOnStoreInit = () =>
    this.setState({
      school: this.currentSchool(),
      loading: true,
      countries: [],
    });
}
