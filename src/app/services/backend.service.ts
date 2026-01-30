import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SessionInfo, UserTrips, TripDetail } from '../interfaces/capsule.interface';

// Interface para el request de subida de fotos
export interface PhotoUploadRequest {
  file: string; // base64
  filename: string;
  name?: string;
  description?: string;
  availableForOthers: boolean;
  availableToShare: boolean;
}

export interface UploadPhotosRequest {
  collectionId: string;
  photos: PhotoUploadRequest[];
}

export interface UploadPhotosResponse {
  success: boolean;
  message: string;
  photos: any[];
  collectionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly baseUrl: string;
  private readonly apiVersion: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.API_URL;
    this.apiVersion = environment.version_api;
  }

  /**
   * Build the complete URL for API endpoints
   * @param endpoint The endpoint path (e.g., 'capsule/users/validateInvitation')
   * @returns Complete URL
   */
  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${this.apiVersion}${endpoint}`;
  }

  /**
   * Build HTTP headers with authorization and content type
   * @param token JWT token for authorization (optional)
   * @returns HttpHeaders object
   */
  private buildHeaders(token?: string): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Handle HTTP errors
   * @param error The error response
   * @returns Observable with error message
   */
  private handleError(error: any): Observable<never> {
    console.error('Backend API Error:', error);
    
    // Extract error message from response or use default
    let errorMessage = 'An error occurred with the backend service';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.error) {
      // Backend error - could be string or object
      errorMessage = typeof error.error === 'string' 
        ? error.error 
        : error.error.message || error.error.error || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => ({ message: errorMessage, status: error.status }));
  }

  /**
   * Validate invitation for a collection
   * @param collectionId The collection ID to validate
   * @param token Firebase ID token for authorization
   * @returns Observable with validation result
   */
  validateInvitation(collectionId: string, token: string): Observable<any> {
    const url = this.buildUrl('capsule/users/validateInvitation');
    const headers = this.buildHeaders(token);
    const body = { collectionId };

    console.log('Backend validateInvitation request:');
    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('Body:', body);

    return this.http.post(url, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Sign up user in backend after Firebase registration
   * @param firebaseToken Firebase ID token
   * @param email User email
   * @param collectionId Collection ID
   * @param name User first name
   * @param lastname User last name
   * @param token JWT token for authorization (not used - Firebase token goes in header)
   * @returns Observable with user creation result
   */
  signup(
    firebaseToken: string,
    email: string,
    collectionId: string,
    name: string,
    lastname: string,
    token: string
  ): Observable<any> {
    const url = this.buildUrl('capsule/users/signup');
    // Use Firebase token in Authorization header for middleware authentication
    const headers = this.buildHeaders(firebaseToken);
    const body = {
      firebaseToken,  // Required by backend for user creation
      email,
      collectionId,
      name,
      lastname
    };

    console.log('Backend signup request:');
    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('Body:', { ...body, firebaseToken: body.firebaseToken.substring(0, 50) + '...' });

    return this.http.post(url, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Sign in user with backend
   * @param email User email
   * @param password User password (optional)
   * @param token Firebase ID token for authorization
   * @returns Observable with authentication result
   */
  signin(email: string, password?: string, token?: string): Observable<any> {
    const url = this.buildUrl('capsule/users/signin');
    // Use Firebase token in Authorization header for middleware authentication
    const headers = this.buildHeaders(token);
    const body = {
      userToken: {
        email,
        ...(password && { password })
      }
    };

    console.log('Backend signin request:');
    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('Body:', body);

    return this.http.post(url, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get session information (ships, etc.)
   * @param token Firebase ID token for authorization
   * @returns Observable with session information
   */
  getSessionInfo(token: string): Observable<SessionInfo> {
    const url = this.buildUrl('capsule/sessionInfo');
    const headers = this.buildHeaders(token);

    console.log('Backend getSessionInfo request:');
    console.log('URL:', url);
    console.log('Headers:', headers);

    return this.http.get<SessionInfo>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get user trips
   * @param userId Optional user ID from backend signin (_id), if not provided uses token
   * @param token Firebase ID token for authorization
   * @returns Observable with user trips
   */
  getUserTrips(userId?: string, token?: string): Observable<UserTrips> {
    const url = userId 
      ? this.buildUrl(`capsule/trips/${userId}`)
      : this.buildUrl('capsule/trips');
    const headers = this.buildHeaders(token);

    console.log('Backend getUserTrips request:');
    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('UserId provided:', userId || 'Using token-based identification');

    return this.http.get<UserTrips>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get trip details by collection ID
   * @param id Collection ID
   * @param token Firebase ID token for authorization
   * @returns Observable with trip details
   */
  getTripDetails(id: string, token: string): Observable<TripDetail> {
    const url = this.buildUrl(`capsule/trip/${id}`);
    const headers = this.buildHeaders(token);

    console.log('Backend getTripDetails request:');
    console.log('URL:', url);
    console.log('Headers:', headers);

    return this.http.get<TripDetail>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Upload photos to capsule collection
   * @param request Upload request with collection ID and photos
   * @param token Firebase ID token for authorization
   * @returns Observable with upload response
   */
  uploadPhotos(request: UploadPhotosRequest, token: string): Observable<UploadPhotosResponse> {
    const url = this.buildUrl('capsule/photos/');
    const headers = this.buildHeaders(token);

    console.log('Backend uploadPhotos request:');
    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('Request:', request);

    return this.http.post<UploadPhotosResponse>(url, request, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}
