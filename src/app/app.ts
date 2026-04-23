import { Component, signal } from '@angular/core';
import { RouterOutlet ,Router} from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { routes } from '../../shopsphere-angular-main/src/app/app.routes';
import { NgIf } from "../../node_modules/@angular/common/types/_common_module-chunk";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor(public router:Router) {}

  hideLayout():boolean{
    return this.router.url.includes('/login') || this.router.url.includes('/register') || this.router.url.includes('/admin');
  }
}
