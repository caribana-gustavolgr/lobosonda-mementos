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
  UserCredential,
  getIdToken
} from '@angular/fire/auth';
import { doc, setDoc, getDoc, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of, throwError } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { BackendService } from './backend.service';
import { SessionInfo } from '../interfaces/capsule.interface';

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
  private backend = inject(BackendService);
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
   * Register user in backend after Firebase registration
   * @param email User's email
   * @param collectionId Collection ID for invitation
   * @param name User first name
   * @param lastname User last name
   * @returns Observable with backend user creation result
   */
  registerBackend(
    email: string, 
    collectionId: string, 
    name: string, 
    lastname: string
  ): Observable<any> {
    // Wait for auth state to be updated and then get token
    return new Observable<string>(observer => {
      const checkUserAndGetToken = () => {
        const user = this.auth.currentUser;
        console.log('Current user:', user);
        
        if (user) {
          console.log('User found, getting ID token...');
          // Force token refresh to get a fresh token
          user.getIdToken(true).then(firebaseToken => {
            console.log('Firebase token obtained:', firebaseToken ? 'Token exists' : 'No token');
            console.log('Token length:', firebaseToken?.length || 0);
            console.log('Token preview:', firebaseToken?.substring(0, 50) + '...');
            
            if (!firebaseToken || firebaseToken.length < 100) {
              observer.error('Invalid Firebase token: Token is too short or empty');
              return;
            }
            
            observer.next(firebaseToken);
            observer.complete();
          }).catch((error: any) => {
            console.error('Failed to get Firebase token:', error);
            observer.error('Failed to get Firebase token: ' + error.message);
          });
        } else {
          console.log('User not found, waiting...');
          // Wait a bit and check again
          setTimeout(checkUserAndGetToken, 100);
        }
      };
      
      checkUserAndGetToken();
    }).pipe(
      switchMap((firebaseToken: string) => {
        console.log('Calling backend signup with token...');
        // Pass Firebase token as authorization token
        return this.backend.signup(firebaseToken, email, collectionId, name, lastname, firebaseToken);
      }),
      catchError((error) => {
        console.error('Backend registration error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Sign in user with backend (complement to Firebase auth)
   * @param email User's email
   * @param password User's password (optional)
   * @returns Observable with backend authentication result
   */
  signinBackend(email: string, password?: string): Observable<any> {
    // Wait for auth state to be updated and then get token
    return new Observable<string>(observer => {
      const checkUserAndGetToken = () => {
        const user = this.auth.currentUser;
        console.log('SigninBackend - Current user:', user);
        
        if (user) {
          console.log('SigninBackend - User found, getting ID token...');
          // Force token refresh to get a fresh token
          user.getIdToken(true).then(firebaseToken => {
            console.log('SigninBackend - Firebase token obtained:', firebaseToken ? 'Token exists' : 'No token');
            console.log('SigninBackend - Token length:', firebaseToken?.length || 0);
            
            if (!firebaseToken || firebaseToken.length < 100) {
              observer.error('Invalid Firebase token: Token is too short or empty');
              return;
            }
            
            observer.next(firebaseToken);
            observer.complete();
          }).catch((error: any) => {
            console.error('SigninBackend - Failed to get Firebase token:', error);
            observer.error('Failed to get Firebase token: ' + error.message);
          });
        } else {
          console.log('SigninBackend - User not found, waiting...');
          // Wait a bit and check again
          setTimeout(checkUserAndGetToken, 100);
        }
      };
      
      checkUserAndGetToken();
    }).pipe(
      switchMap((firebaseToken: string) => {
        console.log('SigninBackend - Calling backend signin with token...');
        // Pass Firebase token as authorization token
        return this.backend.signin(email, password, firebaseToken).pipe(
          tap((backendResponse) => {
            // Save backend user ID if available
            if (backendResponse && backendResponse._id) {
              localStorage.setItem('backendUserId', backendResponse._id);
              console.log('Backend user ID saved:', backendResponse._id);
            }
          })
        );
      }),
      catchError((error) => {
        console.error('SigninBackend - Backend signin error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get session information from backend
   * @returns Observable with session information
   */
  getSessionInfo(): Observable<SessionInfo> {
    // Wait for auth state to be updated and then get token
    return new Observable<string>(observer => {
      const checkUserAndGetToken = () => {
        const user = this.auth.currentUser;
        console.log('GetSessionInfo - Current user:', user);
        
        if (user) {
          console.log('GetSessionInfo - User found, getting ID token...');
          // Force token refresh to get a fresh token
          user.getIdToken(true).then(firebaseToken => {
            console.log('GetSessionInfo - Firebase token obtained:', firebaseToken ? 'Token exists' : 'No token');
            
            if (!firebaseToken || firebaseToken.length < 100) {
              observer.error('Invalid Firebase token: Token is too short or empty');
              return;
            }
            
            observer.next(firebaseToken);
            observer.complete();
          }).catch((error: any) => {
            console.error('GetSessionInfo - Failed to get Firebase token:', error);
            observer.error('Failed to get Firebase token: ' + error.message);
          });
        } else {
          console.log('GetSessionInfo - User not found, waiting...');
          // Wait a bit and check again
          setTimeout(checkUserAndGetToken, 100);
        }
      };
      
      checkUserAndGetToken();
    }).pipe(
      switchMap((firebaseToken: string) => {
        console.log('GetSessionInfo - Calling backend sessionInfo with token...');
        return this.backend.getSessionInfo(firebaseToken);
      }),
      catchError((error) => {
        console.error('GetSessionInfo - Backend sessionInfo error:', error);
        return throwError(() => error);
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
