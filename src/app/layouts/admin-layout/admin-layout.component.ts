import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-sidenav-container style="height:100vh">
      <mat-sidenav mode="side" opened style="width:240px;background:#1e1e2e">
        <div style="padding:20px;color:white;border-bottom:1px solid rgba(255,255,255,0.1)">
          <div style="font-size:20px;font-weight:700">🛒 Admin</div>
          <div style="font-size:12px;opacity:0.6;margin-top:4px">ShopKart Dashboard</div>
        </div>
        <mat-nav-list>
          @for (item of navItems; track item.path) {
            <a mat-list-item [routerLink]="item.path" routerLinkActive="active-nav">
              <mat-icon matListItemIcon style="color:rgba(255,255,255,0.7)">{{ item.icon }}</mat-icon>
              <span matListItemTitle style="color:rgba(255,255,255,0.7)">{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>Admin Panel</span>
          <span style="flex:1"></span>
          <button mat-button style="color:white" (click)="auth.logout()">
            <mat-icon>logout</mat-icon> Logout
          </button>
        </mat-toolbar>
        <div style="padding:24px">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .active-nav { background: rgba(99,102,241,0.4) !important; }
    .active-nav span, .active-nav mat-icon { color: white !important; }
  `]
})
export class AdminLayoutComponent {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { label: 'Products', icon: 'inventory_2', path: '/admin/products' },
    { label: 'Orders', icon: 'shopping_bag', path: '/admin/orders' },
    { label: 'Categories', icon: 'category', path: '/admin/categories' },
  ];
  constructor(public auth: AuthService) {}
}