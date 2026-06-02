import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="card">
        <h2 class="title">Welcome Back</h2>

        <form #f="ngForm" (ngSubmit)="onSubmit(f)" class="form">
          <div class="field">
            <label>Email</label>
            <input name="email" type="email" required [(ngModel)]="email" #emailRef="ngModel" />
            <small class="error" *ngIf="emailRef.invalid && emailRef.touched">Valid email required</small>
          </div>

          <div class="field">
            <label>Password</label>
            <input name="password" type="password" required minlength="6" [(ngModel)]="password" #pwRef="ngModel" />
            <small class="error" *ngIf="pwRef.invalid && pwRef.touched">Password (min 6 chars)</small>
          </div>

          <div class="actions">
            <button class="btn" type="submit" [disabled]="loading || f.invalid">
              <span *ngIf="!loading">Login</span>
              <span *ngIf="loading" class="spinner" aria-hidden="true"></span>
            </button>
          </div>

          <div class="meta" *ngIf="error">{{ error }}</div>
        </form>

        <p class="switch">Don't have an account? <a routerLink="/auth/register">Create one</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page{display:flex;min-height:70vh;align-items:center;justify-content:center;padding:32px;background:linear-gradient(135deg,#f6f8fb 0%,#ffffff 100%)}
    .card{width:420px;background:#fff;border-radius:12px;box-shadow:0 8px 30px rgba(20,30,50,0.08);padding:28px}
    .title{margin:0 0 16px;font-weight:600;color:#0f1724}
    .form{display:flex;flex-direction:column;gap:12px}
    .field{display:flex;flex-direction:column}
    label{font-size:13px;color:#667085;margin-bottom:6px}
    input{height:44px;padding:8px 12px;border:1px solid #e6eef8;border-radius:8px;background:#fbfdff;font-size:14px}
    input:focus{outline:none;box-shadow:0 0 0 4px rgba(59,130,246,0.06);border-color:#3b82f6}
    .actions{display:flex;justify-content:space-between;align-items:center;margin-top:6px}
    .btn{background:#0f1724;color:#fff;padding:10px 16px;border-radius:10px;border:none;cursor:pointer;min-width:120px}
    .btn[disabled]{opacity:0.6;cursor:not-allowed}
    .spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .meta{color:#ef4444;margin-top:8px;font-size:13px}
    .switch{margin-top:12px;text-align:center;color:#475569}
    a{color:#2563eb;text-decoration:none}
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: any) {
    if (form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.router.navigate(['/']);
        else this.error = res.message || 'Login failed';
      },
      error: err => { this.loading = false; this.error = err?.error?.message || 'Network error'; }
    });
  }
}
