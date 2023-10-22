import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { RoleEnum, School, Table } from '@skooltrak/models';
import { AlertService, ConfirmationService } from '@skooltrak/ui';
import {
  catchError,
  filter,
  from,
  map,
  Observable,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

type State = {
  ROLE: RoleEnum | undefined;
  LOADING: boolean;
};

@Injectable()
export class SchoolConnectorStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);
  private confirmation = inject(ConfirmationService);
  private alertService = inject(AlertService);
  private readonly auth = inject(authState.AuthStateFacade);

  private readonly ROLE$ = this.select((state) => state.ROLE);

  public readonly fetchSchoolByCode = this.effect(
    (code$: Observable<string>) => {
      return code$.pipe(
        tap(() => this.patchState({ LOADING: true })),
        switchMap((code) =>
          from(
            this.supabase.client
              .from(Table.Schools)
              .select('id,short_name, full_name, crest_url')
              .eq('code', code)
              .single()
          ).pipe(
            map(({ error, data }) => {
              if (error || !data) throw new Error(error.message);
              return data;
            }),
            switchMap((school) =>
              this.confirmation
                .openDialog({
                  title: school.full_name,
                  icon: 'heroCheckCircle',
                  description: `Do you one to link to this school`,
                  showCancelButton: true,
                  cancelButtonText: 'Not',
                  confirmButtonText: 'Yes, confirm',
                  color: 'green',
                })
                .pipe(
                  filter((response) => !!response),
                  map(() => this.addSchoolConnection(school))
                )
            ),
            catchError(() =>
              this.confirmation.openDialog({
                title: 'Wrong code!',
                description:
                  "This code doesn't belong to any school. Try again",
                icon: 'heroXCircle',
                showCancelButton: false,
                confirmButtonText: 'OK',
                color: 'red',
              })
            )
          )
        )
      );
    }
  );

  private readonly addSchoolConnection = this.effect(
    (request$: Observable<Partial<School>>) => {
      return request$.pipe(
        tap(() => this.patchState({ LOADING: true })),
        withLatestFrom(this.ROLE$),
        switchMap(([request, ROLE]) =>
          from(
            this.supabase.client
              .from(Table.SchoolUsers)
              .insert([{ role: ROLE, school_id: request.id }])
          ).pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
            })
          )
        ),
        tapResponse(
          () => {
            this.alertService.showAlert({
              icon: 'success',
              message: 'School connected successfully!',
            });
            this.auth.getProfiles();
          },
          (error: string) => {
            console.error(error);
            this.alertService.showAlert({
              icon: 'error',
              message: 'ALERT.FAILURE',
            });
          },
          () => this.patchState({ LOADING: false })
        )
      );
    }
  );

  public ngrxOnStoreInit = (): void =>
    this.setState({ LOADING: false, ROLE: undefined });
}
