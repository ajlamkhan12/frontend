import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-container">
      <h1>Checkout</h1>
      <p>Checkout page - under construction</p>
    </div>
  `,
  styles: [`
    .checkout-container {
      padding: 20px;
    }
  `]
})
export class CheckoutComponent {}
