import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardApiService } from '../../../core/services/api.service';
import { DashboardStats } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 style="margin-bottom:24px">Dashboard Overview</h1>
    @if (loading()) { <div>Loading...</div> }
    @if (stats()) {
      <div class="stats-grid">
        @for (card of statCards(); track card.label) {
          <div class="stat-card" [style.border-top]="'4px solid ' + card.color">
            <div style="padding:20px">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                  <div style="font-size:32px;font-weight:700">{{ card.value }}</div>
                  <div style="color:#666;font-size:14px;margin-top:4px">{{ card.label }}</div>
                </div>
                <span [style.color]="card.color" style="font-size:40px">{{ card.icon }}</span>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Revenue Chart -->
      <div class="card" style="margin-top:24px">
        <div style="padding:16px;border-bottom:1px solid #eee"><h3 style="margin:0">Monthly Revenue</h3></div>
        <div style="padding:24px">
          <div class="bar-chart">
            @for (item of stats()!.revenueChart; track item.month) {
              <div class="bar-col">
                <div class="bar-value">₹{{ item.revenue | number:'1.0-0' }}</div>
                <div class="bar-fill" [style.height.%]="getBarH(item.revenue)"></div>
                <div class="bar-label">{{ item.month }}</div>
              </div>
            }
            @if (!stats()!.revenueChart.length) { <p style="color:#999">No revenue data yet</p> }
          </div>
        </div>
      </div>

      <!-- Order Status -->
      <div class="card" style="margin-top:16px">
        <div style="padding:16px;border-bottom:1px solid #eee"><h3 style="margin:0">Orders by Status</h3></div>
        <div style="padding:24px">
          <div style="display:flex;flex-wrap:wrap;gap:12px">
            @for (s of stats()!.orderStatusChart; track s.status) {
              <div class="status-chip">
                <span>{{ s.status }}</span>
                <strong>{{ s.count }}</strong>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .card { background: white; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-card { background: white; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .bar-chart { display: flex; align-items: flex-end; gap: 12px; height: 200px; }
    .bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end; }
    .bar-fill { width: 100%; background: #2874f0; border-radius: 4px 4px 0 0; min-height: 4px; }
    .bar-label { font-size: 11px; color: #666; margin-top: 6px; }
    .bar-value { font-size: 11px; color: #333; font-weight: 600; margin-bottom: 4px; }
    .status-chip { background: #f0f0f0; border-radius: 20px; padding: 8px 16px; display: flex; align-items: center; gap: 8px; font-size: 14px; }
    .status-chip strong { background: #2874f0; color: white; border-radius: 10px; padding: 2px 8px; font-size: 12px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  statCards = signal<any[]>([]);

  constructor(private dashboardApi: DashboardApiService) {}

  ngOnInit() {
    this.dashboardApi.getStats().subscribe(r => {
      if (r.success) {
        this.stats.set(r.data);
        this.statCards.set([
          { label: 'Total Products', value: r.data.totalProducts, icon: 'inventory_2', color: '#2874f0' },
          { label: 'Total Orders', value: r.data.totalOrders, icon: 'shopping_bag', color: '#fb641b' },
          { label: 'Customers', value: r.data.totalCustomers, icon: 'people', color: '#388e3c' },
          { label: 'Revenue', value: '₹' + r.data.totalRevenue.toLocaleString(), icon: 'currency_rupee', color: '#8e44ad' },
          { label: 'Pending Orders', value: r.data.pendingOrders, icon: 'pending', color: '#f57c00' },
          { label: 'Low Stock', value: r.data.lowStockProducts, icon: 'warning', color: '#d32f2f' },
        ]);
      }
      this.loading.set(false);
    });
  }

  get maxRevenue() { return Math.max(...(this.stats()?.revenueChart.map(r => r.revenue) || [1]), 1); }
  getBarH(val: number) { return Math.max((val / this.maxRevenue) * 100, 5); }
}