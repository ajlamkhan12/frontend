import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-orders-container">
      <h1>Manage Orders</h1>
      <p>Order management page</p>
    </div>
  `,
  styles: [`
    .admin-orders-container {
      padding: 20px;
    }
  `]
})
export class AdminOrdersComponent {}
