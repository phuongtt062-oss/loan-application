import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Response as ExpressResponse } from "express";

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const httpResponse = ctx.getResponse<ExpressResponse>();
    const statusCode = httpResponse.statusCode;

    return next.handle().pipe(
      map((result) => {
        const message = result?.message || "Thao tác thành công!";

        // Tách trường message ra khỏi dữ liệu trả về để tránh trùng lặp
        const { message: _, ...data } = result || {};

        return {
          success: true,
          statusCode: statusCode,
          message: message,
          data: Object.keys(data).length > 0 ? data.user || data : null,
        };
      }),
    );
  }
}
