/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { TransformInterceptor } from "./app/core/interceptors/transform.interceptor";
import { HttpExceptionFilter } from "./app/core/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Chặn dữ liệu xấu ngay khi nhận Request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính lạ không được khai báo trong DTO
      transform: true, // Chuyển đổi kiểu dữ liệu (ví dụ chuỗi số thành kiểu number)
    }),
  );

  // Gom lỗi và trả về định dạng success: false
  app.useGlobalFilters(new HttpExceptionFilter());

  // Chuẩn hóa dữ liệu trả về khi API đã chạy thành công
  app.useGlobalInterceptors(new TransformInterceptor());

  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
