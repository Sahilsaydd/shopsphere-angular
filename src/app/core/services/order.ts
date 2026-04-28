import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckoutData } from '../models/checkout';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://127.0.0.1:8000/orders';

  constructor(private http: HttpClient) {}

  // Checkout single product
  checkout(productId: number, data: CheckoutData): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout/${productId}`, data);
  }

  // Get all orders for the logged-in user
  getOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  // Get single order details
  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`);
  }
}

