import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wishlist-container">
      <h1>My Wishlist</h1>
      <p>Your wishlist items will appear here</p>
    </div>
  `,
  styles: [`
    .wishlist-container {
      padding: 20px;
    }
  `]
})
export class WishlistComponent {}
