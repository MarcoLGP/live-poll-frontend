import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { TokenService } from './token-service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.authApiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.request<T>('GET', endpoint, { params });
  }

  post<T>(endpoint: string, body?: any, params?: any): Observable<T> {
    return this.request<T>('POST', endpoint, { body, params });
  }

  put<T>(endpoint: string, body?: any, params?: any): Observable<T> {
    return this.request<T>('PUT', endpoint, { body, params });
  }

  delete<T>(endpoint: string, params?: any): Observable<T> {
    return this.request<T>('DELETE', endpoint, { params });
  }

  private request<T>(method: string, endpoint: string, options: {
    body?: any;
    params?: any;
    headers?: HttpHeaders;
  } = {}): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const token = this.tokenService.getToken();

    let headers = options.headers || new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    let params: HttpParams | undefined;
    if (options.params) {
      params = this.buildParams(options.params);
    }

    return this.http.request<T>(method, url, {
      body: options.body,
      headers,
      params,
      withCredentials: true 
    });
  }

  private buildParams(obj: any): HttpParams {
    let params = new HttpParams();
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }
}