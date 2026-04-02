import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  login(email:string , password:string){

    email = email.trim()
    password = password.trim()

    if(email === "admin@gmail.com"  && password === "1234"){
       const fakeToken = 'jwt-token-abc-123'
        
       // store token 
       localStorage.setItem('token',fakeToken)

       return true
    }
    return false
  }

  logout(){
    localStorage.removeItem('token')
  }

  isLoggedIn():boolean {
    return !!localStorage.getItem('token')
  }

  getToken(){
    return localStorage.getItem('token')
  }
}
