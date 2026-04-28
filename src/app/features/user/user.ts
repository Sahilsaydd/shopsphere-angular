import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Cart } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User implements OnInit {

  activeTab: 'overview' | 'cart' | 'orders' = 'overview';

  // User info decoded from JWT
  userEmail: string = '';
  userId: number = 0;
  userInitials: string = '';

  // Data
  cartItems: any[] = [];
  orders: any[] = [];

  // Loading states
  loadingCart = true;
  loadingOrders = true;

  constructor(
    private cartService: Cart,
    private orderService: OrderService,
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.decodeUserFromToken();
    this.fetchCart();
    this.fetchOrders();
    // Read ?tab=orders|cart|overview from query params (e.g. from order-success redirect)
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'orders' || tab === 'cart' || tab === 'overview') {
        this.activeTab = tab;
      }
    });
  }

  decodeUserFromToken() {
    try {
      const token = this.authService.getToken();
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userId = payload.sub ?? 0;
      this.userEmail = payload.email ?? '';
      // Generate initials from email (e.g. sahil@gmail.com → SA)
      const name = this.userEmail.split('@')[0];
      this.userInitials = name.length >= 2
        ? (name[0] + name[1]).toUpperCase()
        : name[0]?.toUpperCase() ?? '?';
    } catch {
      this.userEmail = '';
    }
  }

  fetchCart() {
    this.loadingCart = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        const raw = res?.items ?? [];
        // API nests product data under item.product — map it flat
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
        // Backend now returns enriched orders with product_name, total_price, name, phone, address
        this.orders = Array.isArray(data) ? data : data?.orders ?? [];
        this.loadingOrders = false;
      },
      error: () => { this.loadingOrders = false; }
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
