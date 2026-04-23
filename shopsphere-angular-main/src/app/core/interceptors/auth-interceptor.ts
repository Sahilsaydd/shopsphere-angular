import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  let modifiedReq =req
    console.log('🚀 API Called:', req.url);
    console.log('Token:', token);
    
    console.log('Modified Headers:', modifiedReq.headers);
    // add token if exits 
    if(token){
      modifiedReq =req.clone({
        setHeaders:{
          Authorization: `Bearer ${token}`
        }
      })
    }
  return next(modifiedReq);
};
