import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, BackendService } from '../../../services';
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
  isInvitationValid = false;
  invitationValidationInProgress = false;
  invitationValidationResult: { success: boolean; message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private backend: BackendService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      password: [{value: '', disabled: !this.isInvitationValid}, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [{value: '', disabled: !this.isInvitationValid}, [Validators.required]]
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
    
    // Validate invitation if tripId is provided
    if (this.tripId) {
      this.validateInvitation(this.tripId);
    }
    
    // Subscribe to query param changes in case they change without component reload
    this.route.queryParamMap.subscribe(params => {
      const updatedEmail = params.get('email');
      const updatedTripId = params.get('tripId');
      
      if (updatedEmail && updatedEmail !== this.form.get('email')?.value) {
        this.form.patchValue({ email: updatedEmail });
      }
      
      if (updatedTripId && updatedTripId !== this.tripId) {
        this.tripId = updatedTripId;
        this.validateInvitation(updatedTripId);
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

  /**
   * Validate invitation with backend
   * @param collectionId The collection ID to validate
   */
  validateInvitation(collectionId: string) {
    if (!collectionId) {
      this.isInvitationValid = false;
      this.invitationValidationResult = {
        success: false,
        message: 'Trip ID is required'
      };
      this.updateFormState();
      return;
    }

    this.invitationValidationInProgress = true;
    this.invitationValidationResult = null;

    // For now, we'll use a placeholder token
    // In production, this should come from a secure source
    const token = 'placeholder-jwt-token';

    this.backend.validateInvitation(collectionId, token).subscribe({
      next: (response: any) => {
        this.invitationValidationInProgress = false;
        if (response.invitation === 'valid') {
          this.isInvitationValid = true;
          this.invitationValidationResult = {
            success: true,
            message: `Invitation validated for collection: ${response.collection?.name || 'Unknown'}`
          };
        } else {
          this.isInvitationValid = false;
          this.invitationValidationResult = {
            success: false,
            message: 'Invalid invitation'
          };
        }
        this.updateFormState();
      },
      error: (error: any) => {
        this.invitationValidationInProgress = false;
        this.isInvitationValid = false;
        this.invitationValidationResult = {
          success: false,
          message: error.message || 'Failed to validate invitation'
        };
        this.updateFormState();
      }
    });
  }

  /**
   * Update form state based on invitation validation
   */
  private updateFormState() {
    const passwordControl = this.form.get('password');
    const confirmPasswordControl = this.form.get('confirmPassword');

    if (this.isInvitationValid) {
      passwordControl?.enable();
      confirmPasswordControl?.enable();
    } else {
      passwordControl?.disable();
      confirmPasswordControl?.disable();
      passwordControl?.setValue('');
      confirmPasswordControl?.setValue('');
    }
  }

  submit() {
    if (this.form.invalid || !this.isInvitationValid) {
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
        // After successful Firebase registration, register user in backend
        const name = displayName; // Use display name as first name
        const lastname = ''; // Default empty last name - could be added to form later
        
        this.auth.registerBackend(email, this.tripId!, name, lastname).subscribe({
          next: (backendResponse) => {
            this.submissionInProgress = false;
            this.submissionResult = { 
              success: true, 
              message: 'Registration successful! User created in backend. Redirecting to profile...' 
            };
            // Redirect to profile
            this.router.navigate(
              ['/profile'], 
              { queryParams: this.tripId ? { tripId: this.tripId } : {} }
            );
          },
          error: (backendError) => {
            this.submissionInProgress = false;
            this.submissionResult = { 
              success: false, 
              message: `Firebase registration successful but backend registration failed: ${backendError.message || 'Backend error'}` 
            };
          }
        });
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
