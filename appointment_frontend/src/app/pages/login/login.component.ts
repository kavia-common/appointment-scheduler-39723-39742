import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * PUBLIC_INTERFACE
 * LoginComponent
 * Displays a login form with email & password validation and handles authentication.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  submitting = signal(false);
  error = signal<string | null>(null);

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Clear error when user changes inputs
    effect(() => {
      void this.form.value;
      this.error.set(null);
    });
  }

  // PUBLIC_INTERFACE
  async submit() {
    /** Handle submit, validate form, call auth, and navigate on success. */
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    const { email, password } = this.form.value;

    try {
      const ok = await this.auth.login(email, password);
      if (!ok) {
        this.error.set('Invalid email or password.');
        return;
      }
      await this.router.navigateByUrl('/');
    } catch {
      this.error.set('An unexpected error occurred. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
}
