import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 🚫 Skip auth APIs
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

  // 🔥 ONLY treat ADMIN actions as admin
  const isAdminApi =
    (req.url.includes('/products') && req.method !== 'GET') || // create/update/delete
    req.url.includes('/admin');

  if (isAdminApi) {
    token = adminToken;
  } else {
    token = userToken;
  }

  // 🔐 Attach token
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
