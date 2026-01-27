import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../share/button/button.component';
import { ArrowsChevronLeftComponent } from '../share/arrows-chevron-left/arrows-chevron-left.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photoreport',
  templateUrl: './photoreport.component.html',
  styleUrls: ['./photoreport.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, ArrowsChevronLeftComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoReportComponent {
  photoName = 'Potâmio Meso';
  photoDate = '16 April 2025 13:53';
  photoCaption = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna !';
  
  reportReason = '';
  isReportSubmitted = false;

  constructor(private router: Router) {}

  onSubmitReport() {
    if (this.reportReason.trim()) {
      console.log('Submitting report:', {
        photoName: this.photoName,
        reason: this.reportReason
      });
      this.isReportSubmitted = true;
    }
  }

  onCancel() {
    this.goBack();
  }

  goBack() {
    this.router.navigate(['/photo-detail']);
  }

  goToPhotoGallery() {
    this.router.navigate(['/photo-gallery']);
  }
}
