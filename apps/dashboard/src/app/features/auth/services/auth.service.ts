import { HttpContext } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { API_PATHS, STORAGE_KEYS } from "@core/constants/app.constants";
import { LocalStorageService } from "@core/services/storage.service";
import { SKIP_AUTH } from "@core/tokens/http-context.tokens";
import { ApiResponse } from "@core/types/app.types";
import { map, Observable, tap } from "rxjs";
import { BaseApiService } from "../../../core/services/base-api.service";
import { LoginModel, LoginResponse } from "../models/login.model";

@Injectable({ providedIn: "root" })
export class AuthService extends BaseApiService {
  protected override readonly apiName = API_PATHS.AUTH;

  private readonly storage = inject(LocalStorageService);
  private readonly token = signal<string | null>(this.getAccessToken());
  private readonly publicAuthContext = new HttpContext().set(SKIP_AUTH, true);

  readonly accessToken = this.token.asReadonly();
  readonly isAuthenticated = computed(
    () => this.token() !== null && this.token() !== "",
  );

  login(model: LoginModel): Observable<string> {
    return this.postApi<ApiResponse<LoginResponse>>(
      API_PATHS.LOGIN,
      model,
      this.publicAuthContext,
    ).pipe(
      map((auth) => {
        const token = auth.data?.access_token;

        if (!auth?.success || typeof token !== "string" || !token.trim()) {
          throw new Error("Phản hồi đăng nhập không hợp lệ");
        }

        return token.trim();
      }),
      tap((token) => this.setAccessToken(token)),
    );
  }

  private setAccessToken(token: string): void {
    this.storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    this.token.set(token);
  }

  private getAccessToken(): string | null {
    return this.storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  clearSession(): void {
    this.storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.token.set(null);
  }
}
