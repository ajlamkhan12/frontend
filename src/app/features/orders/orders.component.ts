import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-container">
      <h1>My Orders</h1>
      <p>Your orders will appear here</p>
    </div>
  `,
  styles: [`
    .orders-container {
      padding: 20px;
    }
  `]
})
export class OrdersComponent {}
