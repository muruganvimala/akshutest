import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

interface ApiConfig {
  APIs: {
    kpiAPI: string;
    otherapi: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //http://localhost:5273/
  //http://10.0.4.3:2345/
  //http://10.3.0.6:2346/
  //http://13.127.126.231:2346/recent live
  //public baseUrl: string = '';
  //private baseUrl = 'https://apidevnsight.novatechset.com/';
  //private configUrl = 'assets/urlConfig.json';
  public baseUrl: string = 'http://localhost:5273/';

  constructor(private http: HttpClient) {
    
  }

  loadConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getKpiApiUrl().subscribe({
        next: (config) => {
          this.baseUrl = config.APIs.kpiAPI;
          console.log('KPI API URL:', this.baseUrl);
          resolve();
        },
        error: (error) => {
          console.error('Could not load config:', error);
          reject(error);
        }
      });
    });
  }

  getKpiApiUrl(): Observable<ApiConfig> {
    return this.http.get<ApiConfig>('assets/urlConfig.json').pipe(
      catchError(error => {
        console.error('Error loading configuration:', error);
        return throwError(() => new Error('Error loading configuration.'));
      })
    );
  }

  //Method to make a POST request with the token
  postDataWithToken(endpoint: string, data: any): Observable<any> {
    let url = `${this.baseUrl}${endpoint}`;
    console.log('calling api ' + this.baseUrl)
    let headers = new HttpHeaders()
      .set('Authorization', `Bearer ${sessionStorage.getItem('token')}`)
      .set('Content-Type', 'application/json');
    return this.http.post(url, JSON.stringify(data), { headers });
  }


  //Method to make a Get list response with the token
  GetDataWithToken(endpoint: string): Observable<any> {
    let url = `${this.baseUrl}${endpoint}`;
    let headers = new HttpHeaders()
      .set('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
    return this.http.get(url, { headers });
  }

  DeleteDataWithToken(endpoint: string): Observable<any> {
    let url = `${this.baseUrl}${endpoint}`;
    let headers = new HttpHeaders()
      .set('Authorization', `Bearer ${sessionStorage.getItem('token')}`)
      .set('Content-Type', 'application/json');
    return this.http.delete(url, { headers });
  }

  //Method to make a POST request with the token
  UpdateDataWithToken(endpoint: string, data: any): Observable<any> {
    let url = `${this.baseUrl}${endpoint}`;
    let headers = new HttpHeaders()
      .set('Authorization', `Bearer ${sessionStorage.getItem('token')}`)
      .set('Content-Type', 'application/json');
      console.log(JSON.stringify(data));
    return this.http.put<any>(url, JSON.stringify(data), { headers });
  }

  //Method to make a POST request without the token
  //for login
  postData(endpoint: string, data: any = null): Observable<any> {
    if (!this.baseUrl) {
      console.error('Base URL not initialized');
      return throwError('Base URL not initialized');
    }
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.post(url, data).pipe(
      catchError(error => {
        console.error('Error posting data:', error);
        return throwError(error);
      })
    );
  }

  uploadExcelFile(endpoint: string, file: File): Observable<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
 
    let headers = new HttpHeaders()
        .set('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
 
    return this.http.post(url, formData, { headers });
}
}