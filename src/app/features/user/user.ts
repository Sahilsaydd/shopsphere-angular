import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Cart } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { Auth } from '../../core/services/auth';
import { email } from '@angular/forms/signals';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User implements OnInit {

  activeTab: 'overview' | 'cart' | 'orders' = 'overview';

  userDetails: any = null;

  userInitials: string = '';
  cartItems: any[] = [];
  orders: any[] = [];

  loadingCart = true;
  loadingOrders = true;

  constructor(
    private cartService: Cart,
    private orderService: OrderService,
    private authService: Auth,

    private router: Router,
    private route: ActivatedRoute,
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.fetchCart();
    this.fetchOrders();
    this.fetchUserDetails()
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'orders' || tab === 'cart' || tab === 'overview') {
        this.activeTab = tab;
      }
    });
  }



  fetchCart() {
    this.loadingCart = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        const raw = res?.items ?? [];
        this.cartItems = raw.map((item: any) => ({
          productId: item.product?.id ?? null,
          name:      item.product?.name ?? 'Unknown Product',
          category:  item.product?.category ?? '',
          image:     item.product?.image ?? '',
          price:     Number(item.product?.price ?? 0),
          quantity:  Number(item.quantity ?? 1)
        }));
        this.loadingCart = false;
      },
      error: () => { this.loadingCart = false; }
    });
  }

  fetchOrders() {
    this.loadingOrders = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = Array.isArray(data) ? data : data?.orders ?? [];
        this.loadingOrders = false;
          this.cdr.detectChanges();
      },

      error: () => { this.loadingOrders = false; }
    });
  }

fetchUserDetails() {
  this.authService.getUserDetails().subscribe({
    next: (res) => {
      console.log("User API:", res);

      this.userDetails = res

      if (res.name && res.name.trim().length > 0) {
        const parts = res.name.trim().split(' ');

        if (parts.length >= 2) {
          this.userInitials =
            (parts[0][0] + parts[1][0]).toUpperCase();
        } else {
          this.userInitials = parts[0][0].toUpperCase();
        }

      } else if (this.userDetails.email) {
        const name = this.userDetails.email.split('@')[0];
        this.userInitials =
          name.length >= 2
            ? (name[0] + name[1]).toUpperCase()
            : name[0]?.toUpperCase() ?? '?';
      }
      this.cdr.detectChanges();
    },

    error: (err) => {
      console.error("User API error:", err);
    }
  });
}


  setTab(tab: 'overview' | 'cart' | 'orders') {
    this.activeTab = tab;
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getStatusClass(status: string): string {
    const s = (status ?? '').toLowerCase();
    if (s === 'delivered') return 'status-delivered';
    if (s === 'shipped') return 'status-shipped';
    if (s === 'cancelled') return 'status-cancelled';
    return 'status-pending';
  }

  goToProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
