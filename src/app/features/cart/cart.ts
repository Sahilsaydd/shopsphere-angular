import { Component, OnInit } from '@angular/core';
import { Cart } from '../../core/services/cart';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];

  subtotal = 0;
  tax = 0;
  total = 0;

  constructor(private cartService: Cart) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCart();
    this.calculateTotals();
  }

  // ✅ INCREASE
  increaseQty(index: number) {
    this.cartService.updateQuantity(index, 'inc');
    this.loadCart();
  }

  // ✅ DECREASE
  decreaseQty(index: number) {
    this.cartService.updateQuantity(index, 'dec');
    this.loadCart();
  }

  // ✅ REMOVE
  removeItem(index: number) {
    this.cartService.removeItem(index);
    this.loadCart();
  }

  // ✅ TOTALS
  calculateTotals() {
    const totals = this.cartService.getTotals();
    this.subtotal = totals.subtotal;
    this.tax = totals.tax;
    this.total = totals.total;
  }
}