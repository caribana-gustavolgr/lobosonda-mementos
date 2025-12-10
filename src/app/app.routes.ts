import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LogInComponent } from '../../figmular/export-result/log-in/log-in.component';
import { TripComponent } from './components/trip/trip.component';
import { ExpeditionPhotogalleryComponent } from './components/expeditionphotogallery/expeditionphotogallery.component';
import { PhotodetailComponent } from './components/photodetail/photodetail.component';
import { RegisterComponent } from './components/auth/register/register.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'trip', component: TripComponent },
    { path: 'photo-gallery', component: ExpeditionPhotogalleryComponent },
    { path: 'photo-detail', component: PhotodetailComponent },
    { path: 'app-uploadphoto', loadComponent: () => import('./components/expeditionphotogallery/uploadphoto/uploadphoto.component').then(m => m.UploadphotoComponent) },
    { path: 'figmular-login', loadComponent: () => import('../../figmular/export-result/log-in/log-in.component').then(m => m.LogInComponent) },
];
