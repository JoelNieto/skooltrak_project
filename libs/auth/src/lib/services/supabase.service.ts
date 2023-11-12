import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@skooltrak/environments';
import { SignUpCredentials } from '@skooltrak/models';
import {
  AuthChangeEvent,
  AuthResponse,
  AuthTokenResponse,
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public client: SupabaseClient;

  constructor(@Inject(APP_CONFIG) private appConfig: AppConfig) {
    const {
      supabase: { url, key },
    } = appConfig;
    this.client = createClient(url, key);
  }

  public get session$(): Observable<Session | null> {
    return from(this.client.auth.getSession()).pipe(
      map(({ data }) => data.session),
    );
  }

  private authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.client.auth.onAuthStateChange(callback);
  }

  public signUp(request: SignUpCredentials): Promise<AuthResponse> {
    const { email, password, first_name, father_name } = request;
    return this.client.auth.signUp({
      email,
      password,
      options: { data: { first_name, father_name } },
    });
  }

  public inviteUser(email: string): void {
    this.client.auth.admin.inviteUserByEmail(email, {
      redirectTo: '',
      data: {},
    });
  }

  public signInWithEmail(
    email: string,
    password: string,
  ): Promise<AuthTokenResponse> {
    return this.client.auth.signInWithPassword({ email, password });
  }

  public resetPassword(email: string) {
    return this.client.auth.resetPasswordForEmail(email);
  }

  public signOut() {
    return this.client.auth.signOut();
  }

  public downLoadImage(path: string, bucket: 'avatars' | 'crests') {
    return this.client.storage.from(bucket).download(path);
  }

  public uploadAvatar(file: File) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;
    return this.client.storage.from('avatars').upload(filePath, file);
  }

  public uploadCrest(file: File) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;
    return this.client.storage.from('crests').upload(filePath, file);
  }
}
