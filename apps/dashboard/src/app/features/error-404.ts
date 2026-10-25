import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-404',
  imports: [ButtonModule, RouterLink],
  template: `
    <div class="flex min-h-screen min-w-screen items-center justify-center overflow-hidden">
      <div class="flex flex-col items-center justify-center">
        <div
          style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)"
        >
          <div
            class="flex w-full flex-col items-center bg-white px-8 py-20 sm:px-20"
            style="border-radius: 53px"
          >
            <div class="flex flex-col items-center gap-4">
              <div
                class="flex items-center justify-center rounded-full border-2 border-pink-500"
                style="height: 3.2rem; width: 3.2rem"
              >
                <i class="pi pi-fw pi-exclamation-circle text-2xl! text-pink-500"></i>
              </div>
              <h1 class="py-6 text-5xl font-bold">404</h1>
              <span class="mb-8">Requested resource is not available.</span>
              <img
                src="https://primefaces.org/cdn/templates/sakai/auth/asset-error.svg"
                alt="Error"
                class="mb-8"
                width="80%"
              />
              <div class="col-span-12 mt-8 text-center">
                <p-button label="Go to Dashboard" routerLink="/" severity="danger" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Error404 {}
