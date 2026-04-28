import { Routes } from '@angular/router';

import { adminGuard } from '../../core/guards/admin-guard'; 
import { AdminLayout } from './layout/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/dashboard').then(m => m.Dashboard)
      }
    ]
  }
];