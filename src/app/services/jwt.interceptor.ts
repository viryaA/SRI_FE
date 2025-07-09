import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = currentUser && token;

    // Check token expiration
    if (token && this.authenticationService.isTokenExpired(token)) {
      this.authenticationService.logout();
      this.router.navigate(['/login']).then(() => {
        window.location.reload(); // 🔁 Force reload after redirect
      });
      return throwError(() => new Error('Token expired. User logged out.'));
    }

    if (isLoggedIn) {
      let headers: any = {
        Authorization: `Bearer ${token}`,
      };

      // Add Content-Type if not FormData
      if (!(request.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      request = request.clone({
        setHeaders: headers,
      });
    }

    return next.handle(request);
  }
}
