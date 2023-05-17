import { Injectable, signal } from '@angular/core';
import { environment } from '@skooltrak/environments';
import { Profile, UserRole } from '@skooltrak/models';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { from, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public client: SupabaseClient;
  _session: AuthSession | null = null;
  currentRole = signal<UserRole | null>(null);
  constructor() {
    this.client = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  get session() {
    return from(this.client.auth.getSession()).pipe(map((x) => x.data.session));
  }

  get roles() {
    return this.profile.pipe(
      map((x) => x?.profile_role as unknown as UserRole[]),
      tap((roles) => console.log(roles[0])),
      tap((roles) => this.currentRole.set(roles[0]))
    );
  }

  get profile() {
    return from(this._profile()).pipe(map((x) => x.data));
  }

  private _profile() {
    return this.client
      .from('profile')
      .select(
        'id,full_name,avatar_url,email, profile_role(school(id,full_name,short_name,logo_url),role(id,name,role_access(access(*))))'
      )
      .single();
  }

  async updateUser(profile: Profile) {
    const { id, email, full_name } = profile;
    const update = {
      ...{ id, email, full_name },
      updated_at: new Date(),
    };

    const { password } = profile;

    await this.client.auth.updateUser({ password, email });

    return this.client.from('profile').upsert(update);
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.client.auth.onAuthStateChange(callback);
  }

  inviteUser(email: string) {
    this.client.auth.admin.inviteUserByEmail(email, {
      redirectTo: '',
    });
  }

  signInWithEmail(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.client.auth.signOut();
  }
}
