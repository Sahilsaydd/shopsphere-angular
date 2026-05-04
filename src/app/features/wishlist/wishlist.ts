import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css'],
})
export class Wishlist implements OnInit {
  imageBaseUrl = 'http://127.0.0.1:8000';

  wishlistItems: any[] = [];

  showModal = false;
  selectedIndex: number | null = null;

  constructor(private wishlist: WishlistService) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistItems = this.wishlist.getItems();
  }

  openRemoveConfirm(index: number) {
    this.selectedIndex = index;
    this.showModal = true;
  }

  confirmRemove() {
    if (this.selectedIndex !== null) {
      this.wishlist.remove(this.selectedIndex);
      this.loadWishlist();
    }
    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.selectedIndex = null;
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
