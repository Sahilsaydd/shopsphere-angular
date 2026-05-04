import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../../core/services/products';
import { Product } from '../../core/models/product';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from '../categories/categories';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule ,CategoriesComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  imageBaseUrl = 'http://127.0.0.1:8000';

  allTrendingProducts$!: Observable<Product[]>;
  visibleProducts$!: Observable<Product[]>;

  private currentIndex$ = new BehaviorSubject<number>(0);
  itemsPerPage = 4;

  constructor(private productService: Products) {}

  ngOnInit(): void {
    this.allTrendingProducts$ = this.productService.getProducts().pipe(
      map(data => data
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)
      ),
      tap(products => {
        console.log('Trending Products:', products);
      })
    );

    this.visibleProducts$ = this.currentIndex$.pipe(
      switchMap(currentIndex =>
        this.allTrendingProducts$.pipe(
          map(products => products.slice(
            currentIndex,
            currentIndex + this.itemsPerPage
          ))
        )
      )
    );
  }

  nextProducts() {
    this.allTrendingProducts$.subscribe(products => {
      const nextIndex = this.currentIndex$.value + this.itemsPerPage;
      if (nextIndex < products.length) {
        this.currentIndex$.next(nextIndex);
      }
    });
  }

  prevProducts() {
    const prevIndex = this.currentIndex$.value - this.itemsPerPage;
    if (prevIndex >= 0) {
      this.currentIndex$.next(prevIndex);
    }
  }

  get currentIndex(): number {
    return this.currentIndex$.value;
  }

  getFullStars(rating: number) {
    return Array.from({ length: Math.floor(rating) });
  }

  hasHalfStar(rating: number) {
    return rating % 1 >= 0.5;
  }

  resolveImage(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('assets/')) {
      return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.imageBaseUrl}${normalizedPath}`;
  }
}
