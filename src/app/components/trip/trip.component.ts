import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonComponent } from '../share/button/button.component';
import { SightingRowComponent } from '../sighting-row/sighting-row.component';
import { ArrowsChevronLeftComponent } from "../share/arrows-chevron-left/arrows-chevron-left.component";
import { AuthService } from "../../services/auth.service";
import { BackendService } from "../../services/backend.service";
import { TripDetail } from "../../interfaces/capsule.interface";
import { Auth } from "@angular/fire/auth";
import { Subscription } from "rxjs";
@Component({
  selector: "app-trip",
  templateUrl: "./trip.component.html",
  styleUrls: ['../../../styles.scss',"./trip.component.scss"],
  standalone: true,
  imports: [
    ArrowsChevronLeftComponent,
    FormsModule,
    CommonModule,
    ButtonComponent,
    SightingRowComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripComponent implements OnInit, OnDestroy {
  tripDetail: TripDetail | null = null;
  loading = false;
  error: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private backend: BackendService,
    private firebaseAuth: Auth
  ) {}

  ngOnInit() {
    this.loadTripDetails();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadTripDetails() {
    this.loading = true;
    this.error = null;

    // Get trip ID from route parameters
    this.route.paramMap.subscribe(params => {
      const tripId = params.get('id');
      
      if (!tripId) {
        this.error = 'Trip ID not provided';
        this.loading = false;
        return;
      }

      // Get Firebase token for authentication
      const firebaseUser = this.firebaseAuth.currentUser;
      if (firebaseUser) {
        firebaseUser.getIdToken(true).then((token: any) => {
          if (token) {
            this.subscriptions.push(
              this.backend.getTripDetails(tripId, token).subscribe({
                next: (detail: TripDetail) => {
                  this.tripDetail = detail;
                  this.loading = false;
                  console.log('Trip details loaded:', detail);
                },
                error: (err: any) => {
                  this.error = err.message || 'Failed to load trip details';
                  this.loading = false;
                  console.error('Error loading trip details:', err);
                }
              })
            );
          } else {
            this.error = 'Failed to get authentication token';
            this.loading = false;
          }
        }).catch((err: any) => {
          this.error = 'Failed to get authentication token';
          this.loading = false;
          console.error('Error getting token:', err);
        });
      } else {
        this.error = 'No Firebase user authenticated';
        this.loading = false;
      }
    });
  }

  onPhotoGalleryClick(): void {
    console.log('Photo Gallery clicked!');
    // Navigate to photo gallery with trip data
    if (this.tripDetail) {
      // Pass trip data as JSON in queryParams
      const tripData = {
        collection: this.tripDetail.collection
      };
      
      this.router.navigate(['/photo-gallery'], { 
        queryParams: { 
          tripData: JSON.stringify(tripData),
          tripId: this.getTripId() 
        } 
      });
    }
  }

  onBackToTrips(): void {
    this.router.navigate(['/my-trips']);
  }

  // Getters for template data
  get tripName(): string {
    return this.tripDetail?.collection?.collectionName || 'Tour Details';
  }

  get tripDate(): string {
    return this.tripDetail?.collection?.trip?.tripDate || '';
  }

  get tripTime(): string {
    return this.tripDetail?.collection?.trip?.tripTime || '';
  }

  get tripGuide(): string {
    const guide = this.tripDetail?.collection?.trip?.tripGuide;
    return guide ? `${guide.name} ${guide.lastName}` : 'Guide';
  }

  get tripBoat(): string {
    return this.tripDetail?.collection?.trip?.tripBoat || 'Boat';
  }

  get tripTemp(): string {
    return this.tripDetail?.collection?.trip?.temp || 'N/A';
  }

  get tripWind(): string {
    return this.tripDetail?.collection?.trip?.wind || 'N/A';
  }

  get tripBright(): string {
    return this.tripDetail?.collection?.trip?.bright || 'N/A';
  }

  get sightings() {
    return this.tripDetail?.collection?.trip?.sightings || [];
  }

  get photosAmount(): number {
    return this.tripDetail?.collection?.photosAmount || 0;
  }

  get photos() {
    return this.tripDetail?.collection?.photos || [];
  }

  private getTripId(): string {
    // Extract trip ID from route or use a default
    return this.route.snapshot.paramMap.get('id') || '';
  }
}
