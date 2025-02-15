import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/response/Response';
import { environment } from 'src/environments/environment';
import { FrontRear } from 'src/app/models/FrontRear';
import { TempMachineProduct } from 'src/app/models/TempMachineProduct';

import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FrontRearService {

  constructor(private http: HttpClient) { }

  getAllFrontRearItems(): Observable<ApiResponse<FrontRear[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getAllFrontRearItems');
  }

  getFrontRearItemById(id_FRONT_REAR: number): Observable<ApiResponse<FrontRear[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getFrontRearItemById/' + id_FRONT_REAR);
  }

  saveFrontRearItems(dataFrontRear: FrontRear[]): Observable<ApiResponse<FrontRear[]>> {
    console.log("dataFrontRear passed:", dataFrontRear); // Log the entire array
    console.log("Type of dataFrontRear:", typeof dataFrontRear);
    console.log("Is dataFrontRear an array?:", Array.isArray(dataFrontRear));
    console.log("Length of dataFrontRear:", dataFrontRear?.length);
    if (dataFrontRear.length > 0) {
        return this.http.post<ApiResponse<FrontRear[]>>(environment.apiUrlWebAdmin + '/saveFrontRearItems', dataFrontRear).pipe(
            map((response) => response),
            catchError((err) => throwError(err))
        );
    } else {
        console.warn("dataFrontRear is empty or undefined.");
        return null;
    }
}


  saveTempMachineProduct(temp: TempMachineProduct[]): Observable<ApiResponse<TempMachineProduct[]>> {
    return this.http.post<ApiResponse<TempMachineProduct[]>>(environment.apiUrlWebAdmin + '/saveMachineProduct', temp).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getMachineProductsmoByCuring(mo1: string, mo2: string, item: string): Observable<ApiResponse<TempMachineProduct[]>> {
    const params = new HttpParams()
      .set('moId1', mo1.toString())
      .set('moId2', mo2.toString())
      .set('itemCuring', item.toString());
    return this.http.get<ApiResponse<TempMachineProduct[]>>(
      `${environment.apiUrlWebAdmin}/getMachineProductsmoByCuring`,
      { params }
    ).pipe(
      map((response) => {
        if (!response) {
          throw new Error('Empty response');
        }
        return response;
      }),
      catchError((err) => {
        console.error("Error:", err);
        return throwError(err);
      })
    );
  }  

  getAlldetailIdMobyCuring(mo1: string, mo2: string, item: string): Observable<ApiResponse<FrontRear[]>> {
    const params = new HttpParams()
      .set('moId1', mo1.toString())
      .set('moId2', mo2.toString())
      .set('itemCuring', item.toString());
    return this.http.get<ApiResponse<FrontRear[]>>(
      `${environment.apiUrlWebAdmin}/getAlldetailIdMobyCuring`,
      { params }
    ).pipe(
      map((response) => {
        if (!response) {
          throw new Error('Empty response');
        }
        return response;
      }),
      catchError((err) => {
        console.error("Error:", err);
        return throwError(err);
      })
    );
  }  

}



