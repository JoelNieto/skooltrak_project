import { Injectable } from '@angular/core';
import { environment } from '@skooltrak/environments';
import { Profile } from '@skooltrak/models';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public client: SupabaseClient;
  constructor() {
    this.client = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  profile() {
    return this.client
      .from('profile')
      .select(
        'id,full_name,avatar_url,email, profile_role(school(id,full_name),role(id,name))'
      )
      .single();
  }

  access() {
    return this.client.from('access').select('*');
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
