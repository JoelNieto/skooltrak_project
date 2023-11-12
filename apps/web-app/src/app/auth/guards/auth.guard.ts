import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '@skooltrak/auth';
import { map } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(SupabaseService).session$.pipe(
    map((session) => {
      if (session) return true;
      return router.createUrlTree(['']);
    }),
  );
};
