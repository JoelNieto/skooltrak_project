import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@skooltrak/environments';
import { SignUpCredentials } from '@skooltrak/models';
import {
  AuthChangeEvent,
  AuthResponse,
  AuthTokenResponse,
  Session,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';
import { Observable, from, map } from 'rxjs';

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

  public updatePassword(password: string) {
    return this.client.auth.updateUser({ password });
  }

  public signOut() {
    return this.client.auth.signOut();
  }

  public downloadFile(path: string, bucket: string) {
    return this.client.storage.from(bucket).download(path);
  }

  public getFileURL(path: string, bucket: string) {
    return this.client.storage.from(bucket).getPublicUrl(path);
  }

  public createBucket(name: string) {
    return this.client.storage.createBucket(name);
  }

  public deleteImage(bucket: string, path: string) {
    this.client.storage.from(bucket).remove([path]);
  }

  public uploadPicture(file: File, bucket: string) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random() * 10}.${fileExt}`;

    return this.client.storage.from(bucket).upload(filePath, file);
  }
}
