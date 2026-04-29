import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let token = null;
  if(req.url.includes('/admin')){
    token = localStorage.getItem('admin_access_token');
  } else {
    token = localStorage.getItem('user_access_token');
  }

  console.log('🚀 API Called:', req.url);
  console.log('Token:', token);

 
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
