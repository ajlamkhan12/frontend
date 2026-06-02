import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { CartApiService } from './api.service';
import { CartSummary } from '../models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _cart = signal<CartSummary | null>(null);
  readonly cart = this._cart.asReadonly();
  readonly itemCount = computed(() => this._cart()?.totalItems ?? 0);

  constructor(private api: CartApiService, private auth: AuthService) {
    if (this.auth.isLoggedIn()) this.loadCart();
  }

  loadCart() {
    this.api.get().subscribe(r => { if (r.success) this._cart.set(r.data); });
  }

  addToCart(productId: number, quantity = 1) {
    return this.api.add(productId, quantity).pipe(tap(r => { if (r.success) this._cart.set(r.data); }));
  }

  updateItem(itemId: number, quantity: number) {
    return this.api.update(itemId, quantity).pipe(tap(r => { if (r.success) this._cart.set(r.data); }));
  }

  removeItem(itemId: number) {
    return this.api.remove(itemId).pipe(tap(r => { if (r.success) this._cart.set(r.data); }));
  }

  clearCart() { this._cart.set(null); }
}