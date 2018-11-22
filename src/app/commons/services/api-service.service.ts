import { Injectable } from '@angular/core';
import { BaseUrl } from '../../../base_url';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

const headers = new HttpHeaders().set('content-tye', 'application/json');
@Injectable()
export class ApiService {

    base: BaseUrl = new BaseUrl();

    constructor(private http: HttpClient) {
    }

    getElements(url: string): Observable<any> {
        return this.http.get(this.base.urlBackend + url);
    }

    getPagesSort(url: string, page: number, size: number, sort: string, search?: string, category?: string): Observable<any> {
        search = search !== undefined ? search : '';
        category = category !== undefined ? category : '';
        const Gurl = `${this.base.urlBackend + url}/?page=${page}&size=${size}&sort=${sort}&search=${search}&category=${category}`;
        return this.http.get<any[]>(Gurl);
    }

    addElement(url: string, object: any): Observable<any> {
        return this.http.post<any>(this.base.urlBackend + url, object, { headers });
    }

    getElement(url, id: any): Observable<any> {
        return this.http.get<void>(this.base.urlBackend + url + '/' + id);
    }


    deleteElement(url, id: number): Observable<any> {
        return this.http.delete<void>(this.base.urlBackend + url + '/' + id);
    }

    pushFile(url: string, file: File): Observable<HttpEvent<{}>> {
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        const req = new HttpRequest('POST', this.base.urlBackend + url, formdata, {
            reportProgress: true,
            responseType: 'text'
        });
        return this.http.request(req);
    }


}
