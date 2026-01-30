import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  
  if (user) {
    // User is authenticated, allow access
    return true;
  } else {
    // User is not authenticated, redirect to login
    console.log('Access denied: User not authenticated. Redirecting to login...');
    router.navigate(['/login']);
    return false;
  }
};
