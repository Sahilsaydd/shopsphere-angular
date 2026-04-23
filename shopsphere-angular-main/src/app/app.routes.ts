import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {path:"",loadComponent: ()=> import('./features/home/home').then((m)=>m.Home) ,  runGuardsAndResolvers: 'always' },
    {
        path:"shop",
        loadComponent:()=> import('./features/shop/shop').then((m)=>m.Shop ),canActivate:[authGuard]
    },
    {
        path:"cart",
        loadComponent:()=> import('./features/cart/cart').then((m)=>m.CartComponent),canActivate:[authGuard]
    },
  
    {
        path:"user",
        loadComponent: ()=> import('./features/user/user').then((m)=>m.User)
    },
    {
        path:"wishlist",
        loadComponent: ()=>import('./features/wishlist/wishlist').then((m)=>m.Wishlist),canActivate:[authGuard]
    },
    {
        path:"login",
        loadComponent: ()=>import('./features/login/login').then((m)=>m.Login)
    }
];
