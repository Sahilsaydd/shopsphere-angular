import { CanActivate ,CanActivateFn,Router } from "@angular/router";
import { inject, Inject } from "@angular/core";
import { Auth } from "../services/auth";


export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isLoggedIn('admin')) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
