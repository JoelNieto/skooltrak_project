import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { Subject } from '@skooltrak/models';
import { UtilService } from '@skooltrak/ui';
import { exhaustMap, from, of, tap } from 'rxjs';

type State = {
  subjects: Subject[];
  count: number;
  pages: number;
  loading: boolean;
};

@Injectable()
export class SchoolSubjectsStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  store = inject(Store);
  school = this.store.selectSignal(state.selectors.selectCurrentSchool);
  supabase = inject(SupabaseService);
  util = inject(UtilService);

  readonly subjects = this.selectSignal((state) => state.subjects);
  readonly count = this.selectSignal((state) => state.count);
  readonly pages = this.selectSignal((state) => state.pages);

  private setSubjects = this.updater((state, subjects: Subject[]) => ({
    ...state,
    subjects,
  }));
  private setCount = this.updater((state, count: number) => ({
    ...state,
    count,
    pages: this.util.getPages(count, 10),
  }));

  readonly fetchSubjects = this.effect(() => {
    return from(
      this.supabase.client
        .from('school_subjects')
        .select('id,name, short_name, code, description', { count: 'exact' })
        .eq('school_id', this.school()?.id)
    ).pipe(
      exhaustMap(({ data, error, count }) => {
        if (error) throw new Error(error.message);
        return of({ subjects: data, count });
      }),
      tap(({ count }) => this.setCount(count!)),
      tapResponse(
        ({ subjects }) => this.setSubjects(subjects as Subject[]),
        (error) => {
          console.error(error);
          return of([]);
        }
      )
    );
  });
  ngrxOnStoreInit = () =>
    this.setState({ subjects: [], loading: true, pages: 0, count: 0 });
}
