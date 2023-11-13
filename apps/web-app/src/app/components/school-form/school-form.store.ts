import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Country, School, Table } from '@skooltrak/models';
import { AlertService } from '@skooltrak/ui';
import { EMPTY, from, map, Observable, switchMap, tap } from 'rxjs';

type State = {
  LOADING: boolean;
  COUNTRIES: Country[];
  SCHOOL: Partial<School> | undefined;
  CREST_URL: string | undefined;
};

@Injectable()
export class SchoolFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);
  private readonly alert = inject(AlertService);
  private readonly auth = inject(authState.AuthStateFacade);

  public readonly SCHOOL = this.selectSignal((state) => state.SCHOOL);
  public readonly COUNTRIES = this.selectSignal((state) => state.COUNTRIES);

  private readonly fetchCountries = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.Countries)
        .select('*')
        .order('name', { ascending: true }),
    )
      .pipe(
        map(({ error, data }) => {
          if (error) throw new Error(error.message);
          return data as Country[];
        }),
      )
      .pipe(
        tapResponse(
          (COUNTRIES) => this.patchState({ COUNTRIES }),
          (error) => console.error(error),
        ),
      );
  });

  public readonly uploadCrest = this.effect((request$: Observable<File>) => {
    return request$.pipe(
      tap(() => this.patchState({ LOADING: true })),
      switchMap((request) =>
        from(this.supabase.uploadCrest(request)).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data.path;
          }),
        ),
      ),
      tapResponse(
        (crest_url) =>
          this.patchState({ SCHOOL: { ...this.SCHOOL(), crest_url } }),
        (error) => console.error(error),
        () => this.patchState({ LOADING: false }),
      ),
    );
  });

  public readonly saveSchool = this.effect(
    (request$: Observable<Partial<School>>) => {
      return request$.pipe(
        tap(() => this.patchState({ LOADING: true })),
        switchMap((request) =>
          from(this.supabase.client.from(Table.Schools).upsert([request])).pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
              return EMPTY;
            }),
          ),
        ),
        tapResponse(
          () =>
            this.alert.showAlert({
              icon: 'success',
              message: 'School created!',
            }),
          (error: Error) =>
            this.alert.showAlert({ icon: 'error', message: error.message }),
          () => {
            this.patchState({ LOADING: false });
            this.auth.getProfiles();
          },
        ),
      );
    },
  );

  public ngrxOnStoreInit = (): void =>
    this.setState({
      SCHOOL: undefined,
      LOADING: false,
      COUNTRIES: [],
      CREST_URL: undefined,
    });
}
