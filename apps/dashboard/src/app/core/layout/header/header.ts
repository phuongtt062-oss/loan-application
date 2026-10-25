import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { APP_ROUTES } from "@core/constants/app.constants";
import { LayoutService } from "@core/services/layout.service";
import { AuthService } from "@features/auth/services/auth.service";
import { MenuItem } from "primeng/api";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { Menu, MenuModule } from "primeng/menu";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { StyleClassModule } from "primeng/styleclass";

@Component({
  selector: "app-header",
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    MenuModule,
    OverlayBadgeModule,
    ButtonModule,
    AvatarModule,
  ],
  templateUrl: "./header.html",
  styleUrl: "./header.scss",
})
export class Header {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  layoutService = inject(LayoutService);

  @ViewChild("profileMenu") private profileMenuRef?: Menu;

  readonly profileItems: MenuItem[] = [
    {
      label: "Hồ sơ cá nhân",
      icon: "pi pi-id-card",
    },
    { separator: true },
    {
      label: "Đăng xuất",
      icon: "pi pi-sign-out",
      command: () => {
        this.logout();
      },
    },
  ];

  private logout(): void {
    this.auth.clearSession();
    this.router.navigate([APP_ROUTES.AUTH, APP_ROUTES.LOGIN]);
  }
}
