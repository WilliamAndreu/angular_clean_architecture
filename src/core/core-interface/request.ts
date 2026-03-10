import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Request {
  private http = inject(HttpClient);

  doRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    body?: unknown,
    params?: Record<string, string | number>,
  ): Observable<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const httpParams = params
      ? new HttpParams({ fromObject: params as Record<string, string> })
      : undefined;

    return this.http.request<T>(method, url, { headers, body, params: httpParams });
  }
}
