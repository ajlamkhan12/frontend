import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProductApiService, CategoryApiService, WishlistApiService } from '../../../core/services/api.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProductList, ProductFilter } from '../../../core/models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule, MatIconModule, MatPaginatorModule, MatSnackBarModule],
  template: `
    <div class="container mt-2">
      <div class="page-layout">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filter-section">
            <h3>FILTERS</h3>
            <button style="background:none;border:none;color:#2874f0;cursor:pointer" (click)="clearFilters()">Clear All</button>
          </div>

          <!-- Price Range -->
          <div class="filter-section">
            <h4>PRICE</h4>
            @for (range of priceRanges; track range.label) {
              <label style="display:block;margin-bottom:8px;cursor:pointer">
                <input type="checkbox" [(ngModel)]="range.checked" (change)="onPriceFilter()" />
                {{ range.label }}
              </label>
            }
          </div>

          <!-- Customer Rating -->
          <div class="filter-section">
            <h4>CUSTOMER RATINGS</h4>
            @for (r of ratingOptions; track r) {
              <label style="display:block;margin-bottom:8px;cursor:pointer">
                <input type="radio" [value]="r" [checked]="filter.minRating === r"
                  (change)="filter.minRating = r; load()" />
                {{ r }}★ & above
              </label>
            }
          </div>

          <!-- Brands -->
          @if (brands().length) {
            <div class="filter-section">
              <h4>BRAND</h4>
              @for (brand of brands(); track brand) {
  <label style="display:block;margin-bottom:8px;cursor:pointer">
    <input
      type="checkbox"
      [checked]="filter.brand === brand"
      (change)="onBrandChange($event, brand)" />
    {{ brand }}
  </label>
}
            </div>
          }

          <!-- Availability -->
          <div class="filter-section">
            <h4>AVAILABILITY</h4>
            <label style="display:block;cursor:pointer">
              <input type="checkbox" [(ngModel)]="filter.inStock" (change)="load()" /> In Stock Only
            </label>
          </div>
        </aside>

        <!-- Product Grid -->
        <main class="products-main">
          <!-- Sort bar -->
          <div class="sort-bar">
            <span class="result-count">{{ totalCount() }} results</span>
            <div class="sort-options">
              <span>Sort By</span>
              @for (s of sortOptions; track s.value) {
                <button [class.active]="filter.sortBy === s.value"
                  (click)="filter.sortBy = s.value; load()">{{ s.label }}</button>
              }
            </div>
          </div>

          @if (loading()) {
            <div class="loading-center"><mat-spinner diameter="48" /></div>
          } @else if (products().length === 0) {
            <div class="no-results">
              <mat-icon>search_off</mat-icon>
              <h3>No products found</h3>
              <p>Try adjusting your filters</p>
            </div>
          } @else {
            <div class="product-grid">
              @for (p of products(); track p.id) {
                <div class="product-card" [routerLink]="['/products', p.slug]">
                  <div class="wishlist-btn" (click)="toggleWishlist($event, p.id)">
                    <mat-icon [style.color]="isWishlisted(p.id) ? 'red' : '#ccc'">
                      {{ isWishlisted(p.id) ? 'favorite' : 'favorite_border' }}
                    </mat-icon>
                  </div>
                  <img [src]="p.thumbnailUrl || 'https://placehold.co/300x300'" [alt]="p.name" class="product-image">
                  <div class="product-info">
                    <div class="product-name">{{ p.name }}</div>
                    <div class="product-brand">{{ p.brand }}</div>
                    <div class="product-rating">
                      <span class="rating-badge">{{ p.averageRating || 4 }} ★</span>
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
                    @if (p.stock === 0) { <div class="out-of-stock">Out of Stock</div> }
                  </div>
                </div>
              }
            </div>

            <mat-paginator
              [length]="totalCount()" [pageSize]="filter.pageSize || 20"
              [pageSizeOptions]="[12, 20, 40]" (page)="onPage($event)"
              showFirstLastButtons class="mt-2" />
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .page-layout { display: grid; grid-template-columns: 250px 1fr; gap: 16px; }
    .filters-sidebar { background: white; padding: 16px; border-radius: 4px; height: fit-content; position: sticky; top: 80px; }
    .filter-section { border-bottom: 1px solid var(--border); padding: 16px 0; }
    .filter-section:first-child { display: flex; justify-content: space-between; align-items: center; }
    .filter-section h3 { font-weight: 700; font-size: 16px; }
    .filter-section h4 { font-weight: 700; font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; }
    .filter-section label { display: block; margin-bottom: 8px; font-size: 14px; }
    .sort-bar { background: white; padding: 12px 16px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .result-count { font-size: 14px; color: var(--text-secondary); }
    .sort-options { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-secondary); }
    .sort-options button { background: none; border: none; padding: 4px 12px; cursor: pointer; font-size: 14px; border-radius: 2px; }
    .sort-options button.active { color: var(--primary); font-weight: 600; border-bottom: 2px solid var(--primary); }
    .loading-center { display: flex; justify-content: center; padding: 60px; }
    .no-results { text-align: center; padding: 60px; }
    .no-results mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
    .product-card { position: relative; }
    .wishlist-btn { position: absolute; top: 8px; right: 8px; z-index: 1; cursor: pointer; background: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
    .out-of-stock { font-size: 12px; color: var(--error); font-weight: 600; margin-top: 4px; }
    @media (max-width: 768px) { .page-layout { grid-template-columns: 1fr; } .filters-sidebar { display: none; } }
  `]
})
export class ProductListComponent implements OnInit {
  products = signal<ProductList[]>([]);
  brands = signal<string[]>([]);
  totalCount = signal(0);
  loading = signal(false);
  wishlistedIds = signal<Set<number>>(new Set());

  filter: ProductFilter = { page: 1, pageSize: 20, sortBy: 'newest' };
  priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500, checked: false },
    { label: '₹500 - ₹1000', min: 500, max: 1000, checked: false },
    { label: '₹1000 - ₹5000', min: 1000, max: 5000, checked: false },
    { label: '₹5000 - ₹10000', min: 5000, max: 10000, checked: false },
    { label: 'Above ₹10000', min: 10000, max: undefined, checked: false },
  ];
  ratingOptions = [4, 3, 2, 1];
  sortOptions = [
    { label: 'Relevance', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Rating', value: 'rating' },
    { label: 'Popularity', value: 'popular' },
  ];

  constructor(
    private productApi: ProductApiService,
    private wishlistApi: WishlistApiService,
    private route: ActivatedRoute,
    public auth: AuthService,
    public snack: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.filter.search = params['search'];
      if (params['categoryId']) this.filter.categoryId = +params['categoryId'];
      this.load();
    });
    this.route.params.subscribe(params => {
      if (params['id']) { this.filter.categoryId = +params['id']; this.load(); }
    });
    this.productApi.getBrands(this.filter.categoryId).subscribe(r => { if (r.success) this.brands.set(r.data); });
    if (this.auth.isLoggedIn()) this.loadWishlist();
  }

  load() {
    this.loading.set(true);
    this.productApi.getAll(this.filter).subscribe(r => {
      if (r.success) { this.products.set(r.data.items); this.totalCount.set(r.data.totalCount); }
      this.loading.set(false);
    });
  }

  onBrandChange(event: Event, brand: string) {
    const input = event.target as HTMLInputElement;
    this.filter.brand = input.checked ? brand : undefined;
    this.load();
  }

  onPriceFilter() {
    const checked = this.priceRanges.find(r => r.checked);
    this.filter.minPrice = checked?.min;
    this.filter.maxPrice = checked?.max;
    this.load();
  }

  onPage(e: PageEvent) { this.filter.page = e.pageIndex + 1; this.filter.pageSize = e.pageSize; this.load(); }

  clearFilters() {
    this.filter = { page: 1, pageSize: 20, sortBy: 'newest' };
    this.priceRanges.forEach(r => r.checked = false);
    this.load();
  }

  loadWishlist() {
    this.wishlistApi.get().subscribe(r => {
      if (r.success) this.wishlistedIds.set(new Set(r.data.map(p => p.id)));
    });
  }

  isWishlisted(id: number) { return this.wishlistedIds().has(id); }

  toggleWishlist(e: Event, productId: number) {
    e.stopPropagation();
    if (!this.auth.isLoggedIn()) { this.snack.open('Please login to add to wishlist', 'Login', { duration: 3000 }); return; }
    if (this.isWishlisted(productId)) {
      this.wishlistApi.remove(productId).subscribe(() => {
        const s = new Set(this.wishlistedIds()); s.delete(productId); this.wishlistedIds.set(s);
      });
    } else {
      this.wishlistApi.add(productId).subscribe(() => {
        const s = new Set(this.wishlistedIds()); s.add(productId); this.wishlistedIds.set(s);
      });
    }
  }
}