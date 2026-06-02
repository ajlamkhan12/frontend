import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CouponApiService } from '../../core/services/api.service';
import { CartSummary } from '../../core/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mt-2">
      <div class="cart-layout">
        <!-- Cart Items -->
        <div class="cart-items">
          <div class="section-header">
            <h2>My Cart ({{ cart()?.totalItems || 0 }})</h2>
          </div>

          @if (!cart()?.items?.length) {
            <div class="empty-cart">
              <h3>🛒 Your cart is empty!</h3>
              <p>Add items to it now</p>
              <button routerLink="/products">Shop Now</button>
            </div>
          } @else {
            @for (item of cart()!.items; track item.id) {
              <div class="cart-item">
                <img [src]="item.thumbnailUrl || 'https://placehold.co/120x120'" [alt]="item.productName" class="item-img"
                  [routerLink]="['/products']">
                <div class="item-details">
                  <div class="item-name">{{ item.productName }}</div>
                  <div class="item-brand text-secondary">{{ item.brand }}</div>
                  <div class="item-price">
                    <span class="discounted-price">₹{{ item.discountedPrice | number }}</span>
                    @if (item.discountPercent > 0) {
                      <span class="original-price">₹{{ item.originalPrice | number }}</span>
                      <span class="discount-percent">{{ item.discountPercent }}% off</span>
                    }
                  </div>
                  <div class="item-actions">
                    <div class="qty-control">
                      <button (click)="updateQty(item.id, item.quantity - 1)" [disabled]="item.quantity <= 1">-</button>
                      <span>{{ item.quantity }}</span>
                      <button (click)="updateQty(item.id, item.quantity + 1)" [disabled]="item.quantity >= item.stock">+</button>
                    </div>
                    <button (click)="removeItem(item.id)" class="remove-btn">
                      ✕ REMOVE
                    </button>
                  </div>
                </div>
                <div class="item-total">₹{{ item.itemTotal | number }}</div>
              </div>
            }

            <!-- Coupon -->
            <div class="coupon-section">
              <h3>Apply Coupon</h3>
              <div class="coupon-input">
                <input matInput placeholder="Enter coupon code" [(ngModel)]="couponCode">
                <button mat-raised-button color="primary" (click)="applyCoupon()">Apply</button>
              </div>
              @if (couponMessage()) {
                <p [style.color]="couponValid() ? 'green' : 'red'">{{ couponMessage() }}</p>
              }
            </div>
          }
        </div>

        <!-- Order Summary -->
        @if (cart()?.items?.length) {
          <div class="order-summary">
            <h3>PRICE DETAILS</h3>
            <hr style="margin:12px 0" />
            <div class="summary-row">
              <span>Price ({{ cart()!.totalItems }} items)</span>
              <span>₹{{ cart()!.subTotal | number }}</span>
            </div>
            <div class="summary-row success">
              <span>Discount</span>
              <span>-₹{{ cart()!.discount | number }}</span>
            </div>
            <div class="summary-row">
              <span>Delivery Charges</span>
              <span [class.success]="cart()!.shippingCharge === 0">
                {{ cart()!.shippingCharge === 0 ? 'FREE' : '₹' + cart()!.shippingCharge }}
              </span>
            </div>
            @if (couponDiscount() > 0) {
              <div class="summary-row success">
                <span>Coupon Discount</span>
                <span>-₹{{ couponDiscount() | number }}</span>
              </div>
            }
            <hr style="margin:12px 0" />
            <div class="summary-row total">
              <strong>Total Amount</strong>
              <strong>₹{{ (cart()!.total - couponDiscount()) | number }}</strong>
            </div>
            <div class="savings-info">
              You will save ₹{{ (cart()!.discount + couponDiscount()) | number }} on this order
            </div>
            <button mat-raised-button class="btn-accent w-100 mt-2" routerLink="/checkout">
              PLACE ORDER
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart-layout { display: grid; grid-template-columns: 1fr 320px; gap: 16px; align-items: start; }
    .cart-items { background: white; border-radius: 4px; overflow: hidden; }
    .cart-item { display: flex; gap: 16px; padding: 24px; border-bottom: 1px solid var(--border); }
    .item-img { width: 112px; height: 112px; object-fit: contain; border: 1px solid var(--border); border-radius: 4px; }
    .item-details { flex: 1; }
    .item-name { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
    .item-brand { font-size: 13px; margin-bottom: 8px; }
    .item-price { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .discounted-price { font-size: 20px; font-weight: 600; }
    .original-price { font-size: 14px; color: var(--text-secondary); text-decoration: line-through; }
    .discount-percent { font-size: 14px; color: var(--success); font-weight: 600; }
    .item-actions { display: flex; align-items: center; gap: 16px; }
    .qty-control { display: flex; align-items: center; gap: 0; border: 1px solid var(--border); border-radius: 2px; }
    .qty-control button { width: 32px; height: 32px; border: none; background: none; font-size: 18px; cursor: pointer; }
    .qty-control button:disabled { opacity: 0.3; }
    .qty-control span { width: 40px; text-align: center; font-weight: 600; }
    .item-total { font-size: 18px; font-weight: 600; min-width: 80px; text-align: right; }
    .coupon-section { padding: 16px 24px; border-top: 1px solid var(--border); }
    .coupon-section h3 { font-size: 14px; font-weight: 600; margin-bottom: 12px; }
    .coupon-input { display: flex; gap: 12px; }
    .coupon-input input { flex: 1; border: 1px dashed var(--border); border-radius: 2px; padding: 8px 12px; outline: none; font-size: 14px; }
    .empty-cart { text-align: center; padding: 60px; }
    .empty-cart { text-align: center; padding: 60px 20px; }
    .empty-cart h3 { font-size: 24px; margin: 16px 0 8px; }
    .order-summary { background: white; border-radius: 4px; padding: 24px; position: sticky; top: 80px; }
    .order-summary h3 { font-size: 12px; color: var(--text-secondary); font-weight: 600; margin-bottom: 16px; }
    .summary-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 15px; }
    .summary-row.success { color: var(--success); }
    .summary-row.total { font-size: 17px; padding: 16px 0; }
    .savings-info { background: #e8f5e9; color: var(--success); padding: 12px; border-radius: 4px; font-size: 14px; font-weight: 600; text-align: center; margin-top: 16px; }
    @media (max-width: 768px) { .cart-layout { grid-template-columns: 1fr; } }
  `]
})
export class CartComponent implements OnInit {
  couponCode = '';
  couponMessage = signal('');
  couponValid = signal(false);
  couponDiscount = signal(0);

  get cart() { return this.cartService.cart; }

  constructor(
    private cartService: CartService,
    private couponApi: CouponApiService
  ) {}

  ngOnInit() { this.cartService.loadCart(); }

  updateQty(itemId: number, qty: number) {
    if (qty <= 0) { this.removeItem(itemId); return; }
    this.cartService.updateItem(itemId, qty).subscribe();
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe();
  }

  applyCoupon() {
    if (!this.couponCode) return;
    this.couponApi.validate(this.couponCode, this.cart()?.subTotal || 0).subscribe(r => {
      if (r.success) {
        this.couponValid.set(r.data.isValid);
        this.couponMessage.set(r.data.message);
        this.couponDiscount.set(r.data.isValid ? r.data.discount : 0);
      }
    });
  }
}