import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PMStopMachine } from 'src/app/models/pm-stop-machine';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { toBackendTimestamp } from '../../../utils/parsing-number/parsing-number.service'

@Injectable({
  providedIn: 'root',
})
export class PMStopMachineService {

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }
  activatePMStopMachine(pmStopMachine: PMStopMachine): Observable<ApiResponse<PMStopMachine>> {
    let currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    const name = currentUserSubject.fullName;
    const params = new HttpParams().set('updatedBy', name);

    return this.http.post<ApiResponse<PMStopMachine>>(
      `${environment.apiUrlWebAdmin}/restorePMStop/${pmStopMachine.stop_MACHINE_ID}`,
      {}, // empty body
      {
        headers: this.getHeaders(),
        params: params
      }
    ).pipe(
      map(response => response),
      catchError(err => throwError(err))
    );
  }


  getPMStopMachineById(pmStopMachineID: number): Observable<ApiResponse<PMStopMachine>> {
    return this.http.get<ApiResponse<PMStopMachine>>(environment.apiUrlWebAdmin + '/getPMStopById/' + pmStopMachineID, { headers: this.getHeaders() });
  }

  getAllPMStopMachine(): Observable<ApiResponse<PMStopMachine[]>> {
    return this.http.get<ApiResponse<PMStopMachine[]>>(environment.apiUrlWebAdmin + '/getAllPMStops', { headers: this.getHeaders() });
  }

  //Method Update plant
  updatePMStopMachine(pmStopMachine: PMStopMachine): Observable<ApiResponse<PMStopMachine>> {
    let currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    const name = currentUserSubject.fullName;
    const formattedData = {
      ...pmStopMachine,
      "created_BY": pmStopMachine.created_BY,
      "last_UPDATED_BY": name,
      date_STOP: toBackendTimestamp(pmStopMachine.date_STOP.toString(), '00:00'),
      start_TIME: toBackendTimestamp(pmStopMachine.date_STOP.toString(), pmStopMachine.startTimeFormatted),
      end_TIME: toBackendTimestamp(pmStopMachine.date_STOP.toString(), pmStopMachine.endTimeFormatted),
    };
    return this.http
      .post<ApiResponse<PMStopMachine>>(
        environment.apiUrlWebAdmin + '/updatePMStop',
        formattedData,
        { headers: this.getHeaders() } // Menyertakan header
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  // Method Untuk Save
  SavePMStopMachine(pmStopMachine: PMStopMachine): Observable<ApiResponse<PMStopMachine>> {
    let currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    const name = currentUserSubject.fullName;
    const formattedData = {
      ...pmStopMachine,
      "created_BY": name,
      "last_UPDATED_BY": name,
      date_STOP: toBackendTimestamp(pmStopMachine.date_STOP.toString(), '00:00'),
      start_TIME: toBackendTimestamp(pmStopMachine.date_STOP.toString(), pmStopMachine.start_TIME),
      end_TIME: toBackendTimestamp(pmStopMachine.date_STOP.toString(), pmStopMachine.end_TIME)
    };

    return this.http
      .post<ApiResponse<PMStopMachine>>(
        environment.apiUrlWebAdmin + '/insertPMStop',
        formattedData,
        { headers: this.getHeaders() } // Menyertakan header
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  deletePmStopMachine(pmStopMachine: PMStopMachine): Observable<ApiResponse<PMStopMachine>> {
    let currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    const name = currentUserSubject.fullName;
    const params = new HttpParams().set('updatedBy', name);
    return this.http.post<ApiResponse<PMStopMachine>>(environment.apiUrlWebAdmin + '/softDeletePMStop/' + pmStopMachine.stop_MACHINE_ID,{},
      { headers: this.getHeaders(), params: params }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<PMStopMachine>> {
    return this.http.post<ApiResponse<PMStopMachine>>(environment.apiUrlWebAdmin + '/saveStopMachinesExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  exportExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportStopMachinesExcel`, { responseType: 'blob' as 'json' });
  }
  tamplateExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutStopMachinesExcel`, { responseType: 'blob' as 'json' });
  }
}
