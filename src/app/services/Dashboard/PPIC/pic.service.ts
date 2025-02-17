import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/response/Response';
import { environment } from 'src/environments/environment';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { DashboardWDAllMonth } from 'src/app/models/DashboardWDAllMonth';
import { WorkDay } from 'src/app/models/WorkDay';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardPPIC {
  constructor(private http: HttpClient) { }

  getWorkDayAllMonth(year: number): Observable<any> {
    return this.http.post<any>(environment.apiUrlWebAdmin + '/getWorkDayAllMonth', { year }).pipe(
      map((response) => response.data), // Ambil hanya bagian data dari response
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
