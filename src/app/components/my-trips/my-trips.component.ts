import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Auth } from "@angular/fire/auth";
import { ArrowsChevronRightSmComponent } from "../share/arrows-chevron-right-sm/arrows-chevron-right-sm.component";
import { AuthService } from "../../services/auth.service";
import { BackendService } from "../../services/backend.service";
import { UserTrips, UserTrip } from "../../interfaces/capsule.interface";
import { Subscription } from "rxjs";
@Component({
  selector: "app-my-trips",
  templateUrl: "./my-trips.component.html",
  styleUrls: ["../../../styles.scss","./my-trips.component.scss"],
  standalone: true,
  imports: [ArrowsChevronRightSmComponent, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTripsComponent implements OnInit, OnDestroy {
  userTrips: UserTrips | null = null;
  loading = false;
  error: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private backend: BackendService,
    private firebaseAuth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUserTrips();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUserTrips() {
    this.loading = true;
    this.error = null;

    // Get current user and load trips
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) {
      console.log('User not authenticated, redirecting to login');
      // Redirect to login instead of showing error
      this.router.navigate(['/login']);
      return;
    }

    // Get Firebase token for authentication
    const firebaseUser = this.firebaseAuth.currentUser;
    if (firebaseUser) {
      firebaseUser.getIdToken(true).then((token: any) => {
        if (token) {
          // Try to get backend user ID from localStorage (saved during signin)
          const backendUserId = localStorage.getItem('backendUserId');
          
          this.subscriptions.push(
            this.backend.getUserTrips(backendUserId || undefined, token).subscribe({
              next: (trips: UserTrips) => {
                this.userTrips = trips;
                this.loading = false;
                console.log('User trips loaded:', trips);
                console.log('Used backend user ID:', backendUserId || 'Token-based identification');
                console.log('Collections length:', trips.collections?.length || 0);
                console.log('Has trips:', this.hasTrips);
                
                // Forzar detección de cambios debido a OnPush strategy
                this.cdr.detectChanges();
              },
              error: (err: any) => {
                this.error = err.message || 'Failed to load trips';
                this.loading = false;
                console.error('Error loading trips:', err);
                // Forzar detección de cambios
                this.cdr.detectChanges();
              }
            })
          );
        } else {
          this.error = 'Failed to get authentication token';
          this.loading = false;
          this.cdr.detectChanges();
        }
      }).catch((err: any) => {
        this.error = 'Failed to get authentication token';
        this.loading = false;
        console.error('Error getting token:', err);
        this.cdr.detectChanges();
      });
    } else {
      console.log('No Firebase user authenticated, redirecting to login');
      // Redirect to login instead of showing error
      this.router.navigate(['/login']);
    }
  }

  onTripClick(trip: UserTrip) {
    // Navigate to trip component with trip details
    console.log('Trip clicked:', trip);
    // Navigate to trip page with collection ID
    // We need to extract the collection ID from the trip data
    // For now, we'll use the collection name as an identifier
    // In a real implementation, the trip should have an ID field
    //const tripId = trip.collectionName.replace(/\s+/g, '-').toLowerCase(); // Convert name to ID format
    const tripId = trip._id;
    this.router.navigate(['/trip', tripId]);
  }

  get userName(): string {
    const user = this.auth.getCurrentUser();
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  }

  get hasTrips(): boolean {
    return !!(this.userTrips?.collections && this.userTrips.collections.length > 0);
  }

  get trips(): UserTrip[] {
    return this.userTrips?.collections || [];
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
}
