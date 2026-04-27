import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../core/services/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.html',
  styleUrls: ['./order.css'],
  standalone: true
})
export class Order implements OnInit {

  productId!: number;
  quantity!: number;

  userData = {
    name: '',
    phone: '',
    address: ''
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.queryParamMap.get('product_id'));
    this.quantity = Number(this.route.snapshot.queryParamMap.get('quantity'));

    this.userData.name = this.route.snapshot.queryParamMap.get('name') || '';
    this.userData.phone = this.route.snapshot.queryParamMap.get('phone') || '';
    this.userData.address = this.route.snapshot.queryParamMap.get('address') || '';
  }

  placeOrder() {
    this.orderService.checkout(this.productId, this.userData).subscribe({
      next: () => {
        alert('✅ Order placed successfully!');
      },
      error: () => {
        alert('❌ Order failed');
      }
    });
  }
}
