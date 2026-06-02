import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-categories-container">
      <h1>Manage Categories</h1>
      <p>Category management page</p>
    </div>
  `,
  styles: [`
    .admin-categories-container {
      padding: 20px;
    }
  `]
})
export class AdminCategoriesComponent {}
