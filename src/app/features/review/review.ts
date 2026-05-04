import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderService } from '../../core/services/order';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.html',
  styleUrls: ['./review.css']
})
export class ReviewComponent implements OnInit {
  imageBaseUrl = 'http://127.0.0.1:8000';

  product: any;
  quantity: number = 1;
  isLoading: boolean = false;

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
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? history.state;

    this.product = state?.['product'];
    this.quantity = state?.['quantity'] ?? 1;
    this.userData = state?.['user'] ?? { name: '', phone: '', address: '' };

    if (!this.product) {
      console.warn('No product data found in navigation state. Redirecting to shop.');
      this.router.navigate(['/shop']);
    }
  }

  get totalPrice(): number {
    return (this.product?.final_price ?? 0) * this.quantity;
  }

  resolveImage(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('assets/')) {
      return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.imageBaseUrl}${normalizedPath}`;
  }

  async placeOrder() {
    if (!this.userData.name || this.userData.name.length < 2) {
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid Name',
        text: 'Please enter a valid name (at least 2 characters).',
        confirmButtonColor: '#6366f1',
        background: '#1e1b4b',
        color: '#fff',
        customClass: { popup: 'swal-rounded' }
      });
      return;
    }

    if (!/^\+?\d{10,15}$/.test(this.userData.phone)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid Phone',
        text: 'Please enter a valid phone number (10-15 digits).',
        confirmButtonColor: '#6366f1',
        background: '#1e1b4b',
        color: '#fff',
        customClass: { popup: 'swal-rounded' }
      });
      return;
    }

    if (!this.userData.address || this.userData.address.length < 5) {
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid Address',
        text: 'Please enter a valid address (at least 5 characters).',
        confirmButtonColor: '#6366f1',
        background: '#1e1b4b',
        color: '#fff',
        customClass: { popup: 'swal-rounded' }
      });
      return;
    }

    this.isLoading = true;
    Swal.fire({
      title: 'Placing your order...',
      html: '<p style="color:rgba(255,255,255,0.7);margin:0">Please wait a moment</p>',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: '#1e1b4b',
      color: '#fff',
      didOpen: () => Swal.showLoading()
    });

    this.orderService
      .checkout(this.product.id, this.userData)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          Swal.close();
          this.router.navigate(['/order-success'], {
            state: {
              orderId: res?.order_id ?? res?.id ?? '',
              productName: this.product?.name ?? '',
              totalPrice: this.totalPrice,
              quantity: this.quantity
            }
          });
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Order Failed',
            text: err?.error?.detail ?? 'Something went wrong. Please try again.',
            confirmButtonColor: '#6366f1',
            background: '#1e1b4b',
            color: '#fff',
            customClass: { popup: 'swal-rounded' }
          });
        }
      });
  }
}
