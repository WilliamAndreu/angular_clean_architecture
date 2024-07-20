import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
    name: 'secureImg'
})
export class SecurePipe implements PipeTransform {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    async transform(url: string) {
        const token = localStorage.getItem('tk');
        const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
        const imageBlob = await this.http.get(url, {headers, responseType: 'blob'}).toPromise();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageBlob!);
        });
    }
}