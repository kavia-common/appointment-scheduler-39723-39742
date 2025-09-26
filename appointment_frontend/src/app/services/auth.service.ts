import { Injectable, signal } from '@angular/core';

/**
 * PUBLIC_INTERFACE
 * AuthService
 * Minimal in-memory authentication service for demo/testing.
 * Replace with real backend integration when available.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Signal storing current auth state (true when logged in) */
  readonly isAuthenticated = signal<boolean>(false);

  /** Demo user store (single user) */
  private user = {
    email: 'user@example.com',
    password: 'Password123'
  };

  // PUBLIC_INTERFACE
  login(email: string, password: string): Promise<boolean> {
    /** Simulate async login, returns true on success, false on failure. */
    return new Promise((resolve) => {
      // Use globalThis.setTimeout to be compatible in browser and SSR without lint errors.
      const timer: (handler: () => void, timeout?: number) => number =
        (globalThis as any)?.setTimeout?.bind(globalThis) ??
        ((globalThis as any)['setTimeout'] as (handler: () => void, timeout?: number) => number);
      timer(() => {
        const ok = email === this.user.email && password === this.user.password;
        this.isAuthenticated.set(ok);
        resolve(ok);
      }, 400);
    });
  }

  // PUBLIC_INTERFACE
  logout(): void {
    /** Log out current user. */
    this.isAuthenticated.set(false);
  }
}
