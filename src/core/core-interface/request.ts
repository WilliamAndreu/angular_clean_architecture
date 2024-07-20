import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class Request {

  protected basePath = ``;
  protected http: HttpClient = this.injector.get(HttpClient);

  constructor(protected injector: Injector) {}

  doRequest<T>(
    method: keyof HttpClient,
    url: string,
    body: unknown = undefined,
    params?: keyof HttpParams,
  ): Observable<T> {
    return this.http.request<T>(method,url, {body})
  }

}
