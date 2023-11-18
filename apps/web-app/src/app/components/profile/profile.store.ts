import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Gender, Table } from '@skooltrak/models';
import { from, map, Observable, switchMap, tap } from 'rxjs';

type State = {
  GENDERS: Gender[];
  LOADING: boolean;
};

@Injectable()
export class ProfileFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private supabase = inject(SupabaseService);
  private auth = inject(authState.AuthStateFacade);

  public readonly GENDERS = this.selectSignal((state) => state.GENDERS);

  private readonly fetchGenders = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() =>
        from(this.supabase.client.from(Table.Genders).select('id, name')).pipe(
          map(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          tapResponse(
            (GENDERS) => this.patchState({ GENDERS: GENDERS as Gender[] }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        ),
      ),
    );
  });

  public readonly uploadAvatar = this.effect((request$: Observable<File>) => {
    return request$.pipe(
      tap(() => this.patchState({ LOADING: true })),
      switchMap((request) =>
        from(this.supabase.uploadPicture(request, 'avatars')).pipe(
          map(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data.path;
          }),
          tapResponse(
            (avatar_url) =>
              this.auth.updateProfile({ ...this.auth.USER(), avatar_url }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        ),
      ),
    );
  });

  public ngrxOnStoreInit = (): void => {
    this.setState({ GENDERS: [], LOADING: true });
    this.fetchGenders();
  };
}
