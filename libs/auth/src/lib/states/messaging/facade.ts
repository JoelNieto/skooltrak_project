import { computed, inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { orderBy } from 'lodash';

import { MessageActions } from './actions';
import * as selectors from './selectors';

@Injectable({ providedIn: 'root' })
export class MessagingStateFacade {
  private readonly store = inject(Store);

  public CHATS = this.store.selectSignal(selectors.selectChats);
  public SORTED_CHARTS = computed(() =>
    orderBy(this.CHATS(), ['last_message'], ['desc']),
  );
  public SELECTED_ID = this.store.selectSignal(selectors.selectCurrentId);
  public selected_id$ = this.store.select(selectors.selectCurrentId);
  public LOADING = this.store.selectSignal(selectors.selectLoading);
  public SELECTED = this.store.selectSignal(selectors.selectCurrentChat);

  public getMessages(): void {
    this.store.dispatch(MessageActions.getChats());
  }

  public newChat(ids: string[]): void {
    this.store.dispatch(MessageActions.newChat({ ids }));
  }

  public setCurrentChat(id: string): void {
    this.store.dispatch(MessageActions.setCurrentChat({ id }));
  }
}
