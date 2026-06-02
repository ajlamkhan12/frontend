import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiResponse, AuthResponse, UserRole } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly URL = `${environment.apiUrl}/auth`;
  private _user = signal<AuthResponse | null>(this.loadUser());

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === UserRole.Admin);
  readonly isSeller = computed(() => this._user()?.role === UserRole.Seller);
  readonly isCustomer = computed(() => this._user()?.role === UserRole.Customer);
  readonly token = computed(() => this._user()?.accessToken);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.URL}/login`, { email, password })
      .pipe(tap(r => { if (r.success) this.persist(r.data); }));
  }

  register(data: { firstName: string; lastName: string; email: string; password: string; phoneNumber: string; }) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.URL}/register`, data)
      .pipe(tap(r => { if (r.success) this.persist(r.data); }));
  }

  logout() {
    this.http.post(`${this.URL}/logout`, {}).subscribe();
    localStorage.removeItem('ecom_user');
    this._user.set(null);
    this.router.navigate(['/']);
  }

  private persist(user: AuthResponse) {
    localStorage.setItem('ecom_user', JSON.stringify(user));
    this._user.set(user);
  }

  private loadUser(): AuthResponse | null {
    try { return JSON.parse(localStorage.getItem('ecom_user') || 'null'); }
    catch { return null; }
  }
}