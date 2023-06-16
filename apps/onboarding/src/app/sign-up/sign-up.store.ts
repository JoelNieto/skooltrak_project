import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { School, Table } from '@skooltrak/models';
import { exhaustMap, from, of } from 'rxjs';

type State = {
  schools: School[];
  error: boolean;
};

@Injectable()
export class SignUpStore extends ComponentStore<State> implements OnStoreInit {
  supabase = inject(SupabaseService);
  readonly schools = this.selectSignal((state) => state.schools);
  readonly error = this.selectSignal((state) => state.error);

  readonly fetchSchools = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.Schools)
        .select('id, full_name, short_name')
    )
      .pipe(
        exhaustMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data as unknown as School[]);
        })
      )
      .pipe(
        tapResponse(
          (schools) => this.patchState({ schools }),
          (error) => {
            console.error(error);
            this.patchState({ error: true });
          }
        )
      );
  });
  ngrxOnStoreInit = () => this.setState({ schools: [], error: false });
}
