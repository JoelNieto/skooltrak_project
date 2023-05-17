import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  Router,
} from '@angular/router';

import { SupabaseService } from '../services/supabase.service';

export const BackOfficeGuard: CanActivateChildFn = (
  state: ActivatedRouteSnapshot
) => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  return (
    !!supabase.profile ??
    router.createUrlTree(['/'], { queryParams: { redirectURL: state.url } })
  );
};
