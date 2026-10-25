export interface LoginModel {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  full_name: string;
  email: string;
  role: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
