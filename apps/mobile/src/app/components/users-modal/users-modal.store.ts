import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { User } from '@skooltrak/models';

type State = {
  FILTERED_USERS: Partial<User>[];
  SELECTED_USERS: Partial<User>[];
  QUERY_TEXT: string;
  LOADING: boolean;
};

export class UsersModalStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  public ngrxOnStoreInit = () =>
    this.setState({
      LOADING: false,
      FILTERED_USERS: [],
      QUERY_TEXT: '',
      SELECTED_USERS: [],
    });
}
