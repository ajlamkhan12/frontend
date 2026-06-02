import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductApiService, ReviewApiService, WishlistApiService } from '../../../core/services/api.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, ProductList, Review } from '../../../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    @if (loading()) { <div class="loading-center"><div class="spinner"></div></div> }
    @if (product()) {
      <div class="container mt-2">
        <div class="product-detail-grid">
          <!-- Images -->
          <div class="image-section">
            <div class="main-image-wrap">
              <img [src]="selectedImage() || 'https://placehold.co/500x500'" [alt]="product()!.name" class="main-image">
              @if (product()!.discountPercent > 0) {
                <span class="discount-badge">{{ product()!.discountPercent }}% OFF</span>
              }
            </div>
            <div class="image-thumbs">
              @for (img of product()!.images; track img.id) {
                <img [src]="img.imageUrl" (click)="selectedImage.set(img.imageUrl)"
                  [class.active]="selectedImage() === img.imageUrl" class="thumb">
              }
            </div>
            <!-- Actions under image -->
            <div class="image-actions">
              <button class="btn-add-cart" (click)="addToCart()" [disabled]="product()!.stock === 0">
                🛒 {{ product()!.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
              <button class="btn-buy-now" routerLink="/checkout" (click)="addToCart()" [disabled]="product()!.stock === 0">
                ⚡ Buy Now
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="info-section">
            <div class="brand-name">{{ product()!.brand }}</div>
            <h1 class="product-title">{{ product()!.name }}</h1>

            <!-- Rating -->
            <div class="rating-row">
              <span class="rating-pill">{{ product()!.averageRating }} ★</span>
              <span class="review-count">{{ product()!.totalReviews }} reviews</span>
              <span style="margin:0 8px">|</span>
              <button (click)="toggleWishlist()" style="background:none;border:none;cursor:pointer;color:#2874f0;padding:0">
                {{ inWishlist() ? '❤️' : '🤍' }} {{ inWishlist() ? 'Wishlisted' : 'Wishlist' }}
              </button>
            </div>

            <!-- Price -->
            <div class="price-section">
              <span class="price-tag">₹{{ product()!.discountedPrice | number }}</span>
              @if (product()!.discountPercent > 0) {
                <span class="original-tag">₹{{ product()!.originalPrice | number }}</span>
                <span class="discount-tag">{{ product()!.discountPercent }}% off</span>
              }
            </div>
            @if (product()!.discountedPrice > 500) {
              <div class="delivery-info">
                <span style="font-size:16px">🚚</span>
                <span>Free Delivery</span>
              </div>
            }

            <!-- Stock -->
            <div class="stock-info">
              <span [style.color]="product()!.stock > 0 ? 'green' : 'red'" style="font-size:16px">
                {{ product()!.stock > 0 ? '✓' : '✕' }}
              </span>
              <span [style.color]="product()!.stock > 0 ? 'green' : 'red'">
                {{ product()!.stock > 0 ? 'In Stock (' + product()!.stock + ' left)' : 'Out of Stock' }}
              </span>
            </div>

            <!-- Specifications -->
            <div class="specs-section">
              <h3>Highlights</h3>
              <ul>
                @for (spec of product()!.specifications.slice(0,5); track spec.key) {
                  <li><strong>{{ spec.key }}:</strong> {{ spec.value }}</li>
                }
              </ul>
            </div>

            <!-- Seller -->
            <div class="seller-info">
              <span class="text-secondary">Sold by</span>
              <strong>{{ product()!.sellerName }}</strong>
            </div>
          </div>
        </div>

        <!-- Tabs: Description & Reviews -->
        <div class="tabs-section mt-3">
          <div class="tabs-container">
            <div class="tab-header">
              <span class="tab-label active">Description</span>
              <span class="tab-label">Specifications</span>
              <span class="tab-label">Reviews ({{ reviews().length }})</span>
            </div>
            <div class="tab-content">
              <div class="tab-pane active">
                <p>{{ product()!.description }}</p>
              </div>
              <div class="tab-pane">
                <table class="spec-table">
                  @for (spec of product()!.specifications; track spec.key) {
                    <tr>
                      <td class="spec-key">{{ spec.key }}</td>
                      <td>{{ spec.value }}</td>
                    </tr>
                  }
                </table>
              </div>
              <div class="tab-pane">
                @for (review of reviews(); track review.id) {
                  <div class="review-card">
                    <div class="review-header">
                      <span class="review-rating-badge">{{ review.rating }} ★</span>
                      <strong>{{ review.title }}</strong>
                    </div>
                    <p class="review-comment">{{ review.comment }}</p>
                    <div class="review-author">{{ review.userName }} · {{ review.createdAt | date }}</div>
                  </div>
                }
                @if (!reviews().length) { <p class="text-secondary">No reviews yet. Be the first!</p> }
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        @if (related().length) {
          <div class="mt-3 mb-3">
            <div class="section-header"><h2>Similar Products</h2></div>
            <div class="product-grid">
              @for (p of related(); track p.id) {
                <div class="product-card" [routerLink]="['/products', p.slug]">
                  <img [src]="p.thumbnailUrl || 'https://placehold.co/300x300'" [alt]="p.name" class="product-image">
                  <div class="product-info">
                    <div class="product-name">{{ p.name }}</div>
                    <div class="product-price">
                      <span class="discounted-price">₹{{ p.discountedPrice | number }}</span>
                      @if (p.discountPercent > 0) { <span class="discount-percent">{{ p.discountPercent }}% off</span> }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .loading-center { display: flex; justify-content: center; padding: 100px; }
    .product-detail-grid { display: grid; grid-template-columns: 420px 1fr; gap: 24px; background: white; padding: 24px; border-radius: 4px; }
    .image-section { display: flex; flex-direction: column; gap: 16px; }
    .main-image-wrap { position: relative; border: 1px solid var(--border); border-radius: 4px; display: flex; align-items: center; justify-content: center; padding: 24px; min-height: 400px; }
    .main-image { max-width: 100%; max-height: 400px; object-fit: contain; }
    .discount-badge { position: absolute; top: 12px; left: 12px; background: var(--success); color: white; padding: 4px 10px; border-radius: 2px; font-weight: 700; font-size: 14px; }
    .image-thumbs { display: flex; gap: 8px; flex-wrap: wrap; }
    .thumb { width: 64px; height: 64px; object-fit: contain; border: 2px solid var(--border); border-radius: 4px; cursor: pointer; padding: 4px; }
    .thumb.active { border-color: var(--primary); }
    .image-actions { display: flex; flex-direction: column; gap: 12px; }
    .brand-name { font-size: 14px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
    .product-title { font-size: 22px; font-weight: 400; line-height: 1.4; margin: 8px 0; }
    .rating-row { display: flex; align-items: center; gap: 12px; margin: 12px 0; }
    .rating-pill { background: var(--success); color: white; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 14px; }
    .review-count { font-size: 14px; color: var(--text-secondary); }
    .price-section { display: flex; align-items: baseline; gap: 12px; margin: 16px 0; }
    .delivery-info { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
    .stock-info { display: flex; align-items: center; gap: 6px; font-size: 14px; margin-bottom: 16px; }
    .specs-section { background: var(--bg); padding: 16px; border-radius: 4px; margin: 16px 0; }
    .specs-section h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
    .specs-section li { font-size: 14px; margin-bottom: 6px; }
    .seller-info { font-size: 14px; display: flex; gap: 8px; }
    .tabs-section { background: white; border-radius: 4px; }
    .tab-content { padding: 24px; }
    .spec-table { width: 100%; border-collapse: collapse; }
    .spec-table tr { border-bottom: 1px solid var(--border); }
    .spec-table td { padding: 10px 16px; font-size: 14px; }
    .spec-key { color: var(--text-secondary); width: 200px; font-weight: 500; }
    .review-card { border-bottom: 1px solid var(--border); padding: 16px 0; }
    .review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .review-rating-badge { background: var(--success); color: white; padding: 2px 8px; border-radius: 2px; font-size: 13px; font-weight: 600; }
    .review-comment { font-size: 14px; color: var(--text-secondary); }
    .review-author { font-size: 12px; color: var(--text-secondary); margin-top: 8px; }
    @media (max-width: 768px) { .product-detail-grid { grid-template-columns: 1fr; } .image-actions { flex-direction: row; } }
  `]
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  related = signal<ProductList[]>([]);
  reviews = signal<Review[]>([]);
  selectedImage = signal<string>('');
  inWishlist = signal(false);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private productApi: ProductApiService,
    private reviewApi: ReviewApiService,
    private wishlistApi: WishlistApiService,
    private cartService: CartService,
    public auth: AuthService,
    private snack: MatSnackBar   // ✅ add this
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productApi.getBySlug(params['slug']).subscribe(r => {
        if (r.success) {
          this.product.set(r.data);
          const primary = r.data.images.find(i => i.isPrimary);
          this.selectedImage.set(primary?.imageUrl || r.data.thumbnailUrl || '');
          this.loading.set(false);
          this.loadRelated(r.data.id);
          this.loadReviews(r.data.id);
          if (this.auth.isLoggedIn()) this.checkWishlist(r.data.id);
        }
      });
    });
  }

  loadRelated(id: number) {
    this.productApi.getRelated(id).subscribe(r => { if (r.success) this.related.set(r.data); });
  }

  loadReviews(id: number) {
    this.reviewApi.getForProduct(id).subscribe(r => { if (r.success) this.reviews.set(r.data.items); });
  }

  checkWishlist(id: number) {
    this.wishlistApi.check(id).subscribe(r => { if (r.success) this.inWishlist.set(r.data); });
  }

  addToCart() {
    if (!this.auth.isLoggedIn()) {
      this.snack.open('Please login to add to cart', 'Login', { duration: 3000 });
      return;
    }

    if (!this.product()) return;

    this.cartService.addToCart(this.product()!.id).subscribe({
      next: () => {
        const ref = this.snack.open('Added to cart!', 'View Cart', {
          duration: 3000
        });

        ref.onAction().subscribe(() => {
          // navigate to cart page
          // this.router.navigate(['/cart']);
        });
      },
      error: () => {
        this.snack.open('Failed to add to cart', 'Close', { duration: 3000 });
      }
    });
  }

  toggleWishlist() {
    if (!this.auth.isLoggedIn()) { console.log('Please login'); return; }
    const id = this.product()!.id;
    if (this.inWishlist()) {
      this.wishlistApi.remove(id).subscribe(() => { this.inWishlist.set(false); console.log('Removed from wishlist'); });
    } else {
      this.wishlistApi.add(id).subscribe(() => { this.inWishlist.set(true); console.log('Added to wishlist'); });
    }
  }
}