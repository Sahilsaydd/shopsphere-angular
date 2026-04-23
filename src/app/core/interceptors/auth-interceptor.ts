import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('access_token');

  console.log('🚀 API Called:', req.url);
  console.log('Token:', token);

  // ❌ Skip auth APIs
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/logout') ||
    req.url.includes('/auth/register')
  ) {
    return next(req);
  }

  // ✅ Attach token
  if (token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Modified Headers:', modifiedReq.headers);
    return next(modifiedReq);
  }

  return next(req);
};
