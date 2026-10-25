import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { form, FormField, required } from "@angular/forms/signals";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { ToastService } from "@core/services/toast.service";
import { LoginModel } from "@features/auth/models/login.model";
import { AuthService } from "@features/auth/services/auth.service";
import { APP_ROUTES } from "@core/constants/app.constants";

@Component({
  selector: "app-login",
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToastModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    FormField,
  ],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  submitted = signal(false);
  isReadyToSubmit = computed(() => this.loginForm().valid());

  loginModel = signal<LoginModel>({
    email: "",
    password: "",
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: "Vui lòng nhập tên đăng nhập" });
    required(schemaPath.password, { message: "Vui lòng nhập mật khẩu" });
  });

  emailErrors = computed(() => {
    const shouldShow = this.submitted() || this.loginForm.email().touched();
    return shouldShow ? this.loginForm.email().errors() : [];
  });

  passwordErrors = computed(() => {
    const shouldShow = this.submitted() || this.loginForm.password().touched();
    return shouldShow ? this.loginForm.password().errors() : [];
  });

  onSubmit(): void {
    this.submitted.set(true);

    if (!this.isReadyToSubmit()) {
      this.toast.error("Lỗi", "Vui lòng điền đầy đủ các trường!", 3000);
      return;
    }

    const model = {
      email: this.loginModel().email.trim(),
      password: this.loginModel().password,
    };

    this.auth.login(model).subscribe({
      next: () => {
        this.toast.success("Thông báo", "Đăng nhập thành công!", 2000);
        this.submitted.set(false);
        void this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
      },
      error: (error: unknown) => {
        this.toast.error(
          "Lỗi",
          error instanceof Error ? error.message : "Đăng nhập thất bại!",
        );
      },
    });
  }
}
