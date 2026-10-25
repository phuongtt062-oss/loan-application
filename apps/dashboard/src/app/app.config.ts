import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { MessageService } from "primeng/api";
import { providePrimeNG } from "primeng/config";
import Aura from "@primeuix/themes/aura";
import { authInterceptor } from "@core/interceptors/auth.interceptor";
import { errorInterceptor } from "@core/interceptors/error.interceptor";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([errorInterceptor, authInterceptor]),
    ),
    provideRouter(routes),
    providePrimeNG({
      license:
        "eyJpZCI6IjE4NWQ3NTgyLTUwYTEtNGU3Yi1iNTcyLWU3MDlhMjExZDJiYyIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTI2ODYwNTMsImV4cCI6MTgyNDIyMjA1M30.YJ4Zl8YNs1K1liizwJgvx_yzMVURFhMXiS9mzdVYCse9ohldpQ2RBdGwdFutmq2aJUB8iSp9XNsaWD38e2e6DQ",
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".app-dark",
        },
      },
    }),
  ],
};
