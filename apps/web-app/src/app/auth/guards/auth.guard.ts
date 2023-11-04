import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '@skooltrak/auth';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(SupabaseService).session$.pipe(
    map((session) => {
      if (session) return true;
      return router.createUrlTree(['']);
    })
  );
};
