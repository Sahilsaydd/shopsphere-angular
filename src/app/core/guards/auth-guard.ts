import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth);
  const router = inject(Router);

  const requiredRole = route.data['role'];


  if (!auth.isLoggedIn(requiredRole)) {
    router.navigate(['/login']);
    return false;
  }


  const userRole = auth.getUserRole(requiredRole);

  if (requiredRole && userRole !== requiredRole) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
