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
import { catchError, map, tap } from 'rxjs/operators';

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

  getMoByTypeCategory(month: string, type: string, category: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    const body = { month, type, category }; // Request body sesuai dengan backend
  
    return this.http.post<any>(`${environment.apiUrlWebAdmin}/getMOByTypeCategory`, body, { headers }).pipe(
      tap(() => console.log(`Fetching MO data for: Month=${month}, Type=${type}, Category=${category}`)), // Debugging log
      map((response) => {
        // Cek apakah response ada dan memiliki data
        if (response && response.data) {
          console.log("response :",response)
          return response.data; // Kembalikan data yang valid
        } else {
          console.warn('Response data is null or undefined', response); // Jika data tidak ada, beri peringatan
          return []; // Kembalikan array kosong
        }
      }),
      catchError((err) => {
        console.error('Error fetching marketing orders:', err);
        return throwError(() => new Error(err.message || 'Server error'));
      })
    );
  }
  
}
