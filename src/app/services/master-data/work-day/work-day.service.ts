import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkDay } from 'src/app/models/WorkDay';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
// import { WDHours } from 'src/app/models/WDHours';
import { DWorkDay } from 'src/app/models/DWorkDay';
import { WDHoursSpecific } from 'src/app/models/WDHoursSpecific';

@Injectable({
  providedIn: 'root',
})
export class WorkDayService {
  // Isi tokenya

  constructor(private http: HttpClient) {}

  getAllWorkDaysByDateRange(dateStart: string, dateEnd: string): Observable<ApiResponse<WorkDay[]>> {
    return this.http.post<ApiResponse<WorkDay[]>>(
      environment.apiUrlWebAdmin + '/getAllWorkDaysByDateRange',
      { startDate: dateStart, endDate: dateEnd }, // Send JSON body
    );
  }
  

  updateWorkDay(workday: WorkDay): Observable<ApiResponse<WorkDay>> {
    return this.http.post<ApiResponse<WorkDay>>(
      environment.apiUrlWebAdmin + '/updateWorkDay',
      workday,
    );
  }

  
  getWorkDayByDate(dateTarget: string): Observable<ApiResponse<WorkDay>> {
    return this.http.post<ApiResponse<WorkDay>>(
      environment.apiUrlWebAdmin + '/getWorkDayByDate',
      { date: dateTarget }, 
    );
  }

  turnOnOvertime(dateTarget: string): Observable<ApiResponse<WorkDay>> {
    return this.http.post<ApiResponse<WorkDay>>(
      environment.apiUrlWebAdmin + '/turnOnOvertime',
      { dateWd: dateTarget }, // Send JSON body
    );
  }
  
  getDWorkDayByDate(buffer: string): Observable<ApiResponse<DWorkDay[]>> {
    return this.http.post<ApiResponse<DWorkDay[]>>(
      environment.apiUrlWebAdmin + '/getDWorkDayByDate',
      { date: buffer },
    );
  }
  

  saveDWorkDay(buffer: DWorkDay): Observable<ApiResponse<DWorkDay>> {
    return this.http.post<ApiResponse<DWorkDay>>(
      environment.apiUrlWebAdmin + '/saveDWorkDay',
      buffer,
    );
  }

  updateDWorkDay(buffer: DWorkDay): Observable<ApiResponse<DWorkDay>> {
    return this.http.post<ApiResponse<DWorkDay>>(
      environment.apiUrlWebAdmin + '/updateDWorkDay',
       buffer,
    );
  }
  deleteDWorkDay(buffer: DWorkDay): Observable<ApiResponse<DWorkDay>> {
    return this.http.post<ApiResponse<DWorkDay>>(
      environment.apiUrlWebAdmin + '/deleteDWorkDay',
       buffer,
    );
  }

  getDWorkDayHoursSpecificByDateDesc(target: string, type: string): Observable<ApiResponse<WDHoursSpecific>> {
    const body = { date: target, description: type };
  
    return this.http.post<ApiResponse<WDHoursSpecific>>(
      environment.apiUrlWebAdmin + '/getDWDSpec',
      body,
    );
  }

  updateShiftTimes(stime:string,etime:string,target:string,type: string,shift: number): Observable<ApiResponse<WDHoursSpecific>> {
    const requestBody = {
      startTime: stime,
      endTime: etime,
      parsedDate: target,
      description: type,
      shift: shift
    };
  
    return this.http.post<ApiResponse<WDHoursSpecific>>(
      environment.apiUrlWebAdmin + '/updateShiftTimes',
      requestBody,
    );
  }

  saveDWorkDayHoursSpecific(wdhours: WDHoursSpecific): Observable<ApiResponse<WDHoursSpecific>> {
    return this.http.post<ApiResponse<WDHoursSpecific>>(
      environment.apiUrlWebAdmin + '/saveDWorkDayHoursSpecific',
      wdhours,
    );
  }  
  updateDWorkDayHoursSpecific(wdhours: WDHoursSpecific): Observable<ApiResponse<WDHoursSpecific>> {
    return this.http.post<ApiResponse<WDHoursSpecific>>(
      environment.apiUrlWebAdmin + '/updateDWorkDayHoursSpecific',
      wdhours,
    );
  }
 
    // getDWorkDayHoursByDateDesc(dateTarget: string, targetdesc: string): Observable<ApiResponse<WDHours>> {
  //   return this.http.get<ApiResponse<WDHours>>(
  //     environment.apiUrlWebAdmin + '/getDWorkDayHoursByDateDesc/' + dateTarget+"/"+targetdesc,
  //   );
  // }

  // turnOnHour(dateTarget: string,hour: string,type: string): Observable<ApiResponse<WDHours>> {
  //   return this.http.post<ApiResponse<WDHours>>(
  //     environment.apiUrlWebAdmin + '/turnOnHour/'+dateTarget+"/"+hour+"/"+type,
  //   );
  // }
  // turnOffHour(dateTarget: string,hour: string,type: string): Observable<ApiResponse<WDHours>> {
  //   return this.http.post<ApiResponse<WDHours>>(
  //     environment.apiUrlWebAdmin + '/turnOffHour/'+dateTarget+"/"+hour+"/"+type,
  //   );
  // }

  // updateDWorkDayHours(wdhours: WDHours): Observable<ApiResponse<WDHours>> {
  //   return this.http.post<ApiResponse<WDHours>>(
  //     environment.apiUrlWebAdmin + '/updateDWorkDayHours',
  //     wdhours,
  //   );
  // }

  // saveDWorkDayHours(wdhours: WDHours): Observable<ApiResponse<WDHours>> {
  //   console.log(wdhours);
  //   return this.http.post<ApiResponse<WDHours>>(
  //     environment.apiUrlWebAdmin + '/saveDWorkDayHours',
  //     wdhours,
  //   );
  // }
}