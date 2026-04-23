import { Component, OnInit } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink,CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {

email =""
password =""
error =""

constructor(private auth:Auth ,private router:Router){}

ngOnInit():void {
  this.email = "";
  this.password = "";
  this.error = "";
  this.resetForm();
}
 resetForm() {
    this.email = "";
    this.password = "";
    this.error = "";
  }

onLogin() {
  this.auth.login(this.email, this.password).subscribe({
    next: () => {
      this.resetForm();
      const role = this.auth.getUserRole();

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    },
    error: () => {
      this.error = "Invalid Credentials";
    }
  });
}



}
