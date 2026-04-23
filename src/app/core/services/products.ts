import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class Products {

  private url = 'http://127.0.0.1:8000/products';

  constructor(private http: HttpClient) {}

  // ✅ Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  // ✅ Search products
  searchProducts(keyword: string, category?: string): Observable<Product[]> {
    let url = `${this.url}/search/?keyword=${keyword}`;

    if (category) {
      url += `&category=${category}`;
    }

    return this.http.get<Product[]>(url);
  }
}
