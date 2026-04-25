import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Cart } from '../../core/services/cart';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../core/models/cart_model';

interface UiCartItem {
  productId: number | null;
  removeId: number | null;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
}


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent implements OnInit {

  cartItems: UiCartItem[] = [];

  subtotal = 0;
  tax = 0;
  total = 0;

  constructor(private cartService: Cart, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (res) => {

        const items = res.items || [];

        this.cartItems = items.map((item: any) => ({
          productId: item.product.id,
          removeId: item.product.id,
          name: item.product.name,
          category: item.product.category,
          description: item.product.description,
          image: item.product.image,
          price: Number(item.product.price),
          quantity: Number(item.quantity)
        }));

        this.subtotal = res.total_price || 0;
        this.tax = this.subtotal * 0.08;
        this.total = this.subtotal + this.tax;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Cart load failed', err);
        this.cartItems = [];
        this.cdr.detectChanges();
      }
    });
  }

  increaseQty(item: UiCartItem) {
    this.cartService.addToCart(item.productId!, 1).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error(err)
    });
  }

  decreaseQty(item: UiCartItem) {
    if (item.quantity <= 1) {
      this.removeItem(item);
      return;
    }

    // ✅ FIXED LOGIC
    this.cartService.addToCart(item.productId!, -1).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error(err)
    });
  }

  removeItem(item: UiCartItem) {
    this.cartService.removeItem(item.productId!).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error(err)
    });
  }
}
