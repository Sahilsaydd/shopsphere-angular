import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {


  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/logout') ||
    req.url.includes('/auth/register')
  ) {
    return next(req);
  }

  const adminToken = localStorage.getItem('admin_access_token');
  const userToken = sessionStorage.getItem('user_access_token');

  let token = null;


  const isAdminApi =
    (req.url.includes('/products') && req.method !== 'GET') || req.url.includes('/admin');

  if (isAdminApi) {
    token = adminToken;
  } else {
    token = userToken;
  }

  if (token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('📡 API:', req.url);
    console.log('🔐 Token used:', isAdminApi ? 'ADMIN' : 'USER');

    return next(modifiedReq);
  }

  return next(req);
};
