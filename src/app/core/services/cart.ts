import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartActionResponse, CartItem ,CartProduct } from '../models/cart_model';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  private apiUrl = 'http://127.0.0.1:8000/cart';

  constructor(private http: HttpClient) {}

  addToCart(product_id: number, quantity: number): Observable<CartProduct> {
    return this.http.post<CartProduct>(`${this.apiUrl}/add`, {
      product_id,
      quantity
    });
  }

getCart(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/`);
}
  removeItem(product_id: number): Observable<CartActionResponse> {
    return this.http.delete(`${this.apiUrl}/remove/${product_id}`);
  }

  clearCart(): Observable<CartActionResponse> {
    return this.http.delete(`${this.apiUrl}/clear`);
  }
}
