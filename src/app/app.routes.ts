import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LogInComponent } from '../../figmular/export-result/log-in/log-in.component';
import { TripComponent } from './components/trip/trip.component';
import { ExpeditionPhotogalleryComponent } from './components/expeditionphotogallery/expeditionphotogallery.component';
import { PhotodetailComponent } from './components/photodetail/photodetail.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MyTripsComponent } from './components/my-trips/my-trips.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Public routes - no authentication required
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'figmular-login', loadComponent: () => import('../../figmular/export-result/log-in/log-in.component').then(m => m.LogInComponent) },
    
    // Protected routes - authentication required
    { path: 'trip/:id', component: TripComponent, canActivate: [authGuard] },
    { path: 'trip', component: TripComponent, canActivate: [authGuard] }, // Keep for backward compatibility
    { path: 'photo-gallery', component: ExpeditionPhotogalleryComponent, canActivate: [authGuard] },
    { path: 'photo-detail', component: PhotodetailComponent, canActivate: [authGuard] }, //TODO
    { path: 'my-trips', component: MyTripsComponent, canActivate: [authGuard] },
    { path: 'app-uploadphoto', loadComponent: () => import('./components/expeditionphotogallery/uploadphoto/uploadphoto.component').then(m => m.UploadphotoComponent), canActivate: [authGuard] },
    { path: 'photo-from-my-phone', loadComponent: () => import('./components/expeditionphotogallery/photo-from-my-phone/photo-from-my-phone.component').then(m => m.PhotoFromMyPhoneComponent), canActivate: [authGuard] },
    { path: 'photo-edit', loadComponent: () => import('./components/photoedit/photoedit.component').then(m => m.PhotoEditComponent), canActivate: [authGuard] },
    { path: 'photo-report', loadComponent: () => import('./components/photoreport/photoreport.component').then(m => m.PhotoReportComponent), canActivate: [authGuard] },
    
    // Default route - redirect to login
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
    // Wildcard route - redirect to login for any unknown routes
    { path: '**', redirectTo: '/login' }
];
