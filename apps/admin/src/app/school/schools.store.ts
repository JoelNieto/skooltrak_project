import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { Country, School, Table } from '@skooltrak/models';
import { exhaustMap, from, Observable, of, switchMap, tap } from 'rxjs';

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

  private setSchool = this.updater((state, school: Partial<School>) => ({
    ...state,
    school,
  }));
  private setSchoolCrest = this.updater((state, crest_url: string) => ({
    ...state,
    school: { ...state.school, crest_url },
  }));

  private readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  readonly fetchCountries = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.Countries)
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

  readonly uploadCrest = this.effect((request$: Observable<File>) => {
    return request$.pipe(
      tap(() => this.setLoading(true)),
      switchMap((request) =>
        from(this.supabase.uploadCrest(request)).pipe(
          exhaustMap(({ data, error }) => {
            if (error) throw new Error(error.message);
            return of(data.path);
          })
        )
      ),
      tapResponse(
        (crest_path) => {
          this.setSchoolCrest(crest_path);
          this.updateSchool({ ...this.school(), crest_url: crest_path });
        },
        (error) => console.error(error)
      )
    );
  });

  readonly updateSchool = this.effect(
    (request$: Observable<Partial<School>>) => {
      return request$.pipe(
        tap(() => this.setLoading(true)),
        switchMap((request) => {
          const update = { ...request, updated_at: new Date() };
          return from(
            this.supabase.client
              .from(Table.Schools)
              .update(update)
              .eq('id', request.id)
          ).pipe(
            exhaustMap(({ data, error }) => {
              if (error) throw new Error(error?.message);
              return of(update);
            })
          );
        }),
        tapResponse(
          (school) => this.setSchool(school),
          (error) => console.error(error)
        )
      );
    }
  );

  ngrxOnStoreInit = () =>
    this.setState({
      school: this.currentSchool(),
      loading: true,
      countries: [],
    });
}
