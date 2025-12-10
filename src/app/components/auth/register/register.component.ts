import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['../../../../styles.scss','./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submissionInProgress = false;
  submissionResult: { success: boolean; message: string } | null = null;
  tripId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    // Get initial query params
    const email = this.route.snapshot.queryParamMap.get('email');
    this.tripId = this.route.snapshot.queryParamMap.get('tripId');
    
    // Set initial email if provided
    if (email) {
      this.form.patchValue({ email });
    }
    
    // Subscribe to query param changes in case they change without component reload
    this.route.queryParamMap.subscribe(params => {
      const updatedEmail = params.get('email');
      const updatedTripId = params.get('tripId');
      
      if (updatedEmail && updatedEmail !== this.form.get('email')?.value) {
        this.form.patchValue({ email: updatedEmail });
      }
      
      if (updatedTripId) {
        this.tripId = updatedTripId;
      }
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submissionInProgress = true;
    this.submissionResult = null;

    const email = this.form.getRawValue().email;
    const password = this.form.value.password;

    // Registration with Firebase
    const displayName = email.split('@')[0]; // Use the part before @ as display name
    this.auth.register(email, password, displayName).subscribe({
      next: (user) => {
        this.submissionInProgress = false;
        this.submissionResult = { 
          success: true, 
          message: 'Registration successful! Redirecting to profile...' 
        };
        // Redirect to profile
        this.router.navigate(
          ['/profile'], 
          { queryParams: this.tripId ? { tripId: this.tripId } : {} }
        );
      },
      error: (err) => {
        this.submissionInProgress = false;
        this.submissionResult = { 
          success: false, 
          message: err?.message || 'Registration failed. Please try again.' 
        };
      }
    });
  }
}
