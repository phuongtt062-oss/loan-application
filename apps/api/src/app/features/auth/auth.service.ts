import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { CustomException } from "../../core/exceptions/custom.exception";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // Register
  async register(registerDto: RegisterDto) {
    const { full_name, email, password, phone } = registerDto;

    // Kiểm tra xem email đã tồn tại trong hệ thống chưa
    const existingUser = await this.prisma.users.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new CustomException("Email này đã được đăng ký sử dụng!");
    }

    // Thực hiện băm (hash) mật khẩu chữ thô với vòng lặp băm tự động (Salt)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Lưu thông tin user mới vào PostgreSQL thông qua Prisma
    const newUser = await this.prisma.users.create({
      data: {
        full_name,
        email: email.toLowerCase(),
        password_hash: hashedPassword, // Lưu chuỗi đã mã hóa vào database
        phone,
        role: "APPLICANT", // Gán quyền mặc định đúng như thiết kế DB
        is_active: true,
      },
    });

    // Giấu mật khẩu đã băm trước khi trả kết quả về cho Client để an toàn
    const { password_hash: _, ...result } = newUser;
    return {
      message: "Đăng ký tài khoản thành công!",
      user: result,
    };
  }

  // Login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Tìm người dùng theo email viết thường
    const user = await this.prisma.users.findFirst({
      where: { email: email.toLowerCase() },
    });

    // Nếu không thấy user hoặc tài khoản đã bị khóa (is_active = false)
    if (!user || !user.is_active) {
      throw new CustomException("Email hoặc mật khẩu không đúng!");
    }

    // Đối chiếu mật khẩu thô gửi lên với chuỗi băm trong DB
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new CustomException("Email hoặc mật khẩu không đúng!");
    }

    const { password_hash: _, ...result } = user;
    return {
      message: "Đăng nhập thành công!",
      user: result,
    };
  }
}
