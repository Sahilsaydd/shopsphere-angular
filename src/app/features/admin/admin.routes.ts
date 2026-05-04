import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin-guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout').then(m => m.AdminLayout),

    canActivate: [adminGuard], 


    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile').then(m => m.Profile)
      },
      {
        path: 'product/all',
        loadComponent: () =>
          import('./components/product_component/all-products/all-products')
            .then(m => m.AllProducts)
      },
      {
        path:'product/add',
        loadComponent:()=>
          import('./components/product_component/add-product/add-product').then(m=>m.AddProduct)
      }
        ,{
          path: 'product_component/update-product/:id',
          loadComponent: () =>
            import('./components/product_component/update-product/update-product')
              .then(m => m.UpdateProduct)
        }

      ,{
        path:'product/delete',
        loadComponent:()=>
          import('./components/product_component/delete-product/delete-product').then(m=>m.DeleteProduct)
      }
    ]
  }
];
