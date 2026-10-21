import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsString({ message: "Họ và tên phải là một chuỗi văn bản!" })
  @IsNotEmpty({ message: "Họ và tên không được để trống!" })
  @MaxLength(50, { message: "Họ và tên không được vượt quá 50 ký tự!" })
  full_name: string;

  @IsEmail({}, { message: "Email không đúng định dạng!" })
  @IsNotEmpty({ message: "Email không được để trống!" })
  email: string;

  @IsString({ message: "Mật khẩu phải là một chuỗi văn bản!" })
  @IsNotEmpty({ message: "Mật khẩu không được để trống!" })
  @MinLength(8, {
    message: "Mật khẩu phải có ít nhất 8 ký tự để đảm bảo bảo mật!",
  })
  @MaxLength(32, { message: "Mật khẩu không được vượt quá 32 ký tự!" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Mật khẩu phải chứa ít nhất: 1 chữ hoa, 1 chữ thường và 1 chữ số hoặc ký tự đặc biệt!",
  })
  password: string;

  @IsString({ message: "Số điện thoại phải là chuỗi số!" })
  @IsOptional()
  @Matches(/(0[3|5|7|8|9])+([0-9]{8})\b/g, {
    message: "Số điện thoại Việt Nam không đúng định dạng!",
  })
  phone?: string;
}
