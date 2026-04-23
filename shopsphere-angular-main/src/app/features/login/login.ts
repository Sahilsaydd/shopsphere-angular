import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

email =""
password =""
error =""

constructor(private auth:Auth ,private router:Router){}

onLogin(){
  const success = this.auth.login(this.email,this.password)
  console.log('Email:', this.email);
  console.log('Password:', this.password);
  
    if(success){
      this.router.navigate(['/shop'])
    } else{
      this.error= "Invalid Credentials"
    }
}

}
