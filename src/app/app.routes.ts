import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {path:"",loadComponent: ()=> import('./features/home/home').then((m)=>m.Home) ,  runGuardsAndResolvers: 'always' },
    {
      path:'register',
      loadComponent:()=> import('./features/register/register').then((m)=>m.Register)

    },
    {
        path:"shop",
        loadComponent:()=> import('./features/shop/shop').then((m)=>m.Shop ),canActivate:[authGuard]
    },
    {
      path: "product/:id",
      loadComponent:()=>import('./features/product-details/product-details').then((m)=>m.ProductDetails),canActivate:[authGuard]
    },
    {
        path:"cart",
        loadComponent:()=> import('./features/cart/cart').then((m)=>m.CartComponent),canActivate:[authGuard]
    },
    {
      path:"order_products",
      loadComponent:()=> import('./features/order/order').then((m)=>m.Order),canActivate:[authGuard]
    },
      {
    path: 'review',
    loadComponent: () =>
      import('./features/review/review').then(m => m.ReviewComponent)
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
    },
    {
      path: 'admin',
      loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    }
];
