import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../share/button/button.component';
import { PhotoGridItemComponent } from '../share/photo-grid-item/photo-grid-item.component';
import { ArrowsChevronLeftComponent } from '../share/arrows-chevron-left/arrows-chevron-left.component';
import { AuthService } from '../../services/auth.service';
import { TripDetail, Photo } from '../../interfaces/capsule.interface';
import { Subscription } from 'rxjs';

// Interface para los datos de fotos
interface PhotoData {
  id: string;
  imageUrl: string;
  title: string;
  date: string;
  canBePurchased: boolean;
  isOwnPhoto: boolean;
}

@Component({
  selector: 'app-expeditionphotogallery',
  imports: [FormsModule, CommonModule, ButtonComponent, PhotoGridItemComponent, ArrowsChevronLeftComponent],
  templateUrl: './expeditionphotogallery.component.html',
  styleUrls: ['../../../styles.scss','./expeditionphotogallery.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpeditionPhotogalleryComponent implements OnInit, OnDestroy {
  // Inputs para recibir datos del TripComponent
  @Input() tripData: TripDetail | null = null;
  @Input() photos: Photo[] = [];

  // Almacenar el trip ID recibido
  private currentTripId: string = '';

  // Filtros
  activeFilter: 'internalOnly' | 'myOnly' | null = null;
  currentUserId: string = '';

  // Subscriptions management
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    // Obtener el ID del usuario actual
    this.currentUserId = this.auth.getCurrentUser()?.uid || '';
    
    // Recibir datos del TripComponent a través de queryParams
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        console.log('ExpeditionPhotogallery - QueryParams:', params);
        
        // Check for refresh parameter
        if (params['refresh'] === 'true') {
          console.log('Refresh requested after upload - reloading data');
          // Reset photos to force reload
          this.photos = [];
          this.photoData = [];
        }
        
        // Parse trip data if provided
        if (params['tripData']) {
          try {
            const tripData = JSON.parse(params['tripData']);
            this.tripData = tripData;
            this.photos = tripData.collection?.photos || [];
            console.log('Trip data parsed:', this.tripData);
            console.log('Photos received:', this.photos);
          } catch (error) {
            console.error('Error parsing trip data:', error);
          }
        }
        
        // Store trip ID
        this.currentTripId = params['tripId'] || '';
        console.log('Current Trip ID:', this.currentTripId);
        console.log('Current User ID:', this.currentUserId);
      })
    );
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Navigate back to trip details
   */
  onBackToTripDetails(): void {
    if (this.currentTripId) {
      this.router.navigate(['/trip', this.currentTripId]);
    } else {
      // Fallback: navigate to my-trips if no trip ID available
      this.router.navigate(['/my-trips']);
    }
  }

  /**
   * Toggle filter for internal only photos (STANDARD type)
   */
  onInternalOnlyFilter(): void {
    if (this.activeFilter === 'internalOnly') {
      this.activeFilter = null; // Deselect if already active
    } else {
      this.activeFilter = 'internalOnly'; // Select this filter
    }
  }

  /**
   * Toggle filter for my photos only (CAPSULE type and current user)
   */
  onMyOnlyFilter(): void {
    if (this.activeFilter === 'myOnly') {
      this.activeFilter = null; // Deselect if already active
    } else {
      this.activeFilter = 'myOnly'; // Select this filter
    }
  }

  /**
   * Get filtered photos based on active filter
   */
  get filteredPhotos(): Photo[] {
    if (!this.photos || this.photos.length === 0) {
      return [];
    }

    switch (this.activeFilter) {
      case 'internalOnly':
        return this.photos.filter(photo => photo.type === 'STANDARD');
      case 'myOnly':
        return this.photos.filter(photo => 
          photo.type === 'CAPSULE' && photo.author._id === this.currentUserId
        );
      default:
        return this.photos; // No filter, return all photos
    }
  }

  /**
   * Check if there are no photos to display
   */
  get hasNoPhotos(): boolean {
    return this.filteredPhotos.length === 0;
  }

  /**
   * Get message to display when no photos are found
   */
  get noPhotosMessage(): string {
    if (this.activeFilter === 'myOnly') {
      return "You haven't uploaded any photos yet. Be the first to share your memories from this trip!";
    }
    if (this.activeFilter === 'internalOnly') {
      return "No Lobosonda photos found for this trip.";
    }
    return "No photos available for this trip.";
  }

  // Datos de ejemplo para el grid de fotos (se sobrescribirán con los inputs)
  photoData: PhotoData[] = [];

  // Getters para datos dinámicos del viaje
  get galleryTitle(): string {
    return this.tripData?.collection?.collectionName || 'Name of the tour as determined by the guide';
  }

  get galleryInfo(): string {
    if (this.tripData?.collection?.trip) {
      const date = this.tripData.collection.trip.tripDate;
      return this.formatDate(date);
    }
    return 'April 24th, 2025';
  }

  /**
   * Format date string to "Month Dayst, Year" format
   * Example: "2023-04-21" -> "April 21st, 2023"
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      
      // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
      const getOrdinalSuffix = (n: number) => {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      
      return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if formatting fails
    }
  }

  // Transformar las fotos del backend al formato PhotoData
  get transformedPhotos(): PhotoData[] {
    const photosToTransform = this.filteredPhotos; // Use filtered photos instead of all photos
    
    if (photosToTransform && photosToTransform.length > 0) {
      return photosToTransform.map((photo, index) => ({
        id: photo._id || `photo-${index}`,
        imageUrl: photo.thumbnail || photo.edited || '',
        title: photo.name || `Photo ${index + 1}`,
        date: new Date().toISOString(), // Photo no tiene createdAt, usamos fecha actual
        canBePurchased: photo.availableForOthers || false,
        isOwnPhoto: photo.availableToShare || false
      }));
    }
    return this.photoData; // Fallback a datos de ejemplo
  }

  onUploadPhotosClick(): void {
    console.log('Upload Photo clicked!');
    
    // Navigate to upload photo page with trip data
    if (this.currentTripId) {
      this.router.navigate(['/app-uploadphoto'], {
        queryParams: {
          tripId: this.currentTripId
        }
      });
    } else {
      console.error('No trip ID available for upload');
      // Show error message to user
      alert('Unable to upload photos: Trip information not available');
    }
  }

  onPhotoSelected(photoId: string): void {
    console.log('Photo selected:', photoId);
    // Lógica para pre-visualizar la foto
  }

  onPurchaseClicked(photoId: string): void {
    console.log('Purchase clicked for photo:', photoId);
    // Lógica para iniciar el proceso de compra
  }

  onEditClicked(photoId: string): void {
    console.log('Edit clicked for photo:', photoId);
    // Lógica para editar la foto
  }

  onDeleteClicked(photoId: string): void {
    console.log('Delete clicked for photo:', photoId);
    // Lógica para eliminar la foto
  }
}
