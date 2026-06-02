import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-products-container">
      <h1>Manage Products</h1>
      <p>Product management page</p>
    </div>
  `,
  styles: [`
    .admin-products-container {
      padding: 20px;
    }
  `]
})
export class AdminProductsComponent {}
