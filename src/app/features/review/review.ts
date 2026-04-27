import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.html',
})
export class ReviewComponent implements OnInit {

  product: any;
  quantity: number = 1;

  userData = {
    name: '',
    phone: '',
    address: ''
  };

  constructor(
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // ✅ FIX: Read the navigation state passed from product-details via router.navigate
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? history.state;

    this.product = state?.['product'];
    this.quantity = state?.['quantity'] ?? 1;
    this.userData = state?.['user'] ?? { name: '', phone: '', address: '' };

    // Guard: if no product data, go back to shop
    if (!this.product) {
      console.warn('No product data found in navigation state. Redirecting to shop.');
      this.router.navigate(['/shop']);
    }
  }

  get totalPrice(): number {
    return (this.product?.final_price ?? 0) * this.quantity;
  }

  placeOrder() {
    console.log("Sending payload:", this.userData);

    // Validation
    if (!this.userData.name || this.userData.name.length < 2) {
      alert("Enter valid name");
      return;
    }

    if (!/^\+?\d{10,15}$/.test(this.userData.phone)) {
      alert("Enter valid phone");
      return;
    }

    if (!this.userData.address || this.userData.address.length < 5) {
      alert("Enter valid address");
      return;
    }

    this.orderService
      .checkout(this.product.id, this.userData)
      .subscribe({
        next: (res) => {
          console.log("SUCCESS:", res);
          alert("Order placed successfully!");
          this.router.navigate(['/shop']);
        },
        error: (err) => {
          console.error("ERROR:", err);
          alert("Order failed!");
        }
      });
  }
}
