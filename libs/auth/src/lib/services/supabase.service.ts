import { Injectable, signal } from '@angular/core';
import { environment } from '@skooltrak/environments';
import { Link, SchoolRole, User } from '@skooltrak/models';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { filter, from, map, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public client: SupabaseClient;
  currentRole = signal<SchoolRole | null>(null);
  private _currentSchoolId?: string;

  constructor() {
    this.client = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  get session() {
    return from(this.client.auth.getSession()).pipe(
      map(({ data }) => data.session)
    );
  }

  get user() {
    return this.session.pipe(
      filter((session) => !!session),
      switchMap((session) =>
        from(this._getUserInfo(session!.user.id)).pipe(
          switchMap(({ data, error }) => {
            if (error) throw new Error(error.message);
            return of(data);
          })
        )
      )
    );
  }

  get roles() {
    return this.session.pipe(
      filter((session) => !!session),
      switchMap((session) =>
        from(
          this.client
            .from('school_users')
            .select('schools(*), roles(id, name, code)')
            .eq('user_id', session?.user.id)
        ).pipe(
          switchMap(({ data, error }) => {
            if (error) throw new Error(error.message);
            return of(data);
          })
        )
      ),
      tap((roles) => {
        !!roles && this.currentRole.set(roles[0] as SchoolRole);
      })
    );
  }

  getLinks() {
    console.log('called');
    return from(
      this.client
        .from('role_links')
        .select('links(*)')
        .eq('role_id', '001d434b-5946-476a-a3e6-6b4692f1f699')
    ).pipe(
      switchMap(({ data, error }) => {
        console.log(data);
        console.log(error);
        if (error) throw new Error(error.message);
        return of(data as Link[]);
      })
    );
  }

  get links() {
    const role_id = this.currentRole()?.roles?.id;
    if (role_id) {
      return from(this.client.from('role_links').select('links(*)')).pipe(
        switchMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data);
        })
      );
    } else {
      return of([]);
    }
  }

  private _getUserInfo(id: string) {
    return this.client
      .from('users')
      .select(
        'email, full_name, avatar_url, school_users(schools(id, short_name), roles(name, code))'
      )
      .eq('id', id)
      .single();
  }

  async updateUser(user: User) {
    const { id, email, full_name, avatar_url } = user;
    const update = {
      ...{ id, email, full_name, avatar_url },
      updated_at: new Date(),
    };

    const { password } = user;

    await this.client.auth.updateUser({ password, email });

    return this.client.from('users').upsert(update);
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.client.auth.onAuthStateChange(callback);
  }

  inviteUser(email: string) {
    this.client.auth.admin.inviteUserByEmail(email, {
      redirectTo: '',
      data: {},
    });
  }

  signInWithEmail(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.client.auth.signOut();
  }

  downLoadImage(path: string) {
    return this.client.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.client.storage.from('avatars').upload(filePath, file);
  }
}
