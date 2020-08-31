import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})



export class ReportService {



  constructor(private http: HttpClient) { }

  getReportingData(selection) {
      return this.http.get("https://localhost:44329/api/Northwind/getReportData/"+selection).pipe(map(result => result));
  }

  downloadReport(selection, type){
      return null;
  }

}
