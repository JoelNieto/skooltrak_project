import { Injectable } from '@angular/core';
import { environment } from '@skooltrak/environments';
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
      .from('profiles')
      .select('id,full_name,avatar_url,username')
      .single();
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.client.auth.onAuthStateChange(callback);
  }

  inviteUser(email: string) {
    this.client.auth.admin.inviteUserByEmail(email, {
      data: {},
    });
  }

  signInWithEmail(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.client.auth.signOut();
  }
}
