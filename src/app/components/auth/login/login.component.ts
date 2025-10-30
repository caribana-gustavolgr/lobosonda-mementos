import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services';
import { FacebookComponent } from '../../share/facebook/facebook.component';
import { InstagramComponent } from '../../share/instagram/instagram.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FacebookComponent, InstagramComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Prefer local assets in the project (use the download script to populate `src/assets/figma/`)
  instagramIcon = '/assets/figma/instagram.png';
  facebookIcon = '/assets/figma/facebook.png';
  image2 = '/assets/figma/image2.png';

  form: FormGroup;
  submissionInProgress = false;
  submissionResult: { success: boolean; message: string } | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.form.get('email');
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submissionInProgress = true;
    this.submissionResult = null;

    const email = this.form.value.email;
    // Use the AuthService - currently a dummy implementation that returns a delayed observable
    this.auth.register(email).subscribe({
      next: (res) => {
        this.submissionInProgress = false;
        this.submissionResult = { success: res.success, message: res.message };
      },
      error: (err) => {
        this.submissionInProgress = false;
        this.submissionResult = { success: false, message: err?.message || 'Unknown error' };
      }
    });
  }
}
