import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public layout
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
      { path: 'products', loadComponent: () => import('../app/features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
      { path: 'products/:slug', loadComponent: () => import('../app/features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
      { path: 'category/:id', loadComponent: () => import('../app/features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
      { path: 'search', loadComponent: () => import('../app/features/products/product-list/product-list.component').then(m => m.ProductListComponent) },

      // Auth (guest only)
      { path: 'auth/login', canActivate: [guestGuard], loadComponent: () => import('../app/features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'auth/register', canActivate: [guestGuard], loadComponent: () => import('../app/features/auth/register/register.component').then(m => m.RegisterComponent) },

      // Protected customer routes
      { path: 'cart', canActivate: [authGuard], loadComponent: () => import('../app/features/cart/cart.component').then(m => m.CartComponent) },
      { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('../app/features/checkout/checkout.component').then(m => m.CheckoutComponent) },
      { path: 'wishlist', canActivate: [authGuard], loadComponent: () => import('../app/features/wishlist/wishlist.component').then(m => m.WishlistComponent) },
      { path: 'orders', canActivate: [authGuard], loadComponent: () => import('../app/features/orders/orders.component').then(m => m.OrdersComponent) },
      { path: 'orders/:id', canActivate: [authGuard], loadComponent: () => import('../app/features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
      { path: 'profile', canActivate: [authGuard], loadComponent: () => import('../app/features/profile/profile.component').then(m => m.ProfileComponent) },
    ]
  },

  // Admin layout
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('../app/features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'products', loadComponent: () => import('../app/features/admin/products/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'orders', loadComponent: () => import('../app/features/admin/orders/admin-orders.component').then(m => m.AdminOrdersComponent) },
      { path: 'categories', loadComponent: () => import('../app/features/admin/categories/admin-categories.component').then(m => m.AdminCategoriesComponent) },
    ]
  },

  { path: '**', redirectTo: '' }
];