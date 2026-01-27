import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ArrowsChevronLeftComponent } from "../share/arrows-chevron-left/arrows-chevron-left.component";
import { ArrowsChevronRightSmComponent } from "../share/arrows-chevron-right-sm/arrows-chevron-right-sm.component";
import { ButtonComponent } from "../share/button/button.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-photodetail",
  templateUrl: "./photodetail.component.html",
  styleUrls: ["./photodetail.component.scss"],
  standalone: true,
  imports: [ArrowsChevronLeftComponent, ArrowsChevronRightSmComponent, FormsModule, CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotodetailComponent {
  currentPhotoIndex = 0;
  totalPhotos = 5;
  photoName = "Potâmio Meso";
  photoDate = "16 April 2025 13:53";
  photoCaption = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna !";

  constructor(private router: Router) {}

  onSharePhoto() {
    // TODO: Navigate to share photo component when created
    console.log('Navigate to share photo');
  }

  onEditPhoto() {
    // Navigate to edit photo component
    this.router.navigate(['/photo-edit']);
  }

  onReportImage() {
    // Navigate to report image component
    this.router.navigate(['/photo-report']);
  }

  onPreviousPhoto() {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
    }
  }

  onNextPhoto() {
    if (this.currentPhotoIndex < this.totalPhotos - 1) {
      this.currentPhotoIndex++;
    }
  }

  goToHome() {
    this.router.navigate(['/my-trips']);
  }

  goToPhotoGallery() {
    this.router.navigate(['/photo-gallery']);
  }
}