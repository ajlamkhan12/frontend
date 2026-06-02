import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, PagedResult, Product, ProductList, Category,
  CartSummary, Order, Address, Review, DashboardStats, ProductFilter
} from '../models';

const BASE = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  constructor(private http: HttpClient) {}

  getAll(filter: ProductFilter = {}) {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => { if (v != null) params = params.set(k, v); });
    return this.http.get<ApiResponse<PagedResult<ProductList>>>(`${BASE}/products`, { params });
  }

  getFeatured() { return this.http.get<ApiResponse<ProductList[]>>(`${BASE}/products/featured`); }
  getById(id: number) { return this.http.get<ApiResponse<Product>>(`${BASE}/products/${id}`); }
  getBySlug(slug: string) { return this.http.get<ApiResponse<Product>>(`${BASE}/products/slug/${slug}`); }
  getRelated(id: number) { return this.http.get<ApiResponse<ProductList[]>>(`${BASE}/products/${id}/related`); }
  getBrands(categoryId?: number) {
    const params = categoryId ? new HttpParams().set('categoryId', categoryId) : new HttpParams();
    return this.http.get<ApiResponse<string[]>>(`${BASE}/products/brands`, { params });
  }
  create(data: any) { return this.http.post<ApiResponse<Product>>(`${BASE}/products`, data); }
  update(id: number, data: any) { return this.http.put<ApiResponse<Product>>(`${BASE}/products/${id}`, data); }
  delete(id: number) { return this.http.delete<ApiResponse<any>>(`${BASE}/products/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<ApiResponse<Category[]>>(`${BASE}/categories`); }
  getRoot() { return this.http.get<ApiResponse<Category[]>>(`${BASE}/categories/root`); }
  getById(id: number) { return this.http.get<ApiResponse<Category>>(`${BASE}/categories/${id}`); }
  create(data: any) { return this.http.post<ApiResponse<Category>>(`${BASE}/categories`, data); }
  update(id: number, data: any) { return this.http.put<ApiResponse<Category>>(`${BASE}/categories/${id}`, data); }
  delete(id: number) { return this.http.delete(`${BASE}/categories/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class CartApiService {
  constructor(private http: HttpClient) {}
  get() { return this.http.get<ApiResponse<CartSummary>>(`${BASE}/cart`); }
  add(productId: number, quantity = 1) { return this.http.post<ApiResponse<CartSummary>>(`${BASE}/cart`, { productId, quantity }); }
  update(itemId: number, quantity: number) { return this.http.put<ApiResponse<CartSummary>>(`${BASE}/cart/${itemId}`, { quantity }); }
  remove(itemId: number) { return this.http.delete<ApiResponse<CartSummary>>(`${BASE}/cart/${itemId}`); }
  clear() { return this.http.delete<ApiResponse<any>>(`${BASE}/cart`); }
}

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  constructor(private http: HttpClient) {}
  getAll(page = 1, pageSize = 10) {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<PagedResult<Order>>>(`${BASE}/orders`, { params });
  }
  getById(id: number) { return this.http.get<ApiResponse<Order>>(`${BASE}/orders/${id}`); }
  getByNumber(num: string) { return this.http.get<ApiResponse<Order>>(`${BASE}/orders/number/${num}`); }
  create(data: any) { return this.http.post<ApiResponse<Order>>(`${BASE}/orders`, data); }
  updateStatus(id: number, data: any) { return this.http.patch<ApiResponse<Order>>(`${BASE}/orders/${id}/status`, data); }
  cancel(id: number, reason: string) { return this.http.post<ApiResponse<Order>>(`${BASE}/orders/${id}/cancel`, JSON.stringify(reason), { headers: { 'Content-Type': 'application/json' } }); }
}

@Injectable({ providedIn: 'root' })
export class WishlistApiService {
  constructor(private http: HttpClient) {}
  get() { return this.http.get<ApiResponse<ProductList[]>>(`${BASE}/wishlist`); }
  add(productId: number) { return this.http.post<ApiResponse<any>>(`${BASE}/wishlist/${productId}`, {}); }
  remove(productId: number) { return this.http.delete<ApiResponse<any>>(`${BASE}/wishlist/${productId}`); }
  check(productId: number) { return this.http.get<ApiResponse<boolean>>(`${BASE}/wishlist/${productId}/check`); }
}

@Injectable({ providedIn: 'root' })
export class AddressApiService {
  constructor(private http: HttpClient) {}
  get() { return this.http.get<ApiResponse<Address[]>>(`${BASE}/addresses`); }
  add(data: any) { return this.http.post<ApiResponse<Address>>(`${BASE}/addresses`, data); }
  update(id: number, data: any) { return this.http.put<ApiResponse<Address>>(`${BASE}/addresses/${id}`, data); }
  delete(id: number) { return this.http.delete(`${BASE}/addresses/${id}`); }
  setDefault(id: number) { return this.http.patch(`${BASE}/addresses/${id}/default`, {}); }
}

@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  constructor(private http: HttpClient) {}
  getForProduct(productId: number, page = 1) {
    const params = new HttpParams().set('page', page).set('pageSize', 10);
    return this.http.get<ApiResponse<PagedResult<Review>>>(`${BASE}/reviews/product/${productId}`, { params });
  }
  create(data: any) { return this.http.post<ApiResponse<Review>>(`${BASE}/reviews`, data); }
  approve(id: number) { return this.http.patch(`${BASE}/reviews/${id}/approve`, {}); }
  delete(id: number) { return this.http.delete(`${BASE}/reviews/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  constructor(private http: HttpClient) {}
  getStats() { return this.http.get<ApiResponse<DashboardStats>>(`${BASE}/dashboard`); }
}

@Injectable({ providedIn: 'root' })
export class CouponApiService {
  constructor(private http: HttpClient) {}
  validate(code: string, orderAmount: number) {
    return this.http.post<ApiResponse<{ isValid: boolean; message: string; discount: number }>>
      (`${BASE}/coupons/validate`, { code, orderAmount });
  }
}