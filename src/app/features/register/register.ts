

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { email } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ FormsModule,RouterLink,CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {

  name = '';
  email = '';
  password = '';
  role = 'user';
  error = '';
  loding = false;
  constructor(private auth:Auth, private router:Router){}

  ngOnInit() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.role = 'user';
    this.error = '';
    this.loading = false;
  }

loading = false;

onRegister() {
  if (!this.name || !this.email || !this.password) return;

  this.loading = true;

  const data = {
    name: this.name,
    email: this.email,
    password: this.password,
    role: this.role
  };

  this.auth.register(data).subscribe({
    next: () => {
      this.loading = false;
      alert("Registration Successful! Please Login.");
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.loading = false;
      this.error = err.error?.detail || "Registration Failed";
    }
  });
}
}
