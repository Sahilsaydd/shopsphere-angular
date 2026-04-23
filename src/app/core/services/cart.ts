import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  private storageKey = 'cart_items';

  //  GET CART
  getCart() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  //  ADD TO CART (latest first)
  addToCart(product: any) {
    let cart = this.getCart();

    const newItem = {
      ...product,
      quantity: 1,
      addedAt: new Date()
    };

    cart.unshift(newItem); // latest on top

    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  //  REMOVE
  removeItem(index: number) {
    let cart = this.getCart();
    cart.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  //  UPDATE QTY
  updateQuantity(index: number, type: 'inc' | 'dec') {
    let cart = this.getCart();

    if (type === 'inc') {
      cart[index].quantity++;
    } else if (type === 'dec' && cart[index].quantity > 1) {
      cart[index].quantity--;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  //  TOTAL CALC
  getTotals() {
    const cart = this.getCart();

    const subtotal = cart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const tax = subtotal * 0.08;

    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  }
}
