import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 🚫 1. Skip auth APIs (VERY IMPORTANT)
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/logout') ||
    req.url.includes('/auth/register')
  ) {
    return next(req);
  }

  let token = null;

  // 🔥 2. Detect admin APIs
  const isAdminApi =
    req.url.includes('/products') ||
    req.url.includes('/orders') ||
    req.url.includes('/users');

  if (isAdminApi) {
    token = localStorage.getItem('admin_access_token');
  } else {
    token = sessionStorage.getItem('user_access_token');
  }

  // 🔐 3. Attach token
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
