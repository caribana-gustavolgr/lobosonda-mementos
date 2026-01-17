import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PhotoFromMyPhoneComponent } from "../photo-from-my-phone/photo-from-my-phone.component";
import { ButtonComponent } from "../../share/button/button.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-uploadphoto",
  templateUrl: "./uploadphoto.component.html",
  styleUrls: ["./uploadphoto.component.scss"],
  standalone: true,
  imports: [PhotoFromMyPhoneComponent, ButtonComponent, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadphotoComponent {
  selectedPhotos: string[] = [];
  caption: string = '';
  onlyYouCanView: boolean = false;
  onlyYouCanShare: boolean = false;
  mockPhotoIds: string[] = Array.from({ length: 32 }, (_, i) => `photo-${i + 1}`);

  constructor(private router: Router) {}

  onPhotoSelect(photoId: string): void {
    const index = this.selectedPhotos.indexOf(photoId);
    if (index > -1) {
      this.selectedPhotos.splice(index, 1);
    } else {
      this.selectedPhotos.push(photoId);
    }
  }

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

  onCancel(): void {
    this.selectedPhotos = [];
    this.caption = '';
    this.onlyYouCanView = false;
    this.onlyYouCanShare = false;
  }

  onUpload(): void {
    if (this.selectedPhotos.length === 0) {
      return;
    }
    
    console.log('Uploading photos:', this.selectedPhotos);
    console.log('Caption:', this.caption);
    console.log('Privacy settings:', {
      onlyYouCanView: this.onlyYouCanView,
      onlyYouCanShare: this.onlyYouCanShare
    });
    
    // TODO: Implement actual upload logic with backend service
  }

  goToTermsAndConditions(): void {
    // TODO: Navigate to terms and conditions page when it's created
    console.log('Navigate to Terms & Conditions');
  }

  get selectedCount(): number {
    return this.selectedPhotos.length;
  }
}