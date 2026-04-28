import { Component } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Navbar } from '../../shared/navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [Sidebar,Navbar ,RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
