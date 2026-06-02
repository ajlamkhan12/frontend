import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-detail-container">
      <h1>Order Details</h1>
      <p>Order details will appear here</p>
    </div>
  `,
  styles: [`
    .order-detail-container {
      padding: 20px;
    }
  `]
})
export class OrderDetailComponent {
  constructor(private route: ActivatedRoute) {}
}
