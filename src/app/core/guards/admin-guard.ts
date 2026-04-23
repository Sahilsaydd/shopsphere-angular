import { CanActivate ,CanActivateFn,Router } from "@angular/router";
import { inject, Inject } from "@angular/core";
import { Auth } from "../services/auth";


export const adminGuard: CanActivateFn = ()=>{

    const auth = inject(Auth);
    const router = inject(Router);

    const role  = auth.getUserRole();

    if(role === "admin"){
        return true
    }
    router.navigate(['/login'])
    return false
}
