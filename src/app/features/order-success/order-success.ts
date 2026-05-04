import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-success.html',
  styleUrls: ['./order-success.css']
})
export class OrderSuccessComponent implements OnInit {
  orderId: string = '';
  productName: string = '';
  totalPrice: number = 0;
  quantity: number = 1;
  colors = ['#2f6fed', '#5b9bff', '#1e5bd8', '#60a5fa', '#3b82f6', '#f59e0b', '#34d399'];

  constructor(private router: Router) { }

  ngOnInit() {
    const state = history.state;
    this.orderId    = state?.['orderId']     ?? '';
    this.productName = state?.['productName'] ?? '';
    this.totalPrice  = state?.['totalPrice']  ?? 0;
    this.quantity    = state?.['quantity']    ?? 1;

    if (!this.orderId) {
      this.router.navigate(['/shop']);
    }
  }

  goToOrders() {
    this.router.navigate(['/user']);
  }

  continueShopping() {
    this.router.navigate(['/shop']);
  }
}
