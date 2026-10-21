# Loan Monorepo

Monorepo quản lý các ứng dụng trong dự án cho vay, sử dụng Nx để chạy các tác vụ chung:

- **API**: NestJS, Prisma và PostgreSQL.
- **Dashboard**: ứng dụng Angular.
- **Mobile**: ứng dụng Flutter.

## Cấu trúc thư mục

```text
apps/
  api/          # NestJS API
  api-e2e/      # Kiểm thử đầu-cuối cho API
  dashboard/    # Angular web app
  mobile_app/   # Flutter app
prisma/
  schema.prisma # Mô hình dữ liệu PostgreSQL
```

## Yêu cầu

- Node.js và npm (phiên bản tương thích với Nx/Angular trong `package.json`).
- PostgreSQL nếu chạy API.
- Flutter SDK và trình duyệt Chrome nếu chạy mobile app theo cấu hình Nx hiện tại.

## Cài đặt

Tại thư mục gốc repository:

```sh
npm i
```

### Cấu hình PostgreSQL

API cần biến môi trường `DATABASE_URL`, ví dụ:

```text
postgresql://<user>:<password>@localhost:5432/<database>?schema=public
```

Đặt biến này trong môi trường của tiến trình chạy API. Ví dụ PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://<user>:<password>@localhost:5432/<database>?schema=public"
```

Hoặc Bash:

```sh
export DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>?schema=public"
```

Không đưa thông tin kết nối thật hoặc mật khẩu vào Git. Prisma schema nằm ở `prisma/schema.prisma`; cấu hình CLI nằm ở `prisma7.config.ts`. Sinh Prisma Client sau khi cài dependencies hoặc khi schema thay đổi:

```sh
npx prisma generate
```

Nếu cần đồng bộ schema với **cơ sở dữ liệu phát triển cục bộ** và dự án chưa có migration, có thể dùng:

```sh
npx prisma db push
```

`db push` đồng bộ trực tiếp schema, không tạo migration. Không chạy trên cơ sở dữ liệu dùng chung hoặc production nếu chưa đánh giá tác động và sao lưu dữ liệu.

## Chạy ứng dụng

Chạy từng ứng dụng riêng:

```sh
npx nx serve api
npx nx serve dashboard
npx nx serve mobile-app
```

- API mặc định chạy tại `http://localhost:3000`, với prefix `/api`.
- Dashboard chạy bằng Angular dev server; Nx sẽ hiển thị địa chỉ local trong terminal.
- Mobile chạy trên Chrome theo target Nx hiện tại. Cần cài Flutter SDK và dependencies của app trước:

Để thử khởi chạy cả ba target bằng script có sẵn:

```sh
npm run start
```

Script này chạy API, dashboard và mobile đồng thời; yêu cầu môi trường Flutter đã sẵn sàng. Nếu chỉ phát triển API hoặc dashboard, nên dùng lệnh Nx riêng ở trên.

