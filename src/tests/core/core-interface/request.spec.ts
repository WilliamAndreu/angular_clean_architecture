import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { Request } from '@interface-core/request';  // Ajusta la ruta según tu estructura de proyecto
import { HttpClient, HttpParams, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Request', () => {
  let service: Request;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        Request,
        {
            provide: Injector,
            useValue: {
                get: (token: any) => TestBed.inject(token)
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

    service = TestBed.inject(Request);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request', () => {
    const mockData = { data: 'test' };

    service.doRequest('get', '/test-url').subscribe((response:any) => {
      expect(response).toEqual(mockData);
    });

    const req = httpMock.expectOne('/test-url');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should make a POST request with body', () => {
    const mockData = { data: 'test' };
    const requestBody = { key: 'value' };

    service.doRequest('post', '/test-url', requestBody).subscribe((response:any) => {
      expect(response).toEqual(mockData);
    });

    const req = httpMock.expectOne('/test-url');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestBody);
    req.flush(mockData);
  });

  // Agrega más tests según sea necesario
});
