import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-403',
  imports: [ButtonModule, RouterLink],
  template: `
    <div class="flex min-h-screen min-w-screen items-center justify-center overflow-hidden">
      <div class="flex flex-col items-center justify-center">
        <div
          style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)"
        >
          <div
            class="flex w-full flex-col items-center bg-white px-8 py-20 sm:px-20"
            style="border-radius: 53px"
          >
            <div class="flex flex-col items-center gap-4">
              <div
                class="flex items-center justify-center rounded-full border-2 border-orange-500"
                style="width: 3.2rem; height: 3.2rem"
              >
                <i class="pi pi-fw pi-lock text-2xl! text-orange-500"></i>
              </div>
              <h1 class="py-6 text-4xl font-bold">Access Denied</h1>
              <span class="mb-8"
                >You do not have the necessary permisions. Please contact admins.</span
              >
              <img
                src="https://primefaces.org/cdn/templates/sakai/auth/asset-access.svg"
                alt="Access denied"
                class="mb-8"
                width="80%"
              />
              <div class="col-span-12 mt-8 text-center">
                <p-button label="Go to Dashboard" routerLink="/" severity="warn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Error403 {}
