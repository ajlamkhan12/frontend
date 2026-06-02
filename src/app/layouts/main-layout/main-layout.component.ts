import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { CategoryApiService } from '../../core/services/api.service';
import { Category } from '../../core/models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule],
  template: `
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-inner">
          <a routerLink="/" class="logo">ShopKart</a>
          
          <div class="search-box">
            <input placeholder="Search products..." [(ngModel)]="searchQuery" (keyup.enter)="onSearch()" />
            <button (click)="onSearch()">Search</button>
          </div>

          <div class="header-actions">
            @if (auth.isLoggedIn()) {
              <span>{{ auth.user()?.fullName }}</span>
              <a routerLink="/profile">Profile</a>
              <a routerLink="/orders">Orders</a>
              <a routerLink="/wishlist">Wishlist</a>
              @if (auth.isAdmin()) {
                <a routerLink="/admin">Admin</a>
              }
              <button (click)="auth.logout()">Logout</button>
            } @else {
              <a routerLink="/auth/login">Login</a>
              <a routerLink="/auth/register">Register</a>
            }
            
            <a routerLink="/cart" class="cart">Cart ({{ cartCount() }})</a>
          </div>
        </div>

        <!-- Categories -->
        <nav class="categories">
          @for (cat of categories(); track cat.id) {
            <a [routerLink]="['/category', cat.id]">{{ cat.name }}</a>
          }
        </nav>
      </div>
    </header>

    <main>
      <router-outlet />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div><h4>ABOUT</h4><p>About Us | Careers | Contact</p></div>
          <div><h4>HELP</h4><p>Payments | Shipping | Returns</p></div>
          <div><h4>POLICY</h4><p>Terms | Privacy | Refund</p></div>
          <div><h4>SOCIAL</h4><p>Facebook | Twitter | YouTube</p></div>
        </div>
        <div class="footer-bottom">© 2024 ShopKart</div>
      </div>
    </footer>
  `,
  styles: [`
    .header { background: #2874f0; color: white; padding: 12px 0; }
    .header-inner { display: flex; align-items: center; gap: 20px; }
    .logo { font-size: 24px; font-weight: bold; text-decoration: none; color: white; min-width: 120px; }
    .search-box { flex: 1; display: flex; gap: 8px; max-width: 500px; }
    .search-box input { flex: 1; padding: 8px; border: none; border-radius: 4px; }
    .search-box button { padding: 8px 16px; background: white; color: #2874f0; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .header-actions { display: flex; gap: 12px; align-items: center; }
    .header-actions a, .header-actions button { color: white; text-decoration: none; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 4px; }
    .header-actions a:hover, .header-actions button:hover { background: rgba(255,255,255,0.2); }
    .cart { font-weight: bold; background: rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 4px; }
    .categories { display: flex; gap: 16px; padding: 8px 0; overflow-x: auto; }
    .categories a { color: white; text-decoration: none; white-space: nowrap; padding: 4px 0; font-size: 14px; }
    .categories a:hover { border-bottom: 2px solid white; }
    .footer { background: #172337; color: white; padding: 40px 0 0; margin-top: 40px; }
    .footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding: 40px 0; }
    .footer h4 { font-size: 12px; margin-bottom: 12px; font-weight: bold; }
    .footer-bottom { border-top: 1px solid #444; padding: 20px 0; text-align: center; font-size: 13px; color: #999; }
    @media (max-width: 768px) {
      .header-inner { flex-wrap: wrap; }
      .search-box { order: 3; flex: 1 0 100%; }
      .footer-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  searchQuery = '';
  categories = signal<Category[]>([]);

  constructor(
    public auth: AuthService,
    public cartService: CartService,
    private categoryApi: CategoryApiService,
    private router: Router
  ) {}

  get cartCount() { return this.cartService.itemCount; }

  ngOnInit() {
    this.categoryApi.getRoot().subscribe(r => { if (r.success) this.categories.set(r.data.slice(0, 10)); });
  }

  onSearch() {
    if (this.searchQuery.trim())
      this.router.navigate(['/search'], { queryParams: { search: this.searchQuery } });
  }
}