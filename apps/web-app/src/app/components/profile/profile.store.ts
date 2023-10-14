import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Gender, Table } from '@skooltrak/models';
import { exhaustMap, from, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  genders: Gender[];
  loading: boolean;
};

@Injectable()
export class ProfileFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  supabase = inject(SupabaseService);
  private auth = inject(authState.AuthStateFacade);

  readonly genders = this.selectSignal((state) => state.genders);

  readonly fetchGenders = this.effect(() => {
    return from(this.supabase.client.from(Table.Genders).select('id, name'))
      .pipe(
        exhaustMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data);
        })
      )
      .pipe(
        tapResponse(
          (genders) => this.patchState({ genders: genders as Gender[] }),
          (error) => console.error(error),
          () => this.patchState({ loading: false })
        )
      );
  });

  readonly uploadAvatar = this.effect((request$: Observable<File>) => {
    return request$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((request) =>
        from(this.supabase.uploadAvatar(request)).pipe(
          exhaustMap(({ data, error }) => {
            if (error) throw new Error(error.message);
            return of(data.path);
          })
        )
      ),
      tapResponse(
        (avatar_url) =>
          this.auth.updateProfile({ ...this.auth.USER(), avatar_url }),
        (error) => console.error(error),
        () => this.patchState({ loading: false })
      )
    );
  });

  ngrxOnStoreInit = () => this.setState({ genders: [], loading: true });
}
