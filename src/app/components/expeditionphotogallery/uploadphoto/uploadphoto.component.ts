import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PhotoFromMyPhoneComponent } from "../photo-from-my-phone/photo-from-my-phone.component";
import { ButtonComponent } from "../../share/button/button.component";
import { UploadLoaderComponent } from "../../share/upload-loader/upload-loader.component";
import { Router, ActivatedRoute } from "@angular/router";
import { PhotoPickerService, PhotoFile } from "../../../services/photo-picker.service";
import { BackendService, UploadPhotosRequest, PhotoUploadRequest } from "../../../services/backend.service";
import { AuthService } from "../../../services/auth.service";
import { Auth } from "@angular/fire/auth";
import { Subscription } from "rxjs";

@Component({
  selector: "app-uploadphoto",
  templateUrl: "./uploadphoto.component.html",
  styleUrls: ["./uploadphoto.component.scss"],
  standalone: true,
  imports: [PhotoFromMyPhoneComponent, ButtonComponent, UploadLoaderComponent, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadphotoComponent implements OnInit, OnDestroy {
  // UI State
  selectedPhotos: PhotoFile[] = [];
  caption: string = '';
  onlyYouCanView: boolean = false;
  onlyYouCanShare: boolean = false;
  isLoading: boolean = false;
  loadingMessage: string = 'Uploading photos...';
  
  // Collection data
  collectionId: string = '';
  private subscriptions: Subscription[] = [];
  
  // Mock photo IDs for grid layout
  mockPhotoIds: string[] = Array.from({ length: 32 }, (_, i) => `photo-${i + 1}`);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private photoPicker: PhotoPickerService,
    private backend: BackendService,
    private auth: AuthService,
    private firebaseAuth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get collection ID from route params
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        this.collectionId = params['tripId'] || '';
        console.log('UploadPhotoComponent - Collection ID:', this.collectionId);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Open photo picker to select photos from device
  onSelectPhotos(): void {
    console.log('Opening photo picker...');
    
    this.photoPicker.selectPhotos(true).subscribe({
      next: (photos: PhotoFile[]) => {
        console.log('Photos selected:', photos);
        this.selectedPhotos = [...this.selectedPhotos, ...photos];
        console.log('Total selected photos:', this.selectedPhotos.length);
        
        // Forzar detección de cambios para actualizar el UI
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error selecting photos:', error);
        alert('Failed to select photos. Please try again.');
      }
    });
  }

  // Take photo with camera
  onTakePhoto(): void {
    console.log('Opening camera...');
    
    this.photoPicker.takePhoto().subscribe({
      next: (photo: PhotoFile) => {
        console.log('Photo taken:', photo);
        this.selectedPhotos.push(photo);
        console.log('Total selected photos:', this.selectedPhotos.length);
        
        // Forzar detección de cambios para actualizar el UI
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error taking photo:', error);
        alert('Failed to take photo. Please try again.');
      }
    });
  }

  // Remove selected photo
  removePhoto(photoToRemove: PhotoFile): void {
    console.log('Removing photo:', photoToRemove.filename);
    this.selectedPhotos = this.selectedPhotos.filter(photo => photo.filename !== photoToRemove.filename);
    console.log('Remaining photos:', this.selectedPhotos.length);
    
    // Forzar detección de cambios para actualizar el UI
    this.cdr.detectChanges();
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
    this.router.navigate(['/photo-gallery']);
  }

  onUpload(): void {
    if (this.selectedPhotos.length === 0 || !this.collectionId) {
      console.error('No photos selected or no collection ID');
      return;
    }

    // Validate photos
    for (const photo of this.selectedPhotos) {
      const validation = this.photoPicker.validatePhoto(photo);
      if (!validation.valid) {
        console.error('Photo validation failed:', photo.filename, validation.error);
        alert(`Photo "${photo.filename}" is not valid: ${validation.error}`);
        return;
      }
    }

    this.isLoading = true;
    this.loadingMessage = `Uploading ${this.selectedPhotos.length} photo(s)...`;

    // Get Firebase token
    const firebaseUser = this.firebaseAuth.currentUser;
    if (!firebaseUser) {
      console.error('No authenticated user');
      this.isLoading = false;
      return;
    }

    firebaseUser.getIdToken(true).then((token: string) => {
      // Prepare upload request
      const uploadRequest: UploadPhotosRequest = {
        collectionId: this.collectionId,
        photos: this.selectedPhotos.map(photo => ({
          file: photo.base64,
          filename: photo.filename,
          name: this.caption || photo.filename,
          description: this.caption || '',
          availableForOthers: !this.onlyYouCanView,
          availableToShare: this.onlyYouCanShare
        }))
      };

      console.log('Uploading photos:', uploadRequest);

      // Upload photos
      this.subscriptions.push(
        this.backend.uploadPhotos(uploadRequest, token).subscribe({
          next: (response) => {
            console.log('Upload successful:', response);
            this.isLoading = false;
            
            // Show success message
            alert(`Successfully uploaded ${response.photos.length} photo(s)!`);
            
            // Navigate back to photo gallery
            this.router.navigate(['/photo-gallery'], {
              queryParams: {
                tripId: this.collectionId,
                refresh: 'true' // Force refresh
              }
            });
          },
          error: (error) => {
            console.error('Upload failed:', error);
            this.isLoading = false;
            alert('Upload failed. Please try again.');
          }
        })
      );
    }).catch((error) => {
      console.error('Error getting auth token:', error);
      this.isLoading = false;
      alert('Authentication error. Please log in again.');
    });
  }

  goToTermsAndConditions(): void {
    // TODO: Navigate to terms and conditions page when it's created
    console.log('Navigate to Terms & Conditions');
  }

  // Getters for template
  get selectedCount(): number {
    return this.selectedPhotos.length;
  }
}