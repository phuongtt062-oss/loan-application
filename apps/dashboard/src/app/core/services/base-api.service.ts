import { inject, Injectable } from "@angular/core";
import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { environment } from "@env/environment";
import type { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected abstract readonly apiName: string;

  private get baseUrl(): string {
    const root = environment.apiUrl.replace(/\/+$/, "");
    const segment = this.apiName.replace(/^\/+|\/+$/g, "");
    // return segment ? `${root}/${segment}` : root;
    return segment ? `${segment}` : root;
  }

  private requestUrl(path: string): string {
    const p = path.replace(/^\/+/, "");
    return `api/${this.baseUrl}/${p}`;
  }

  getApi<T>(path: string, params: HttpParams): Observable<T> {
    return this.http.get<T>(this.requestUrl(path), { params });
  }

  postApi<T>(path: string, body: unknown, context?: HttpContext): Observable<T> {
    return this.http.post<T>(this.requestUrl(path), body, { context });
  }

  postApiPartner<T>(path: string, body: unknown, context?: HttpContext): Observable<T> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<T>(this.requestUrl(path), body, { headers, context });
  }
}
