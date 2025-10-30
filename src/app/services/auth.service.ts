import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface DummyResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  register(email: string): Observable<DummyResponse> {
    const ok = !!email && email.includes('@');
    const response: DummyResponse = ok
      ? { success: true, message: 'Registered (dummy response)' }
      : { success: false, message: 'Invalid email' };

    return of(response).pipe(delay(700));
  }
}
