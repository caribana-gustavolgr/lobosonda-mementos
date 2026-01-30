import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['../../../../styles.scss','./login.component.scss']
})
export class LoginComponent {
  // Prefer local assets in the project (use the download script to populate `src/assets/figma/`)
  instagramIcon = '/assets/figma/instagram.png';
  facebookIcon = '/assets/figma/facebook.png';
  image2 = '/assets/figma/image2.png';

  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  tripId: string | null = null;
  
  // Add missing properties
  submissionInProgress = false;
  submissionResult: { success: boolean; message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const email = params.get('email');
      this.tripId = params.get('tripId');
      if (email) {
        this.loginForm.patchValue({ email });
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    // First login with Firebase
    this.auth.login(email, password).subscribe({
      next: (user) => {
        // After successful Firebase login, call backend signin
        this.auth.signinBackend(email, password).subscribe({
          next: (backendResponse) => {
            this.loading = false;
            console.log('Backend signin successful:', backendResponse);
            
            // Load session info and save to localStorage
            this.auth.getSessionInfo().subscribe({
              next: (sessionInfo: any) => {
                console.log('Session info loaded:', sessionInfo);
                localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));
                
                // Redirect to my-trips as requested
                if (this.tripId) {
                  this.router.navigate(['/my-trips'], { queryParams: { tripId: this.tripId } });
                } else {
                  this.router.navigate(['/my-trips']);
                }
              },
              error: (sessionError: any) => {
                console.error('Failed to load session info:', sessionError);
                // Show warning but still allow access - session info is not critical
                this.errorMessage = `Login successful but some features may be limited. You can continue, but session data could not be loaded.`;
                
                // Still redirect to my-trips since login was successful
                if (this.tripId) {
                  this.router.navigate(['/my-trips'], { queryParams: { tripId: this.tripId } });
                } else {
                  this.router.navigate(['/my-trips']);
                }
              }
            });
          },
          error: (backendError) => {
            this.loading = false;
            console.error('Backend signin error:', backendError);
            
            // Show error and stay on login page - do not redirect
            this.errorMessage = `Authentication failed: ${backendError.message || 'Backend authentication error'}. Please try again.`;
            
            // Remove any automatic redirect - user must stay on login page
            // until authentication is completely successful
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.getFirebaseErrorMessage(err);
      }
    });
  }

  // For social login methods
  onFacebookLogin() {
    // TODO: Implement Facebook login
    console.log('Facebook login clicked');
  }

  onGoogleLogin() {
    // TODO: Implement Google login
    console.log('Google login clicked');
  }

  private getFirebaseErrorMessage(error: any): string {
    if (!error || !error.code) return 'An unknown error occurred. Please try again.';

    const errorMap: {[key: string]: string} = {
      // Firebase Auth Errors
      'auth/invalid-email': 'The email address is not valid.',
      'auth/user-disabled': 'This user account has been disabled.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many failed login attempts. Please try again later or reset your password.',
      'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
      'auth/weak-password': 'The password is too weak. Please choose a stronger password.',
      'auth/email-already-in-use': 'This email is already in use by another account.',
      'auth/requires-recent-login': 'Please log in again to perform this action.',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
      'auth/credential-already-in-use': 'This credential is already associated with a different user account.',
      'auth/invalid-credential': 'The supplied auth credential is malformed or has expired.',
      'auth/invalid-verification-code': 'The verification code is invalid or has expired.',
      'auth/invalid-verification-id': 'The verification ID is invalid.',
      'auth/network-request-failed': 'A network error occurred. Please check your internet connection.',
      
      // Custom error codes from your API
      'INVALID_PASSWORD': 'Incorrect password. Please try again.',
      'EMAIL_NOT_FOUND': 'No account found with this email address.',
      'USER_DISABLED': 'This user account has been disabled.',
      'TOO_MANY_ATTEMPTS_TRY_LATER': 'Too many failed login attempts. Please try again later.',
      'INVALID_LOGIN_CREDENTIALS': 'Invalid email or password.',
      'MISSING_EMAIL': 'Email is required.',
      'MISSING_PASSWORD': 'Password is required.'
    };

    // Check if the error code exists in our map, otherwise return the default message
    return errorMap[error.code] || error.message || 'An error occurred during authentication. Please try again.';
  }

  forgotPassword() {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      this.submissionResult = { success: false, message: 'Email is required for password recovery.' };
      return;
    }
    
    this.submissionInProgress = true;
    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.submissionInProgress = false;
        this.submissionResult = { 
          success: true, 
          message: 'Password reset email sent. Please check your inbox.' 
        };
      },
      error: (err) => {
        this.submissionInProgress = false;
        this.submissionResult = { 
          success: false, 
          message: err?.message || 'Failed to send password reset email. Please try again.' 
        };
      }
    });
  }
}
