import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private key = 'wishlist';

  getItems() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

add(item: any) {
  let list = this.getItems();

  // 🔥 ensure id exists
  const newItem = {
    ...item,
    id: item.id || Date.now() // fallback id
  };

  const exists = list.find((p: any) => p.id === newItem.id);

  if (!exists) {
    list.unshift(newItem);
    localStorage.setItem(this.key, JSON.stringify(list));
  }
}

  remove(index: number) {
    const list = this.getItems();
    list.splice(index, 1);
    localStorage.setItem(this.key, JSON.stringify(list));
  }
}