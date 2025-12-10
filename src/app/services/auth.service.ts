import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  User as FirebaseUser,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  UserCredential
} from '@angular/fire/auth';
import { doc, setDoc, getDoc, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of, throwError } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Subscribe to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const userData: User = this.mapFirebaseUserToUser(user);
        this.currentUserSubject.next(userData);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  /**
   * Login with email and password
   * @param email User's email
   * @param password User's password
   * @returns Observable with user data
   */
  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => this.mapFirebaseUserToUser(userCredential.user)),
      tap((user) => this.currentUserSubject.next(user)),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => this.getAuthError(error.code));
      })
    );
  }

  /**
   * Register a new user with email and password
   * @param email User's email
   * @param password User's password
   * @param displayName User's display name
   * @returns Observable with user data
   */
  register(email: string, password: string, displayName: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        const displayNameToUse = displayName || email.split('@')[0];
        
        // Update user profile with display name
        return from(updateProfile(user, { displayName: displayNameToUse })).pipe(
          map(() => this.mapFirebaseUserToUser(user, displayNameToUse))
        );
      }),
      tap((user) => this.currentUserSubject.next(user)),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => this.getAuthError(error.code));
      })
    );
  }

  /**
   * Logout the current user
   * @returns Observable that completes when logout is done
   */
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => this.currentUserSubject.next(null)),
      catchError((error) => {
        console.error('Logout error:', error);
        return throwError(() => this.getAuthError(error.code));
      })
    );
  }

  /**
   * Send password reset email
   * @param email User's email
   * @returns Observable that completes when email is sent
   */
  forgotPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      catchError((error) => {
        console.error('Password reset error:', error);
        return throwError(() => this.getAuthError(error.code));
      })
    );
  }

  /**
   * Check if user is authenticated
   * @returns boolean indicating if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  /**
   * Get current user data
   * @returns Current user data or null if not authenticated
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Map Firebase User to our User interface
   * @param user Firebase User object
   * @param customDisplayName Optional custom display name
   * @returns User object
   */
  private mapFirebaseUserToUser(user: FirebaseUser, customDisplayName?: string): User {
    return {
      uid: user.uid,
      email: user.email,
      displayName: customDisplayName || user.displayName,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL
    };
  }

  /**
   * Get user-friendly error message from error code
   * @param errorCode Firebase error code
   * @returns Error object with user-friendly message
   */
  private getAuthError(errorCode: string): { code: string; message: string } {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already in use by another account.',
      'auth/invalid-email': 'The email address is not valid.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
      'auth/weak-password': 'The password is too weak (minimum 6 characters).',
      'auth/user-disabled': 'This user account has been disabled.',
      'auth/user-not-found': 'No user found with this email.',
      'auth/wrong-password': 'The password is invalid or the user does not have a password.',
      'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
      'auth/requires-recent-login': 'Please log in again before retrying this request.'
    };

    return {
      code: errorCode,
      message: errorMessages[errorCode] || 'An unknown error occurred. Please try again.'
    };
  }
}
