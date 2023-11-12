import { Inject, Injectable, signal } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@skooltrak/environments';
import { SchoolRole, SignUpCredentials } from '@skooltrak/models';
import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { from, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public client: SupabaseClient;
  currentRole = signal<SchoolRole | null>(null);
  private _CURRENT_SCHOOL_ID?: string;

  constructor(@Inject(APP_CONFIG) private appConfig: AppConfig) {
    const {
      supabase: { url, key },
    } = appConfig;
    this.client = createClient(url, key);
  }

  get session$() {
    return from(this.client.auth.getSession()).pipe(
      map(({ data }) => data.session),
    );
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.client.auth.onAuthStateChange(callback);
  }

  signUp(request: SignUpCredentials) {
    const { email, password, first_name, father_name } = request;
    return this.client.auth.signUp({
      email,
      password,
      options: { data: { first_name, father_name } },
    });
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

  downLoadImage(path: string, bucket: 'avatars' | 'crests') {
    return this.client.storage.from(bucket).download(path);
  }

  uploadAvatar(file: File) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;
    return this.client.storage.from('avatars').upload(filePath, file);
  }

  uploadCrest(file: File) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;
    return this.client.storage.from('crests').upload(filePath, file);
  }
}
