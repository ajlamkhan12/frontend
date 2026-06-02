import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductApiService, CategoryApiService, CartApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { ProductList, Category } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="banner-slide" [style.background]="banners[activeBanner].bg">
        <div class="container banner-content">
          <div>
            <h1>{{ banners[activeBanner].title }}</h1>
            <p>{{ banners[activeBanner].subtitle }}</p>
            <button class="btn-accent" routerLink="/products">Shop Now</button>
          </div>
        </div>
      </div>
      <div class="banner-dots">
        @for (b of banners; track $index) {
          <span class="dot" [class.active]="$index === activeBanner" (click)="activeBanner = $index"></span>
        }
      </div>
    </div>

    <!-- Categories -->
    <div class="container mt-2">
      <div class="categories-strip">
        @for (cat of categories(); track cat.id) {
          <a [routerLink]="['/category', cat.id]" class="cat-item">
            <div class="cat-icon">{{ cat.name[0] }}</div>
            <span>{{ cat.name }}</span>
          </a>
        }
      </div>
    </div>

    <!-- Featured Products -->
    <div class="container mt-2">
      <div class="section-header">
        <h2>Featured Products</h2>
        <a routerLink="/products">View All →</a>
      </div>
      <div class="product-grid">
        @for (p of featured(); track p.id) {
          <div class="product-card" [routerLink]="['/products', p.slug]">
            <img [src]="p.thumbnailUrl || 'https://placehold.co/300x300'" [alt]="p.name" class="product-image">
            <div class="product-info">
              <div class="product-name">{{ p.name }}</div>
              <div class="product-brand">{{ p.brand }}</div>
              <div class="product-rating">
                <span class="rating-badge">{{ p.averageRating }} ★</span>
                <span class="rating-count">({{ p.totalReviews }})</span>
              </div>
              <div class="product-price">
                <span class="discounted-price">₹{{ p.discountedPrice | number }}</span>
                @if (p.discountPercent > 0) {
                  <span class="original-price">₹{{ p.originalPrice | number }}</span>
                  <span class="discount-percent">{{ p.discountPercent }}% off</span>
                }
              </div>
              @if (p.discountedPrice > 500) { <div class="free-delivery">Free Delivery</div> }
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Top Deals -->
    <div class="container mt-3">
      <div class="deals-banner">
        <div class="deals-text">
          <h3>🔥 Today's Top Deals</h3>
          <p>Save big on electronics, fashion, and more</p>
        </div>
        <a routerLink="/products" mat-stroked-button>Explore Deals</a>
      </div>
    </div>

    <!-- More Products -->
    <div class="container mt-2 mb-3">
      <div class="section-header">
        <h2>New Arrivals</h2>
        <a routerLink="/products">View All →</a>
      </div>
      <div class="product-grid">
        @for (p of products(); track p.id) {
          <div class="product-card" [routerLink]="['/products', p.slug]">
            <img [src]="p.thumbnailUrl || 'https://placehold.co/300x300'" [alt]="p.name" class="product-image">
            <div class="product-info">
              <div class="product-name">{{ p.name }}</div>
              <div class="product-brand">{{ p.brand }}</div>
              <div class="product-rating">
                <span class="rating-badge">{{ p.averageRating || 4.0 }} ★</span>
              </div>
              <div class="product-price">
                <span class="discounted-price">₹{{ p.discountedPrice | number }}</span>
                @if (p.discountPercent > 0) {
                  <span class="discount-percent">{{ p.discountPercent }}% off</span>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .hero-banner { position: relative; overflow: hidden; }
    .banner-slide { height: 280px; transition: all 0.5s; }
    .banner-content { height: 100%; display: flex; align-items: center; }
    .banner-content h1 { font-size: 36px; font-weight: 700; color: white; margin-bottom: 12px; }
    .banner-content p { font-size: 16px; color: rgba(255,255,255,0.9); margin-bottom: 20px; }
    .banner-dots { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; }
    .dot.active { background: white; }
    .categories-strip { display: flex; gap: 16px; overflow-x: auto; padding: 16px 0; background: white; border-radius: 4px; scrollbar-width: none; }
    .cat-item { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 80px; cursor: pointer; &:hover { color: var(--primary); } }
    .cat-icon { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #e3f2fd, #bbdefb); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: var(--primary); }
    .cat-item span { font-size: 12px; font-weight: 600; text-align: center; }
    .deals-banner { background: linear-gradient(135deg, #2874f0, #0056d2); border-radius: 8px; padding: 32px; display: flex; justify-content: space-between; align-items: center; color: white; }
    .deals-text h3 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
    .deals-text p { opacity: 0.9; }
    @media (max-width: 768px) { .banner-slide { height: 200px; } .banner-content h1 { font-size: 24px; } .deals-banner { flex-direction: column; gap: 16px; } }
  `]
})
export class HomeComponent implements OnInit {
  featured = signal<ProductList[]>([]);
  products = signal<ProductList[]>([]);
  categories = signal<Category[]>([]);
  activeBanner = 0;

  banners = [
    { title: 'Biggest Sale of the Year', subtitle: 'Up to 80% off on top brands', bg: 'linear-gradient(135deg, #2874f0, #0056d2)' },
    { title: 'New Electronics Arrivals', subtitle: 'Latest gadgets at best prices', bg: 'linear-gradient(135deg, #ff6b35, #e53e00)' },
    { title: 'Fashion Week Deals', subtitle: 'Top brands, amazing discounts', bg: 'linear-gradient(135deg, #8e44ad, #6c3483)' },
  ];

  constructor(
    private productApi: ProductApiService,
    private categoryApi: CategoryApiService
  ) {
    setInterval(() => this.activeBanner = (this.activeBanner + 1) % this.banners.length, 4000);
  }

  ngOnInit() {
    this.productApi.getFeatured().subscribe(r => { if (r.success) this.featured.set(r.data); });
    this.productApi.getAll({ page: 1, pageSize: 12 }).subscribe(r => { if (r.success) this.products.set(r.data.items); });
    this.categoryApi.getRoot().subscribe(r => { if (r.success) this.categories.set(r.data); });
  }
}