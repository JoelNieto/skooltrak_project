import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/store';
import { ClassGroup, SchoolProfile, Table } from '@skooltrak/models';
import { AlertService } from '@skooltrak/ui';
import {
  combineLatestWith,
  filter,
  from,
  map,
  Observable,
  switchMap,
} from 'rxjs';

type State = {
  LOADING: boolean;
  GROUPS: Partial<ClassGroup>[];
  USER_ID: undefined | string;
  CURRENT_GROUP_ID: string | undefined;
};

@Injectable()
export class SchoolPeopleFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly alert = inject(AlertService);

  public readonly GROUPS = this.selectSignal((state) => state.GROUPS);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly GROUP_ID = this.selectSignal(
    (state) => state.CURRENT_GROUP_ID,
  );
  public readonly GROUP_ID$ = this.select((state) => state.CURRENT_GROUP_ID);
  public readonly USER_ID$ = this.select((state) => state.USER_ID);
  public readonly USER_ID = this.selectSignal((state) => state.USER_ID);

  public readonly fetchGroups = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      filter(([, school_id]) => !!school_id),
      switchMap(([, school_id]) =>
        from(
          this.supabase.client
            .from(Table.Groups)
            .select(
              'id, name, plan:school_plans(*), plan_id, degree_id, teachers:users!group_teachers(id, first_name, father_name, email, avatar_url), degree:school_degrees(*), created_at, updated_at',
            )
            .eq('school_id', school_id),
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data as Partial<ClassGroup>[];
          }),
          tapResponse(
            (GROUPS) => this.patchState({ GROUPS }),
            (error) => console.error(error),
          ),
        ),
      ),
    );
  });

  public readonly savePerson = this.effect(
    (request$: Observable<Partial<SchoolProfile>>) =>
      request$.pipe(
        switchMap(({ status, role, user_id }) =>
          from(
            this.supabase.client
              .from(Table.SchoolUsers)
              .update({ status, role })
              .eq('user_id', user_id)
              .eq('school_id', this.auth.CURRENT_SCHOOL_ID()),
          ).pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
            }),
            tapResponse(
              () =>
                this.alert.showAlert({
                  icon: 'success',
                  message: 'ALERT.SUCCESS',
                }),
              (error: Error) => {
                console.error(error);
                this.alert.showAlert({
                  icon: 'error',
                  message: 'ALERT_FAILURE',
                });
              },
            ),
          ),
        ),
      ),
  );

  public readonly fetchStudentGroup = this.effect((trigger$) => {
    return trigger$.pipe(
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$, this.USER_ID$),
      filter(([, school_id, user_id]) => !!school_id && !!user_id),
      switchMap(([, school_id, user_id]) => {
        return from(
          this.supabase.client
            .from(Table.GroupStudents)
            .select('group_id, user_id, created_at')
            .eq('school_id', school_id)
            .eq('user_id', user_id),
        ).pipe(
          map(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          tapResponse(
            (data) => this.patchState({ CURRENT_GROUP_ID: data[0]?.group_id }),
            (error) => console.error(error),
          ),
        );
      }),
    );
  });

  public readonly saveGroup = this.effect((request$: Observable<string>) => {
    return request$.pipe(
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      switchMap(([group_id, school_id]) => {
        return from(
          this.supabase.client
            .from(Table.GroupStudents)
            .upsert([{ group_id, school_id, user_id: this.USER_ID() }]),
        ).pipe(
          map(({ error }) => {
            if (error) throw new Error(error.message);
          }),
          tapResponse(
            () => {
              this.patchState({ CURRENT_GROUP_ID: group_id });
            },
            (error) => console.error(error),
          ),
        );
      }),
    );
  });

  public ngrxOnStoreInit = (): void =>
    this.setState({
      LOADING: false,
      GROUPS: [],
      USER_ID: undefined,
      CURRENT_GROUP_ID: undefined,
    });
}
