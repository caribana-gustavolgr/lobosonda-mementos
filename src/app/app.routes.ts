import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { TripComponent } from './components/trip/trip.component';
import { ExpeditionPhotogalleryComponent } from './components/expeditionphotogallery/expeditionphotogallery.component';
import { PhotodetailComponent } from './components/photodetail/photodetail.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'trip', component: TripComponent },
    { path: 'photo-gallery', component: ExpeditionPhotogalleryComponent },
    { path: 'photo-detail', component: PhotodetailComponent },
];
