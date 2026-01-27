import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../share/button/button.component';
import { ArrowsChevronLeftComponent } from '../share/arrows-chevron-left/arrows-chevron-left.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photoedit',
  templateUrl: './photoedit.component.html',
  styleUrls: ['./photoedit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, ArrowsChevronLeftComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoEditComponent {
  photoName = 'Potâmio Meso';
  photoDate = '16 April 2025 13:53';
  photoCaption = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna !';
  
  // Privacy settings (same logic as UploadPhotoComponent)
  onlyYouCanView: boolean = false;
  onlyYouCanShare: boolean = false;

  constructor(private router: Router) {}

  onSaveChanges() {
    console.log('Saving photo changes:', {
      name: this.photoName,
      caption: this.photoCaption,
      onlyYouCanView: this.onlyYouCanView,
      onlyYouCanShare: this.onlyYouCanShare
    });
    // TODO: Save to backend and navigate back
    this.goBack();
  }

  onCancel() {
    this.goBack();
  }

  goBack() {
    // Navigate back to photo detail
    this.router.navigate(['/photo-detail']);
  }

  // Privacy methods (same logic as UploadPhotoComponent)
  onOnlyYouCanViewChange(): void {
    if (this.onlyYouCanView) {
      this.onlyYouCanShare = true;
    }
  }

  onOnlyYouCanShareChange(): void {
    if (!this.onlyYouCanView) {
      this.onlyYouCanShare = false;
    }
  }
}
