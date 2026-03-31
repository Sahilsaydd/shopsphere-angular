import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
    {path:"",loadComponent: ()=> import('./features/home/home').then((m)=>m.Home) ,  runGuardsAndResolvers: 'always' },
    {
        path:"shop",
        loadComponent:()=> import('./features/shop/shop').then((m)=>m.Shop)
    },
    {
        path:"cart",
        loadComponent:()=> import('./features/cart/cart').then((m)=>m.Cart)
    },
  
    {
        path:"user",
        loadComponent: ()=> import('./features/user/user').then((m)=>m.User)
    },
    {
        path:"wishlist",
        loadComponent: ()=>import('./features/wishlist/wishlist').then((m)=>m.Wishlist)
    }
];
