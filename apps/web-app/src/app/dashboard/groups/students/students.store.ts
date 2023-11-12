import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { User } from '@skooltrak/models';

type State = {
  STUDENTS: Partial<User>[];
};
@Injectable()
export class GroupsStudentsStore extends ComponentStore<State> {}
